import React, { useState } from 'react';
import { passwordSchema } from '../../lib/validators';
import { StorageService } from '../../lib/storage';
import { KeyRound, Check, Lock } from 'lucide-react';

export const PasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validated = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validated.success) {
      setError(validated.error.issues[0]?.message || 'Invalid password details');
      return;
    }

    const result = StorageService.changePassword(currentPassword, newPassword);
    if (!result.success) {
      setError(result.error || 'Failed to update password');
      return;
    }

    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
        <p className="text-xs text-slate-500">Ensure your account uses a long, unique password with numbers and capitals</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
          Your password has been successfully updated!
        </div>
      )}

      <div className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">New Password (min 8 chars, 1 uppercase, 1 number)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Update Password</span>
        </button>
      </div>
    </form>
  );
};
