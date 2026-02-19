import { tariffs } from '@/data/mockData';
import { Clock, Zap, Moon } from 'lucide-react';

export function TariffInfo() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-5 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} className="text-yellow-300" />
        <h3 className="text-lg font-semibold">Tarifni podaci</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-indigo-200 text-sm">Trenutna tarifa</span>
          <span className="font-semibold text-sm bg-white/15 px-3 py-1 rounded-full">
            {tariffs.current}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-indigo-200 text-sm">Cijena</span>
          <span className="font-bold text-xl">
            {tariffs.pricePerKwh} {tariffs.currency}/kWh
          </span>
        </div>

        <div className="h-px bg-white/20" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Moon size={18} className="text-yellow-300" />
          </div>
          <div>
            <p className="text-sm font-medium">Noćna tarifa (NT)</p>
            <p className="text-xs text-indigo-200">
              {tariffs.nightPrice} {tariffs.currency}/kWh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Clock size={18} className="text-indigo-200" />
          </div>
          <div>
            <p className="text-sm font-medium">Prelazak na NT</p>
            <p className="text-xs text-indigo-200">Danas u {tariffs.nextChange}</p>
          </div>
        </div>

        <div className="mt-2 rounded-xl bg-white/10 p-3">
          <p className="text-xs text-indigo-100">
            💡 Uštedite do <span className="font-bold text-yellow-300">47%</span> prebacivanjem pranja i sušenja u noćnu tarifu (22:00 - 06:00)
          </p>
        </div>
      </div>
    </div>
  );
}
