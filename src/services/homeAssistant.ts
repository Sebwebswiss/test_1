// Home Assistant REST API & WebSocket Service

export interface HAConfig {
  url: string;
  token: string;
}

export interface HAState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HAEvent {
  event_type: string;
  data: {
    entity_id: string;
    new_state: HAState;
    old_state: HAState;
  };
}

// Storage keys
const CONFIG_KEY = 'gmhome_ha_config';

export function getStoredConfig(): HAConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

export function storeConfig(config: HAConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}

// Normalize URL
function normalizeUrl(url: string): string {
  let u = url.trim();
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = 'http://' + u;
  }
  if (u.endsWith('/')) u = u.slice(0, -1);
  return u;
}

// REST API calls
export async function testConnection(config: HAConfig): Promise<{ ok: boolean; message: string }> {
  try {
    const url = normalizeUrl(config.url);
    const resp = await fetch(`${url}/api/`, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
    });
    if (resp.ok) {
      const data = await resp.json();
      return { ok: true, message: `Povezano sa Home Assistant: ${data.message || 'OK'}` };
    }
    return { ok: false, message: `Greška: ${resp.status} ${resp.statusText}` };
  } catch (err) {
    return { ok: false, message: `Nije moguće spojiti se: ${(err as Error).message}` };
  }
}

export async function fetchStates(config: HAConfig): Promise<HAState[]> {
  const url = normalizeUrl(config.url);
  const resp = await fetch(`${url}/api/states`, {
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

export async function fetchHistory(
  config: HAConfig,
  entityId: string,
  startTime: Date,
  endTime?: Date,
): Promise<HAState[][]> {
  const url = normalizeUrl(config.url);
  let histUrl = `${url}/api/history/period/${startTime.toISOString()}?filter_entity_id=${entityId}`;
  if (endTime) histUrl += `&end_time=${endTime.toISOString()}`;
  const resp = await fetch(histUrl, {
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

export async function callService(
  config: HAConfig,
  domain: string,
  service: string,
  entityId: string,
): Promise<void> {
  const url = normalizeUrl(config.url);
  await fetch(`${url}/api/services/${domain}/${service}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entity_id: entityId }),
  });
}

// WebSocket connection
export class HAWebSocket {
  private ws: WebSocket | null = null;
  private msgId = 1;
  private listeners: Map<string, (data: unknown) => void> = new Map();
  private onStateChange: ((entityId: string, newState: HAState) => void) | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private config: HAConfig;
  private _connected = false;

  constructor(config: HAConfig) {
    this.config = config;
  }

  get connected() { return this._connected; }

  connect(onStateChange: (entityId: string, newState: HAState) => void): void {
    this.onStateChange = onStateChange;
    const url = normalizeUrl(this.config.url);
    const wsUrl = url.replace(/^http/, 'ws') + '/api/websocket';
    
    try {
      this.ws = new WebSocket(wsUrl);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.log('[GMHome] WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        this.handleMessage(msg);
      } catch { /* ignore parse errors */ }
    };

    this.ws.onclose = () => {
      this._connected = false;
      console.log('[GMHome] WebSocket disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this._connected = false;
    };
  }

  private handleMessage(msg: Record<string, unknown>): void {
    if (msg.type === 'auth_required') {
      this.ws?.send(JSON.stringify({
        type: 'auth',
        access_token: this.config.token,
      }));
    } else if (msg.type === 'auth_ok') {
      this._connected = true;
      // Subscribe to state changes
      const id = this.msgId++;
      this.ws?.send(JSON.stringify({
        id,
        type: 'subscribe_events',
        event_type: 'state_changed',
      }));
    } else if (msg.type === 'event') {
      const event = msg.event as HAEvent;
      if (event?.data?.new_state && this.onStateChange) {
        this.onStateChange(event.data.entity_id, event.data.new_state);
      }
    } else if (msg.type === 'result') {
      const id = String(msg.id);
      const listener = this.listeners.get(id);
      if (listener) {
        listener(msg);
        this.listeners.delete(id);
      }
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.onStateChange) {
        this.connect(this.onStateChange);
      }
    }, 5000);
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
    this._connected = false;
  }
}

// Helper: find energy-related entities
export function filterEnergyEntities(states: HAState[]): {
  power: HAState[];
  energy: HAState[];
  voltage: HAState[];
  current: HAState[];
  switches: HAState[];
  lights: HAState[];
  climate: HAState[];
} {
  const power: HAState[] = [];
  const energy: HAState[] = [];
  const voltage: HAState[] = [];
  const current: HAState[] = [];
  const switches: HAState[] = [];
  const lights: HAState[] = [];
  const climate: HAState[] = [];

  for (const s of states) {
    const unit = String(s.attributes.unit_of_measurement || '').toLowerCase();
    const dc = String(s.attributes.device_class || '').toLowerCase();
    const eid = s.entity_id;

    if (dc === 'power' || unit === 'w' || unit === 'kw') {
      power.push(s);
    } else if (dc === 'energy' || unit === 'kwh' || unit === 'wh') {
      energy.push(s);
    } else if (dc === 'voltage' || unit === 'v') {
      voltage.push(s);
    } else if (dc === 'current' || unit === 'a') {
      current.push(s);
    }

    if (eid.startsWith('switch.')) {
      switches.push(s);
    } else if (eid.startsWith('light.')) {
      lights.push(s);
    } else if (eid.startsWith('climate.')) {
      climate.push(s);
    }
  }

  return { power, energy, voltage, current, switches, lights, climate };
}

// Friendly name helper
export function friendlyName(state: HAState): string {
  return (state.attributes.friendly_name as string) || state.entity_id.split('.').pop()?.replace(/_/g, ' ') || state.entity_id;
}
