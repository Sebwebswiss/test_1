import { Zap, BarChart3, Euro, TrendingDown } from 'lucide-react';
import { useHA } from '@/context/HAContext';
import { StatCard } from '@/components/StatCard';

// Hrvatske tarife
const VT_PRICE = 0.21; // EUR/kWh
const NT_PRICE = 0.11; // EUR/kWh
const AVG_PRICE = 0.16; // Prosječna cijena

export function HAStatCards() {
  const { isDemo, energyEntities } = useHA();

  if (isDemo || !energyEntities) {
    // Demo cards
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Danas"
          value="20.6 kWh"
          subtitle="VT: 12.4 kWh • NT: 8.2 kWh"
          icon={<Zap size={22} />}
          trend={{ value: 8, label: 'od jučer' }}
          colorClass="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Ovaj tjedan"
          value="156.2 kWh"
          subtitle="Prosjek: 22.3 kWh/dan"
          icon={<BarChart3 size={22} />}
          trend={{ value: -5, label: 'od prošlog' }}
          colorClass="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Mjesečni trošak"
          value="78.50 €"
          subtitle="VT: 59.98 € • NT: 19.62 €"
          icon={<Euro size={22} />}
          trend={{ value: -12, label: 'od prošlog mj.' }}
          colorClass="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Ušteda (NT)"
          value="18.40 €"
          subtitle="Korištenjem noćne tarife"
          icon={<TrendingDown size={22} />}
          colorClass="from-amber-500 to-orange-500"
        />
      </div>
    );
  }

  // Connected: compute from HA data
  let totalPowerW = 0;
  let dailyEnergyKwh = 0;
  let monthlyEnergyKwh = 0;

  for (const s of energyEntities.power) {
    const val = parseFloat(s.state);
    if (!isNaN(val)) {
      const unit = String(s.attributes.unit_of_measurement || '').toLowerCase();
      totalPowerW += unit === 'kw' ? val * 1000 : val;
    }
  }

  // Pronađi dnevne i mjesečne senzore
  for (const s of energyEntities.energy) {
    const val = parseFloat(s.state);
    if (isNaN(val)) continue;
    
    const entityId = s.entity_id.toLowerCase();
    const friendlyName = String(s.attributes.friendly_name || '').toLowerCase();
    const unit = String(s.attributes.unit_of_measurement || '').toLowerCase();
    
    const kwh = unit === 'wh' ? val / 1000 : val;
    
    if (entityId.includes('daily') || entityId.includes('dnevn') || entityId.includes('today') ||
        friendlyName.includes('daily') || friendlyName.includes('dnevn') || friendlyName.includes('danas')) {
      dailyEnergyKwh += kwh;
    }
    if (entityId.includes('monthly') || entityId.includes('mjesec') || entityId.includes('month') ||
        friendlyName.includes('monthly') || friendlyName.includes('mjesečn') || friendlyName.includes('mjesec')) {
      monthlyEnergyKwh += kwh;
    }
  }

  // Ako nema specifičnih senzora, koristi ukupnu energiju
  if (dailyEnergyKwh === 0) {
    for (const s of energyEntities.energy) {
      const val = parseFloat(s.state);
      if (!isNaN(val)) {
        const unit = String(s.attributes.unit_of_measurement || '').toLowerCase();
        dailyEnergyKwh += unit === 'wh' ? val / 1000 : val;
      }
    }
  }

  // Procjena troška (60% VT, 40% NT)
  const estimatedDailyCost = dailyEnergyKwh * AVG_PRICE;
  const estimatedMonthlyCost = monthlyEnergyKwh > 0 ? monthlyEnergyKwh * AVG_PRICE : estimatedDailyCost * 30;
  
  // Ušteda korištenjem NT
  const ntSaving = (monthlyEnergyKwh > 0 ? monthlyEnergyKwh : dailyEnergyKwh * 30) * 0.4 * (VT_PRICE - NT_PRICE);

  const activeDevices = [
    ...energyEntities.switches,
    ...energyEntities.lights,
    ...energyEntities.climate,
  ].filter(s => s.state === 'on').length;

  const totalDevices = energyEntities.switches.length + energyEntities.lights.length + energyEntities.climate.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Trenutna snaga"
        value={totalPowerW >= 1000 ? `${(totalPowerW / 1000).toFixed(1)} kW` : `${Math.round(totalPowerW)} W`}
        subtitle={`${energyEntities.power.length} senzor(a) snage`}
        icon={<Zap size={22} />}
        colorClass="from-indigo-500 to-indigo-600"
      />
      <StatCard
        title="Danas"
        value={`${dailyEnergyKwh.toFixed(1)} kWh`}
        subtitle={`Trošak: ${estimatedDailyCost.toFixed(2)} €`}
        icon={<BarChart3 size={22} />}
        colorClass="from-purple-500 to-purple-600"
      />
      <StatCard
        title="Mjesečni trošak"
        value={`${estimatedMonthlyCost.toFixed(2)} €`}
        subtitle={`VT: ${VT_PRICE} €/kWh • NT: ${NT_PRICE} €/kWh`}
        icon={<Euro size={22} />}
        colorClass="from-emerald-500 to-emerald-600"
      />
      <StatCard
        title="Aktivni uređaji"
        value={`${activeDevices} / ${totalDevices}`}
        subtitle={ntSaving > 0 ? `NT ušteda: ${ntSaving.toFixed(2)} €` : 'Prekidači, svjetla, klime'}
        icon={<TrendingDown size={22} />}
        colorClass="from-amber-500 to-orange-500"
      />
    </div>
  );
}
