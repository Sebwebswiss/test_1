import { Activity } from 'lucide-react';
import { useHA } from '@/context/HAContext';

export function LivePower() {
  const { isDemo, energyEntities } = useHA();

  // If connected, sum all power sensors
  let totalPower = 0;
  let voltage = '—';
  let currentA = '—';
  let powerFactor = '—';

  if (!isDemo && energyEntities) {
    for (const s of energyEntities.power) {
      const val = parseFloat(s.state);
      if (!isNaN(val)) {
        const unit = String(s.attributes.unit_of_measurement || '').toLowerCase();
        totalPower += unit === 'kw' ? val * 1000 : val;
      }
    }
    if (energyEntities.voltage.length > 0) {
      const v = parseFloat(energyEntities.voltage[0].state);
      if (!isNaN(v)) voltage = `${Math.round(v)} V`;
    }
    if (energyEntities.current.length > 0) {
      const a = parseFloat(energyEntities.current[0].state);
      if (!isNaN(a)) currentA = `${a.toFixed(1)} A`;
    }
  } else {
    totalPower = 4280;
    voltage = '228 V';
    currentA = '18.8 A';
    powerFactor = '0.97';
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />

      <div className="flex items-center gap-3 relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <Activity size={24} className="animate-pulse" />
        </div>
        <div>
          <p className="text-indigo-100 text-sm flex items-center gap-2">
            Trenutna potrošnja
            {!isDemo && (
              <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
            )}
            {isDemo && (
              <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-medium">
                DEMO
              </span>
            )}
          </p>
          <p className="text-3xl font-bold">
            {totalPower >= 1000 ? `${(totalPower / 1000).toFixed(1)}` : Math.round(totalPower)}{' '}
            <span className="text-lg font-normal text-indigo-200">{totalPower >= 1000 ? 'kW' : 'W'}</span>
          </p>
        </div>
      </div>
      <div className="sm:ml-auto flex flex-wrap gap-4 relative">
        <div className="text-center">
          <p className="text-indigo-200 text-xs">Napon</p>
          <p className="text-lg font-semibold">{voltage}</p>
        </div>
        <div className="text-center">
          <p className="text-indigo-200 text-xs">Struja</p>
          <p className="text-lg font-semibold">{currentA}</p>
        </div>
        <div className="text-center">
          <p className="text-indigo-200 text-xs">Faktor snage</p>
          <p className="text-lg font-semibold">{powerFactor}</p>
        </div>
      </div>
    </div>
  );
}
