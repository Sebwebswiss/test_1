import { useHA } from '@/context/HAContext';
import { Clock, Zap, Moon, Sun, TrendingUp, Calendar } from 'lucide-react';

// Tarife za Hrvatsku
const VT_PRICE = 0.21; // EUR/kWh - viša tarifa (dnevna)
const NT_PRICE = 0.11; // EUR/kWh - niža tarifa (noćna)
const NT_START_HOUR = 21; // Noćna tarifa počinje u 21:00
const NT_END_HOUR = 7;    // Noćna tarifa završava u 07:00

function isNightTariff(): boolean {
  const hour = new Date().getHours();
  return hour >= NT_START_HOUR || hour < NT_END_HOUR;
}

function getNextTariffChange(): string {
  if (isNightTariff()) {
    // Trenutno je NT, prelazak na VT u 07:00
    return '07:00';
  } else {
    // Trenutno je VT, prelazak na NT u 21:00
    return '21:00';
  }
}

function formatEur(value: number): string {
  return value.toFixed(2) + ' €';
}

export function TariffInfo() {
  const { isDemo, energyEntities } = useHA();
  
  const isNT = isNightTariff();
  const currentTariff = isNT ? 'Niža tarifa (NT)' : 'Viša tarifa (VT)';
  const currentPrice = isNT ? NT_PRICE : VT_PRICE;
  const nextChange = getNextTariffChange();

  // Izračunaj dnevnu i mjesečnu potrošnju iz HA senzora
  let dailyVT = 0;
  let dailyNT = 0;
  let monthlyVT = 0;
  let monthlyNT = 0;
  let hasRealData = false;

  if (!isDemo && energyEntities) {
    // Pokušaj pronaći senzore za VT i NT
    for (const sensor of energyEntities.energy) {
      const entityId = sensor.entity_id.toLowerCase();
      const friendlyName = String(sensor.attributes.friendly_name || '').toLowerCase();
      const val = parseFloat(sensor.state);
      
      if (isNaN(val)) continue;
      
      // Dnevna potrošnja VT
      if (entityId.includes('daily_vt') || entityId.includes('dnevna_vt') || 
          friendlyName.includes('dnevna vt') || friendlyName.includes('daily vt') ||
          entityId.includes('day_energy_vt') || entityId.includes('energia_vt_danas')) {
        dailyVT = val;
        hasRealData = true;
      }
      // Dnevna potrošnja NT
      else if (entityId.includes('daily_nt') || entityId.includes('dnevna_nt') || 
               friendlyName.includes('dnevna nt') || friendlyName.includes('daily nt') ||
               entityId.includes('day_energy_nt') || entityId.includes('energia_nt_danas')) {
        dailyNT = val;
        hasRealData = true;
      }
      // Mjesečna potrošnja VT
      else if (entityId.includes('monthly_vt') || entityId.includes('mjesecna_vt') || 
               friendlyName.includes('mjesečna vt') || friendlyName.includes('monthly vt') ||
               entityId.includes('month_energy_vt') || entityId.includes('energia_vt_mjesec')) {
        monthlyVT = val;
        hasRealData = true;
      }
      // Mjesečna potrošnja NT
      else if (entityId.includes('monthly_nt') || entityId.includes('mjesecna_nt') || 
               friendlyName.includes('mjesečna nt') || friendlyName.includes('monthly nt') ||
               entityId.includes('month_energy_nt') || entityId.includes('energia_nt_mjesec')) {
        monthlyNT = val;
        hasRealData = true;
      }
      // Generički dnevni senzor - podijeli po tarifi (procjena)
      else if ((entityId.includes('daily') || entityId.includes('dnevn') || entityId.includes('today')) && 
               !entityId.includes('vt') && !entityId.includes('nt')) {
        // Procjena: 60% VT, 40% NT
        dailyVT = val * 0.6;
        dailyNT = val * 0.4;
        hasRealData = true;
      }
      // Generički mjesečni senzor
      else if ((entityId.includes('monthly') || entityId.includes('mjesec') || entityId.includes('month')) && 
               !entityId.includes('vt') && !entityId.includes('nt')) {
        // Procjena: 60% VT, 40% NT
        monthlyVT = val * 0.6;
        monthlyNT = val * 0.4;
        hasRealData = true;
      }
    }
  }

  // Demo podaci ako nema pravih
  if (!hasRealData) {
    dailyVT = 12.4;
    dailyNT = 8.2;
    monthlyVT = 285.6;
    monthlyNT = 178.4;
  }

  // Izračunaj troškove
  const dailyVTCost = dailyVT * VT_PRICE;
  const dailyNTCost = dailyNT * NT_PRICE;
  const dailyTotalCost = dailyVTCost + dailyNTCost;
  const dailyTotal = dailyVT + dailyNT;

  const monthlyVTCost = monthlyVT * VT_PRICE;
  const monthlyNTCost = monthlyNT * NT_PRICE;
  const monthlyTotalCost = monthlyVTCost + monthlyNTCost;
  const monthlyTotal = monthlyVT + monthlyNT;

  // Ušteda korištenjem NT umjesto VT
  const potentialSaving = monthlyNT * (VT_PRICE - NT_PRICE);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-5 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} className="text-yellow-300" />
        <h3 className="text-lg font-semibold">Tarifni podaci</h3>
        {!isDemo && hasRealData && (
          <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Trenutna tarifa */}
        <div className="flex items-center justify-between">
          <span className="text-indigo-200 text-sm">Trenutna tarifa</span>
          <span className={`font-semibold text-sm px-3 py-1 rounded-full ${isNT ? 'bg-indigo-900/50' : 'bg-yellow-500/30'}`}>
            {isNT ? <Moon size={12} className="inline mr-1" /> : <Sun size={12} className="inline mr-1" />}
            {currentTariff}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-indigo-200 text-sm">Cijena</span>
          <span className="font-bold text-xl">
            {currentPrice.toFixed(2)} <span className="text-sm font-normal text-indigo-200">€/kWh</span>
          </span>
        </div>

        <div className="h-px bg-white/20" />

        {/* Dnevna potrošnja */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp size={16} className="text-yellow-300" />
            Danas
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
                <Sun size={12} /> VT (07-21h)
              </div>
              <p className="text-lg font-bold">{dailyVT.toFixed(1)} <span className="text-xs font-normal">kWh</span></p>
              <p className="text-xs text-indigo-300">{formatEur(dailyVTCost)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
                <Moon size={12} /> NT (21-07h)
              </div>
              <p className="text-lg font-bold">{dailyNT.toFixed(1)} <span className="text-xs font-normal">kWh</span></p>
              <p className="text-xs text-indigo-300">{formatEur(dailyNTCost)}</p>
            </div>
          </div>
          <div className="flex justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
            <span className="text-indigo-200">Ukupno danas</span>
            <span className="font-semibold">{dailyTotal.toFixed(1)} kWh • {formatEur(dailyTotalCost)}</span>
          </div>
        </div>

        <div className="h-px bg-white/20" />

        {/* Mjesečna potrošnja */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar size={16} className="text-yellow-300" />
            Ovaj mjesec
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
                <Sun size={12} /> VT
              </div>
              <p className="text-lg font-bold">{monthlyVT.toFixed(1)} <span className="text-xs font-normal">kWh</span></p>
              <p className="text-xs text-indigo-300">{formatEur(monthlyVTCost)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-indigo-200 mb-1">
                <Moon size={12} /> NT
              </div>
              <p className="text-lg font-bold">{monthlyNT.toFixed(1)} <span className="text-xs font-normal">kWh</span></p>
              <p className="text-xs text-indigo-300">{formatEur(monthlyNTCost)}</p>
            </div>
          </div>
          <div className="flex justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
            <span className="text-indigo-200">Ukupno mjesec</span>
            <span className="font-semibold">{monthlyTotal.toFixed(1)} kWh • {formatEur(monthlyTotalCost)}</span>
          </div>
        </div>

        <div className="h-px bg-white/20" />

        {/* Info o tarifama */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Sun size={18} className="text-yellow-300" />
            </div>
            <div>
              <p className="text-sm font-medium">Viša tarifa (VT)</p>
              <p className="text-xs text-indigo-200">{VT_PRICE.toFixed(2)} €/kWh • 07:00 - 21:00</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Moon size={18} className="text-indigo-200" />
            </div>
            <div>
              <p className="text-sm font-medium">Niža tarifa (NT)</p>
              <p className="text-xs text-indigo-200">{NT_PRICE.toFixed(2)} €/kWh • 21:00 - 07:00</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Clock size={18} className="text-indigo-200" />
            </div>
            <div>
              <p className="text-sm font-medium">Sljedeća promjena</p>
              <p className="text-xs text-indigo-200">Danas u {nextChange}</p>
            </div>
          </div>
        </div>

        {/* Savjet za uštedu */}
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs text-indigo-100">
            💡 Ušteda korištenjem NT: <span className="font-bold text-yellow-300">{formatEur(potentialSaving)}</span> ovaj mjesec
          </p>
          <p className="text-xs text-indigo-200 mt-1">
            Prebacite pranje, sušenje i punjenje u noćnu tarifu (nakon 21:00) za dodatnu uštedu!
          </p>
        </div>
      </div>
    </div>
  );
}
