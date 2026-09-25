'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '../shared/Logo';
import { AuthBackdrop } from './AuthBackdrop';
import { FloatingChips } from './FloatingChips';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ForgotPasswordPageProps {
  onNavigate?: (route: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setCooldown(60);
    }, 450);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCooldown(60);
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto flex items-center justify-center px-4 py-12 bg-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Visual Premium Backdrop Layers */}
      <AuthBackdrop />
      <FloatingChips />

      {/* Centered Auth Card Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo above card */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => handleNavigate('landing')}
            className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl p-1"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Main Card */}
        <div className="w-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-8 md:p-10">
          {!submitted ? (
            <>
              {/* Heading */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-soft">
                  <Mail size={22} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Reset password
                </h1>
                <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                  We&apos;ll send you a secure password reset link.
                </p>
              </div>

              {/* Validation/Credential Error banner */}
              {error && (
                <div className="w-full mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Mail size={16} />
                    </div>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
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
                        <span>Send Reset Link</span>
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Back to sign in link */}
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
                Check your inbox
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
                If an account exists for <span className="font-bold text-slate-900">{email}</span>, you will receive password reset instructions shortly.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={handleResend}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-soft transition-all disabled:opacity-50 cursor-pointer"
                >
                  {cooldown > 0 ? `Resend link in ${cooldown}s` : 'Resend reset link'}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('login')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer mt-1"
                >
                  Return to sign in
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Outer footer micro-copy */}
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
