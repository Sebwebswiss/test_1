import { useHA } from '@/context/HAContext';
import { Zap, Battery, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';

export function HAPowerSensors() {
  const { energyEntities, isDemo } = useHA();

  if (isDemo || !energyEntities) return null;

  const allSensors = [...energyEntities.power, ...energyEntities.energy];
  if (allSensors.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Senzori energije</h3>
          <p className="text-sm text-gray-400">Real-time podaci iz Home Assistant</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {allSensors.map((sensor) => {
          const name = (sensor.attributes.friendly_name as string) || sensor.entity_id;
          const unit = String(sensor.attributes.unit_of_measurement || '');
          const val = parseFloat(sensor.state);
          const isPower = unit.toLowerCase() === 'w' || unit.toLowerCase() === 'kw';
          const isHigh = isPower && val > 500;

          return (
            <div
              key={sensor.entity_id}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl border transition-all',
                isHigh ? 'bg-amber-50/50 border-amber-100' : 'bg-gray-50/50 border-gray-100'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  isPower
                    ? isHigh ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                    : 'bg-purple-100 text-purple-600'
                )}>
                  {isPower ? <Zap size={18} /> : unit.toLowerCase().includes('kwh') ? <Battery size={18} /> : <TrendingUp size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">{sensor.entity_id}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-2">
                <p className={cn(
                  'text-lg font-bold tabular-nums',
                  isHigh ? 'text-amber-600' : isPower ? 'text-indigo-600' : 'text-purple-600'
                )}>
                  {isNaN(val) ? sensor.state : val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(1)}
                </p>
                <p className="text-xs text-gray-400">{unit}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
