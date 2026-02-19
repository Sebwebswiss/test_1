import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import {
  type HAConfig, type HAState,
  getStoredConfig, storeConfig, clearConfig,
  fetchStates, testConnection, callService,
  HAWebSocket, filterEnergyEntities, friendlyName,
} from '@/services/homeAssistant';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface HAContextType {
  config: HAConfig | null;
  status: ConnectionStatus;
  statusMessage: string;
  allStates: Map<string, HAState>;
  energyEntities: ReturnType<typeof filterEnergyEntities> | null;
  connect: (config: HAConfig) => Promise<boolean>;
  disconnect: () => void;
  refreshStates: () => Promise<void>;
  toggleEntity: (entityId: string) => Promise<void>;
  getState: (entityId: string) => HAState | undefined;
  getFriendlyName: (state: HAState) => string;
  isDemo: boolean;
}

const HAContext = createContext<HAContextType | null>(null);

export function useHA() {
  const ctx = useContext(HAContext);
  if (!ctx) throw new Error('useHA must be inside HAProvider');
  return ctx;
}

export function HAProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HAConfig | null>(getStoredConfig);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [statusMessage, setStatusMessage] = useState('');
  const [allStates, setAllStates] = useState<Map<string, HAState>>(new Map());
  const [energyEntities, setEnergyEntities] = useState<ReturnType<typeof filterEnergyEntities> | null>(null);
  const wsRef = useRef<HAWebSocket | null>(null);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDemo = status !== 'connected';

  const processStates = useCallback((states: HAState[]) => {
    const map = new Map<string, HAState>();
    for (const s of states) {
      map.set(s.entity_id, s);
    }
    setAllStates(map);
    setEnergyEntities(filterEnergyEntities(states));
  }, []);

  const handleStateChange = useCallback((entityId: string, newState: HAState) => {
    setAllStates(prev => {
      const next = new Map(prev);
      next.set(entityId, newState);
      // Re-calculate energy entities
      const arr = Array.from(next.values());
      setEnergyEntities(filterEnergyEntities(arr));
      return next;
    });
  }, []);

  const refreshStates = useCallback(async () => {
    if (!config) return;
    try {
      const states = await fetchStates(config);
      processStates(states);
    } catch (err) {
      console.error('[GMHome] Refresh failed:', err);
    }
  }, [config, processStates]);

  const connect = useCallback(async (newConfig: HAConfig): Promise<boolean> => {
    setStatus('connecting');
    setStatusMessage('Povezivanje...');

    const result = await testConnection(newConfig);
    if (!result.ok) {
      setStatus('error');
      setStatusMessage(result.message);
      return false;
    }

    // Save config
    storeConfig(newConfig);
    setConfig(newConfig);
    setStatusMessage(result.message);

    // Fetch initial states
    try {
      const states = await fetchStates(newConfig);
      processStates(states);
    } catch (err) {
      setStatus('error');
      setStatusMessage(`Greška pri dohvaćanju stanja: ${(err as Error).message}`);
      return false;
    }

    // Start WebSocket
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
    const ws = new HAWebSocket(newConfig);
    wsRef.current = ws;
    ws.connect(handleStateChange);

    setStatus('connected');

    // Periodic refresh every 30s
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    refreshIntervalRef.current = setInterval(async () => {
      try {
        const states = await fetchStates(newConfig);
        processStates(states);
      } catch { /* ignore */ }
    }, 30000);

    return true;
  }, [processStates, handleStateChange]);

  const disconnect = useCallback(() => {
    wsRef.current?.disconnect();
    wsRef.current = null;
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    clearConfig();
    setConfig(null);
    setStatus('disconnected');
    setStatusMessage('');
    setAllStates(new Map());
    setEnergyEntities(null);
  }, []);

  const toggleEntity = useCallback(async (entityId: string) => {
    if (!config) return;
    const state = allStates.get(entityId);
    if (!state) return;

    const domain = entityId.split('.')[0];
    const isOn = state.state === 'on';
    
    try {
      if (domain === 'light') {
        await callService(config, 'light', isOn ? 'turn_off' : 'turn_on', entityId);
      } else if (domain === 'switch') {
        await callService(config, 'switch', isOn ? 'turn_off' : 'turn_on', entityId);
      } else if (domain === 'climate') {
        await callService(config, 'climate', isOn ? 'turn_off' : 'turn_on', entityId);
      } else {
        await callService(config, 'homeassistant', isOn ? 'turn_off' : 'turn_on', entityId);
      }
    } catch (err) {
      console.error('[GMHome] Toggle failed:', err);
    }
  }, [config, allStates]);

  const getState = useCallback((entityId: string) => allStates.get(entityId), [allStates]);

  // Auto-connect on mount if config exists
  useEffect(() => {
    const stored = getStoredConfig();
    if (stored) {
      connect(stored);
    }
    return () => {
      wsRef.current?.disconnect();
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HAContext.Provider value={{
      config,
      status,
      statusMessage,
      allStates,
      energyEntities,
      connect,
      disconnect,
      refreshStates,
      toggleEntity,
      getState,
      getFriendlyName: friendlyName,
      isDemo,
    }}>
      {children}
    </HAContext.Provider>
  );
}
