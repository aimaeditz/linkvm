import React, { useState } from 'react';
import { Laptop, Smartphone, ShieldCheck, Check, LogOut } from 'lucide-react';

export const SessionsPanel: React.FC = () => {
  const [revoked, setRevoked] = useState(false);

  const handleRevokeAll = () => {
    setRevoked(true);
    setTimeout(() => setRevoked(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Active Login Sessions</h3>
          <p className="text-xs text-slate-500">Devices currently authenticated to your LinkVM account</p>
        </div>
      </div>

      {revoked && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
          All other device sessions have been revoked.
        </div>
      )}

      <div className="space-y-3">
        {/* Current session */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Current Web Session</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active Now
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Desktop Browser • 30-Day Auto-Renewing Session</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-600">This Device</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Sessions automatically refresh on active dashboard usage.
        </span>

        <button
          type="button"
          onClick={handleRevokeAll}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors"
        >
          Revoke Other Sessions
        </button>
      </div>
    </div>
  );
};
