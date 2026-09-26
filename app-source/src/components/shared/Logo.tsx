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
  withWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  showSubtitle = false,
  withWordmark = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 min-w-[28px] min-h-[28px]',
    md: 'w-9 h-9 min-w-[36px] min-h-[36px]',
    lg: 'w-11 h-11 min-w-[44px] min-h-[44px]',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none shrink-0', className)}>
      {/* Premium LinkVM Mark Inline SVG */}
      <div className={cn('relative flex items-center justify-center shrink-0 drop-shadow-sm', iconSizes[size])}>
        <svg viewBox="0 0 512 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="logo-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#1E1B4B" floodOpacity="0.3" />
            </filter>
          </defs>

          <rect x="0" y="0" width="512" height="512" rx="112" ry="112" fill="url(#logo-bg)" />
          <path d="M 0 112 C 0 50.1 50.1 0 112 0 L 400 0 C 461.9 0 512 50.1 512 112 L 512 180 Q 256 240 0 180 Z" fill="url(#logo-gloss)" />
          <rect x="2" y="2" width="508" height="508" rx="110" ry="110" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />

          <g filter="url(#logo-shadow)">
            {/* V Letterform */}
            <path
              d="M 84 160 L 120 160 L 150 280 L 180 160 L 218 160 L 164 352 L 136 352 Z"
              fill="#FFFFFF"
            />
            {/* M Letterform */}
            <path
              d="M 220 160 L 254 160 L 325 250 L 396 160 L 430 160 L 430 352 L 396 352 L 396 210 L 325 300 L 254 210 L 254 352 L 220 352 Z"
              fill="#E0E7FF"
            />
            {/* Integrated Link Glyph */}
            <g transform="translate(10, 0)">
              <rect x="396" y="112" width="28" height="15" rx="7.5" fill="none" stroke="#FFFFFF" strokeWidth="4.5" transform="rotate(-45 410 119.5)" opacity="0.9" />
              <rect x="412" y="128" width="28" height="15" rx="7.5" fill="none" stroke="#38BDF8" strokeWidth="4.5" transform="rotate(-45 426 135.5)" opacity="0.9" />
            </g>
          </g>
        </svg>
      </div>

      {withWordmark && (
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
      )}
    </div>
  );
};
