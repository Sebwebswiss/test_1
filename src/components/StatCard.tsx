import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  colorClass?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, colorClass = 'from-indigo-500 to-purple-600' }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1">
              <span className={cn(
                'text-xs font-semibold px-1.5 py-0.5 rounded-full',
                trend.value > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              )}>
                {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', colorClass)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
