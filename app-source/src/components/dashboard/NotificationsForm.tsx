import React from 'react';
import { User } from '../../types';
import { Lock } from 'lucide-react';

interface NotificationsFormProps {
  user: User;
  formData: {
    weeklySummary: boolean;
  };
  onChange: (updated: Partial<NotificationsFormProps['formData']>) => void;
}

export const NotificationsForm: React.FC<NotificationsFormProps> = ({ user, formData, onChange }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Email Notification Preferences</h3>
        <p className="text-xs text-slate-500">Choose when you want to receive alerts at {user.email}</p>
      </div>

      <div className="space-y-3">
        {/* Security Alerts - Locked ON */}
        <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-900">Critical Security Alerts</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                <Lock className="w-2.5 h-2.5" /> Required
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
              Alerts regarding password updates, account login from new locations, and security events. Required for account safety.
            </p>
          </div>
          <input
            type="checkbox"
            checked={true}
            disabled
            className="w-4 h-4 rounded text-indigo-600 cursor-not-allowed opacity-75 mt-0.5"
          />
        </div>

        {/* Weekly Summary */}
        <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-900">Weekly Performance Summary</p>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
              A concise weekly email summarizing your page views, total clicks, and top-performing links.
            </p>
          </div>
          <input
            type="checkbox"
            checked={formData.weeklySummary}
            onChange={(e) => onChange({ weeklySummary: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
