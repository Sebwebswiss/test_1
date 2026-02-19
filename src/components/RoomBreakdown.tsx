import { rooms } from '@/data/mockData';
import { Home, ChefHat, Bath, BriefcaseBusiness, Bed, LayoutGrid } from 'lucide-react';

const roomIcons: Record<string, React.ReactNode> = {
  'Dnevna soba': <Home size={16} />,
  'Kuhinja': <ChefHat size={16} />,
  'Kupatilo': <Bath size={16} />,
  'Radna soba': <BriefcaseBusiness size={16} />,
  'Spavaća soba': <Bed size={16} />,
  'Razno': <LayoutGrid size={16} />,
};

const roomColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#e879f9', '#f472b6', '#94a3b8'];

export function RoomBreakdown() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Potrošnja po sobama</h3>
        <p className="text-sm text-gray-400">Dnevni pregled</p>
      </div>

      <div className="space-y-3">
        {rooms.map((room, i) => (
          <div key={room.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">
                  {roomIcons[room.name] || <LayoutGrid size={16} />}
                </span>
                <span className="text-sm font-medium text-gray-700">{room.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">{room.kwh} kWh</span>
                <span className="text-xs text-gray-400">({room.percentage}%)</span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${room.percentage}%`,
                  backgroundColor: roomColors[i],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
