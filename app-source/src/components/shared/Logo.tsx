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
    sm: 'w-7 h-7 min-w-[28px] min-h-[28px] text-xs',
    md: 'w-9 h-9 min-w-[36px] min-h-[36px] text-sm',
    lg: 'w-11 h-11 min-w-[44px] min-h-[44px] text-base',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none shrink-0', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white font-black shadow-md ring-1 ring-white/20 tracking-tight shrink-0 aspect-square',
          iconSizes[size]
        )}
      >
        <span className="text-white drop-shadow-sm font-extrabold select-none">VM</span>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-0.5">
          <span className={cn('font-black tracking-tight text-slate-900 truncate', textSizes[size])}>
            Link<span className="text-indigo-600">VM</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-400 tracking-normal -mt-0.5 font-mono truncate">
            {getSiteDomain()}
          </span>
        )}
      </div>
    </div>
  );
};
