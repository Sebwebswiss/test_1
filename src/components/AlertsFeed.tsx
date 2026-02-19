import { alerts } from '@/data/mockData';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const alertConfig = {
  warning: {
    icon: <AlertTriangle size={16} />,
    bgClass: 'bg-amber-50',
    iconClass: 'text-amber-500',
    borderClass: 'border-amber-200',
  },
  info: {
    icon: <Info size={16} />,
    bgClass: 'bg-blue-50',
    iconClass: 'text-blue-500',
    borderClass: 'border-blue-200',
  },
  success: {
    icon: <CheckCircle2 size={16} />,
    bgClass: 'bg-green-50',
    iconClass: 'text-green-500',
    borderClass: 'border-green-200',
  },
};

export function AlertsFeed() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Obavještenja</h3>
          <p className="text-sm text-gray-400">Pametni savjeti i upozorenja</p>
        </div>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-sm',
                config.bgClass,
                config.borderClass,
              )}
            >
              <span className={cn('mt-0.5 flex-shrink-0', config.iconClass)}>
                {config.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
