import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  charCount?: { current: number; max: number };
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, charCount, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[90px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150',
            'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 resize-y',
            error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center mt-1">
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : <div />}
          {charCount && (
            <span
              className={cn(
                'text-[11px] font-medium ml-auto',
                charCount.current > charCount.max ? 'text-rose-500 font-semibold' : 'text-slate-400'
              )}
            >
              {charCount.current}/{charCount.max}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
