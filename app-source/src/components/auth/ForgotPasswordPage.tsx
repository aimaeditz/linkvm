import React, { useState } from 'react';
import { Logo } from '../shared/Logo';
import { AuthService } from '../../lib/storage';
import { AuthBackdrop } from './AuthBackdrop';
import { FloatingChips } from './FloatingChips';
import { AlertCircle, CheckCircle2, Loader2, Mail, ArrowLeft } from 'lucide-react';

export interface ForgotPasswordPageProps {
  onNavigate?: (route: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.sendPasswordReset(trimmedEmail);
      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      // For security & consistency as per spec: do not reveal user existence; if network failure, show network error
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('network-request-failed')) {
        setError('Network error. Please try again.');
      } else {
        // As required: Do NOT reveal whether the email exists — show success message regardless unless network error
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto flex items-center justify-center px-4 py-12 bg-white font-sans selection:bg-indigo-500 selection:text-white">
      <AuthBackdrop />
      <FloatingChips />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => handleNavigate('')}
            className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl p-1"
          >
            <Logo size="md" />
          </button>
        </div>

        <div className="w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-8 md:p-10 flex flex-col items-center">
          <div className="text-center mb-6 w-full">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Reset your password
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 font-semibold">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          {error && (
            <div className="w-full mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="w-full space-y-5">
              <div className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-start gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-900">Check your inbox for a reset link.</p>
                  <p className="text-emerald-700 font-normal leading-relaxed">
                    If an account is associated with <span className="font-semibold">{email}</span>, you will receive an email with instructions to reset your password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigate('login')}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Back to sign in</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending reset link…</span>
                  </>
                ) : (
                  <span>Send reset link</span>
                )}
              </button>

              <div className="w-full text-center mt-6">
                <button
                  type="button"
                  onClick={() => handleNavigate('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back to sign in</span>
                </button>
              </div>
            </form>
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
