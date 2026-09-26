import React, { useState, useEffect } from 'react';
import { Logo } from '../shared/Logo';
import { AuthService } from '../../lib/storage';
import { AuthBackdrop } from './AuthBackdrop';
import { FloatingChips } from './FloatingChips';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export interface ResetPasswordPageProps {
  onNavigate?: (route: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
    }
  }, []);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing or invalid reset token.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await AuthService.resetPassword(token, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to reset password.');
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto flex items-center justify-center px-4 py-12 bg-white font-sans selection:bg-indigo-500 selection:text-white">
      <AuthBackdrop />
      <FloatingChips />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => handleNavigate('landing')}
            className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl p-1"
          >
            <Logo size="md" />
          </button>
        </div>

        <div className="w-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-8 md:p-10">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-soft">
                  <KeyRound size={22} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Set new password
                </h1>
                <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                  Choose a strong, unique password for your account.
                </p>
              </div>

              {error && (
                <div className="w-full mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!token && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Reset Token
                    </label>
                    <input
                      required
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste your reset token"
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-soft"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Lock size={16} />
                    </div>
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-soft"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Lock size={16} />
                    </div>
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-soft"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-bold text-xs shadow-medium hover:shadow-large transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Update Password</span>
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => handleNavigate('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to login</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-soft">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Password updated!
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
                Your password has been successfully reset. You can now sign in with your new credentials.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleNavigate('login')}
                  className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400 font-bold flex flex-wrap justify-center gap-1">
          <span>&copy; 2026 LinkVM</span>
          <span>·</span>
          <span>100% Free Forever</span>
          <span>·</span>
          <span>Created by AiMAEditz</span>
        </div>
      </div>
    </div>
  );
};
