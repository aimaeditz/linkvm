import React from 'react';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  description,
}) => {
  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/60 text-indigo-600 flex items-center justify-center shadow-soft">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {value}
        </h3>

        {(change || description) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {change && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-md font-semibold text-[11px]',
                  isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                )}
              >
                {change}
              </span>
            )}
            {description && <span className="text-slate-400">{description}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
