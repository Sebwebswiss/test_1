import { useHA } from '@/context/HAContext';
import { type HAState } from '@/services/homeAssistant';
import {
  Snowflake, Lightbulb, Plug, ToggleLeft, Thermometer, Fan
} from 'lucide-react';
import { cn } from '@/utils/cn';

function getDeviceIcon(state: HAState) {
  const eid = state.entity_id;
  const dc = String(state.attributes.device_class || '');
  if (eid.startsWith('light.')) return <Lightbulb size={18} />;
  if (eid.startsWith('climate.')) return <Thermometer size={18} />;
  if (eid.startsWith('fan.')) return <Fan size={18} />;
  if (dc === 'outlet') return <Plug size={18} />;
  if (dc.includes('cold') || dc.includes('cool')) return <Snowflake size={18} />;
  return <ToggleLeft size={18} />;
}

function friendlyName(s: HAState): string {
  return (s.attributes.friendly_name as string) || s.entity_id.split('.').pop()?.replace(/_/g, ' ') || s.entity_id;
}

export function HADeviceList() {
  const { energyEntities, toggleEntity, isDemo } = useHA();

  if (isDemo || !energyEntities) return null;

  const controllable = [
    ...energyEntities.switches,
    ...energyEntities.lights,
    ...energyEntities.climate,
  ];

  if (controllable.length === 0) return null;

  const activeCount = controllable.filter(d => d.state === 'on').length;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">HA Uređaji</h3>
          <p className="text-sm text-gray-400">Upravljajte direktno iz HA</p>
        </div>
        <span className="text-xs font-medium bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
          {activeCount} aktivno
        </span>
      </div>

      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {controllable.map((device) => {
          const isOn = device.state === 'on';
          return (
            <div
              key={device.entity_id}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl transition-all border',
                isOn
                  ? 'bg-indigo-50/50 border-indigo-100'
                  : 'bg-gray-50/50 border-gray-100'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  isOn
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-200 text-gray-400'
                )}>
                  {getDeviceIcon(device)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{friendlyName(device)}</p>
                  <p className="text-xs text-gray-400 font-mono">{device.entity_id.split('.')[0]}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full',
                  isOn ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                )}>
                  {isOn ? 'ON' : 'OFF'}
                </span>
                <button
                  onClick={() => toggleEntity(device.entity_id)}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    isOn ? 'bg-indigo-500' : 'bg-gray-300'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                    isOn ? 'translate-x-5.5' : 'translate-x-0.5'
                  )} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
