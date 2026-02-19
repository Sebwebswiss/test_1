import { Zap, BarChart3, DollarSign, TrendingDown } from 'lucide-react';
import { useHA } from '@/context/HAContext';
import { StatCard } from '@/components/StatCard';

export function HAStatCards() {
  const { isDemo, energyEntities } = useHA();

  if (isDemo || !energyEntities) {
    // Demo cards
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Danas"
          value="38.3 kWh"
          subtitle="Procjena za cijeli dan: 42 kWh"
          icon={<Zap size={22} />}
          trend={{ value: 12, label: 'od jučer' }}
          colorClass="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Ova sedmica"
          value="316.6 kWh"
          subtitle="Prosjek: 45.2 kWh/dan"
          icon={<BarChart3 size={22} />}
          trend={{ value: -5, label: 'od prošle' }}
          colorClass="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Mjesečni trošak"
          value="162.00 KM"
          subtitle="Budžet: 240.00 KM"
          icon={<DollarSign size={22} />}
          trend={{ value: -8, label: 'od prošlog mj.' }}
          colorClass="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Ušteda"
          value="28.50 KM"
          subtitle="Ostvarena zahvaljujući AI savjetima"
          icon={<TrendingDown size={22} />}
          colorClass="from-amber-500 to-orange-500"
        />
      </div>
    );
  }

  // Connected: compute from HA data
  let totalPowerW = 0;
  let totalEnergyKwh = 0;

  for (const s of energyEntities.power) {
    const val = parseFloat(s.state);
    if (!isNaN(val)) {
      const unit = String(s.attributes.unit_of_measurement || '').toLowerCase();
      totalPowerW += unit === 'kw' ? val * 1000 : val;
    }
  }

  for (const s of energyEntities.energy) {
    const val = parseFloat(s.state);
    if (!isNaN(val)) {
      const unit = String(s.attributes.unit_of_measurement || '').toLowerCase();
      totalEnergyKwh += unit === 'wh' ? val / 1000 : val;
    }
  }

  const pricePerKwh = 0.15;
  const estimatedCost = totalEnergyKwh * pricePerKwh;

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
        title="Ukupna energija"
        value={`${totalEnergyKwh.toFixed(1)} kWh`}
        subtitle={`${energyEntities.energy.length} senzor(a) energije`}
        icon={<BarChart3 size={22} />}
        colorClass="from-purple-500 to-purple-600"
      />
      <StatCard
        title="Procj. trošak"
        value={`${estimatedCost.toFixed(2)} KM`}
        subtitle={`Cijena: ${pricePerKwh} KM/kWh`}
        icon={<DollarSign size={22} />}
        colorClass="from-emerald-500 to-emerald-600"
      />
      <StatCard
        title="Aktivni uređaji"
        value={`${activeDevices} / ${totalDevices}`}
        subtitle="Prekidači, svjetla, klime"
        icon={<TrendingDown size={22} />}
        colorClass="from-amber-500 to-orange-500"
      />
    </div>
  );
}
