import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { deviceConsumptionPie } from '@/data/mockData';

export function ConsumptionPie() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Raspodjela potrošnje</h3>
        <p className="text-sm text-gray-400">Po uređajima (%)</p>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={deviceConsumptionPie}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {deviceConsumptionPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '13px',
              }}
              formatter={(value) => [`${value}%`, 'Udio']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {deviceConsumptionPie.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-500 truncate">{item.name} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
