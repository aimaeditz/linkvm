import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getSiteDomain } from '../../lib/site';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md', showSubtitle = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white font-black shadow-md ring-1 ring-white/20 tracking-tight',
          iconSizes[size]
        )}
      >
        <span className="text-white drop-shadow-sm font-extrabold">VM</span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-0.5">
          <span className={cn('font-black tracking-tight text-slate-900', textSizes[size])}>
            Link<span className="text-indigo-600">VM</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-400 tracking-normal -mt-0.5">
            {getSiteDomain()}
          </span>
        )}
      </div>
    </div>
  );
};
