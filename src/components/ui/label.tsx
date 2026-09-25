import React from 'react';
import { cn } from '../../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1.5', className)}
        {...props}
      >
        {children}
        {required && <span className="text-rose-500">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
