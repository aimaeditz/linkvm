import React, { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface AutoSaveIndicatorProps {
  status?: 'saved' | 'saving' | 'idle' | 'error';
  onRetry?: () => void;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ status = 'idle', onRetry }) => {
  const [currentStatus, setCurrentStatus] = useState<'saved' | 'saving' | 'idle' | 'error'>(status);

  useEffect(() => {
    setCurrentStatus(status);
    if (status === 'saved') {
      const timer = setTimeout(() => {
        setCurrentStatus('idle');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold text-slate-600 transition-all select-none">
      {currentStatus === 'saving' && (
        <>
          <Loader2 className="w-3 h-3 text-indigo-600 animate-spin" />
          <span className="text-indigo-600">Saving…</span>
        </>
      )}

      {currentStatus === 'saved' && (
        <>
          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
          <span className="text-emerald-700 font-bold">Saved</span>
        </>
      )}

      {currentStatus === 'error' && (
        <>
          <AlertCircle className="w-3 h-3 text-rose-600" />
          <span className="text-rose-600 mr-1">Save failed</span>
          {onRetry && (
            <button
              onClick={onRetry}
              type="button"
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
            >
              Retry
            </button>
          )}
        </>
      )}

      {currentStatus === 'idle' && (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
          <span className="text-slate-600">All changes saved</span>
        </>
      )}
    </div>
  );
};
