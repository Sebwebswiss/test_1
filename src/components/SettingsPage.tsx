import { useState } from 'react';
import { useHA, type ConnectionStatus } from '@/context/HAContext';
import {
  Settings, Wifi, WifiOff, Check, AlertTriangle, Loader2,
  ExternalLink, Shield, Copy, Eye, EyeOff, Unplug, RefreshCw,
  HelpCircle, Server, Key, Zap
} from 'lucide-react';
import { cn } from '@/utils/cn';

export function SettingsPage() {
  const { config, status, statusMessage, connect, disconnect, allStates, energyEntities, refreshStates } = useHA();
  const [url, setUrl] = useState(config?.url || '');
  const [token, setToken] = useState(config?.token || '');
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleConnect = async () => {
    if (!url.trim() || !token.trim()) return;
    setTesting(true);
    await connect({ url: url.trim(), token: token.trim() });
    setTesting(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setUrl('');
    setToken('');
  };

  const statusConfig: Record<ConnectionStatus, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    disconnected: {
      icon: <WifiOff size={18} />,
      color: 'text-gray-500',
      bg: 'bg-gray-100',
      label: 'Nije povezano',
    },
    connecting: {
      icon: <Loader2 size={18} className="animate-spin" />,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      label: 'Povezivanje...',
    },
    connected: {
      icon: <Wifi size={18} />,
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Povezano',
    },
    error: {
      icon: <AlertTriangle size={18} />,
      color: 'text-red-500',
      bg: 'bg-red-50',
      label: 'Greška',
    },
  };

  const sc = statusConfig[status];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Home Assistant Integracija</h2>
          <p className="text-sm text-gray-400">Povežite GMHome sa vašim Home Assistant serverom</p>
        </div>
      </div>

      {/* Connection Status Card */}
      <div className={cn('rounded-2xl border p-5', sc.bg, status === 'connected' ? 'border-green-200' : status === 'error' ? 'border-red-200' : 'border-gray-200')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', sc.bg, sc.color)}>
              {sc.icon}
            </div>
            <div>
              <p className={cn('font-semibold', sc.color)}>{sc.label}</p>
              {statusMessage && <p className="text-xs text-gray-500 mt-0.5">{statusMessage}</p>}
            </div>
          </div>
          {status === 'connected' && (
            <div className="flex items-center gap-2">
              <button
                onClick={refreshStates}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={14} />
                Osvježi
              </button>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 rounded-lg border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
              >
                <Unplug size={14} />
                Prekini
              </button>
            </div>
          )}
        </div>

        {status === 'connected' && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400">Ukupno entiteta</p>
              <p className="text-lg font-bold text-gray-900">{allStates.size}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400">Senzori snage</p>
              <p className="text-lg font-bold text-indigo-600">{energyEntities?.power.length || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400">Senzori energije</p>
              <p className="text-lg font-bold text-purple-600">{energyEntities?.energy.length || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400">Prekidači</p>
              <p className="text-lg font-bold text-emerald-600">
                {(energyEntities?.switches.length || 0) + (energyEntities?.lights.length || 0)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Connection Form */}
      {status !== 'connected' && (
        <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Server size={18} className="text-indigo-500" />
              Podaci za povezivanje
            </h3>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700"
            >
              <HelpCircle size={14} />
              Pomoć
            </button>
          </div>

          {showHelp && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-blue-800">Kako se povezati?</h4>
              <ol className="text-xs text-blue-700 space-y-2 list-decimal list-inside">
                <li>
                  Otvorite Home Assistant i idite na
                  <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded mx-1">
                    Profil → Long-Lived Access Tokens
                  </span>
                </li>
                <li>Kliknite <strong>"CREATE TOKEN"</strong> i dajte mu naziv (npr. "GMHome")</li>
                <li>Kopirajte generirani token (prikazuje se samo jednom!)</li>
                <li>Unesite URL vašeg Home Assistant servera (npr. <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">http://homeassistant.local:8123</span>)</li>
                <li>Zalijepite token i kliknite "Poveži se"</li>
              </ol>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://developers.home-assistant.io/docs/auth_api/#long-lived-access-token"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Dokumentacija <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Server size={14} className="inline mr-1.5 text-gray-400" />
              Home Assistant URL
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="http://homeassistant.local:8123"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Primjeri: http://192.168.1.100:8123, https://my-ha.duckdns.org</p>
          </div>

          {/* Token Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Key size={14} className="inline mr-1.5 text-gray-400" />
              Long-Lived Access Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-3 pr-20 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                  title={showToken ? 'Sakrij' : 'Prikaži'}
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => navigator.clipboard?.readText().then(t => setToken(t))}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                  title="Zalijepi"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
            <Shield size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Token se čuva lokalno u vašem browseru (localStorage). Nikada se ne šalje trećim stranama. Za maksimalnu sigurnost koristite HTTPS.
            </p>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={!url.trim() || !token.trim() || testing}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all',
              url.trim() && token.trim() && !testing
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            {testing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Povezivanje...
              </>
            ) : (
              <>
                <Zap size={18} />
                Poveži se na Home Assistant
              </>
            )}
          </button>
        </div>
      )}

      {/* Connected: show detected entities */}
      {status === 'connected' && energyEntities && (
        <div className="space-y-4">
          {/* Power sensors */}
          {energyEntities.power.length > 0 && (
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap size={18} className="text-indigo-500" />
                Detektovani senzori snage ({energyEntities.power.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {energyEntities.power.map(s => (
                  <div key={s.entity_id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{friendlyNameHelper(s)}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.entity_id}</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">
                      {s.state} {String(s.attributes.unit_of_measurement || 'W')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Energy sensors */}
          {energyEntities.energy.length > 0 && (
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Check size={18} className="text-emerald-500" />
                Senzori energije ({energyEntities.energy.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {energyEntities.energy.map(s => (
                  <div key={s.entity_id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{friendlyNameHelper(s)}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.entity_id}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">
                      {s.state} {String(s.attributes.unit_of_measurement || 'kWh')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controllable devices */}
          {(energyEntities.switches.length > 0 || energyEntities.lights.length > 0 || energyEntities.climate.length > 0) && (
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings size={18} className="text-purple-500" />
                Upravljivi uređaji ({energyEntities.switches.length + energyEntities.lights.length + energyEntities.climate.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[...energyEntities.switches, ...energyEntities.lights, ...energyEntities.climate].map(s => (
                  <div key={s.entity_id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{friendlyNameHelper(s)}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.entity_id}</p>
                    </div>
                    <span className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      s.state === 'on' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    )}>
                      {s.state === 'on' ? 'Uključen' : 'Isključen'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function friendlyNameHelper(s: { entity_id: string; attributes: Record<string, unknown> }): string {
  return (s.attributes.friendly_name as string) || s.entity_id.split('.').pop()?.replace(/_/g, ' ') || s.entity_id;
}
