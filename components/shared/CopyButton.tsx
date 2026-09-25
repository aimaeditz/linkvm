'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  successLabel?: string;
  className?: string;
  variant?: 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  successLabel = 'Copied!',
  className,
  variant = 'outline',
  size = 'sm',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const variants = {
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-soft',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  };

  const sizes = {
    sm: 'text-xs h-8 px-2.5 rounded-lg gap-1.5',
    md: 'text-sm h-9 px-3 rounded-xl gap-2',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? successLabel : `Copy ${textToCopy}`}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        copied && 'text-emerald-700 bg-emerald-50 border-emerald-200',
        className
      )}
    >
      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
      <span>{copied ? successLabel : label}</span>
    </button>
  );
};
