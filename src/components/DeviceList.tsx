import { useState } from 'react';
import { devices, type Device } from '@/data/mockData';
import {
  Snowflake, Flame, Monitor, Tv, Lightbulb, Plug, UtensilsCrossed, CookingPot, WashingMachine, Refrigerator
} from 'lucide-react';
import { cn } from '@/utils/cn';

const iconMap: Record<string, React.ReactNode> = {
  snowflake: <Snowflake size={18} />,
  flame: <Flame size={18} />,
  refrigerator: <Refrigerator size={18} />,
  washer: <WashingMachine size={18} />,
  tv: <Tv size={18} />,
  monitor: <Monitor size={18} />,
  lightbulb: <Lightbulb size={18} />,
  utensils: <UtensilsCrossed size={18} />,
  cookingPot: <CookingPot size={18} />,
  plug: <Plug size={18} />,
};

export function DeviceList() {
  const [deviceStates, setDeviceStates] = useState<Device[]>(devices);

  const toggleDevice = (id: string) => {
    setDeviceStates(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: d.status === 'on' ? 'off' : 'on', currentWatts: d.status === 'on' ? 0 : d.currentWatts }
        : d
    ));
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Uređaji</h3>
          <p className="text-sm text-gray-400">Upravljanje i pregled potrošnje</p>
        </div>
        <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
          {deviceStates.filter(d => d.status === 'on').length} aktivno
        </span>
      </div>

      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {deviceStates.map((device) => (
          <div
            key={device.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-xl transition-all border',
              device.status === 'on'
                ? 'bg-indigo-50/50 border-indigo-100'
                : 'bg-gray-50/50 border-gray-100'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg',
                device.status === 'on'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-200 text-gray-400'
              )}>
                {iconMap[device.icon] || <Plug size={18} />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{device.name}</p>
                <p className="text-xs text-gray-400">{device.room}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">
                  {device.status === 'on' ? `${device.currentWatts}W` : 'Isklj.'}
                </p>
                <p className="text-xs text-gray-400">{device.dailyKwh} kWh/dan</p>
              </div>
              <button
                onClick={() => toggleDevice(device.id)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  device.status === 'on' ? 'bg-indigo-500' : 'bg-gray-300'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                  device.status === 'on' ? 'translate-x-5.5' : 'translate-x-0.5'
                )} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
