'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '../shared/Logo';
import { StorageService } from '../../lib/storage';
import { AuthBackdrop } from './AuthBackdrop';
import { FloatingChips } from './FloatingChips';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export interface LoginPageProps {
  onSuccess?: () => void;
  onNavigate?: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // Check if the user is a returning visitor by checking last sign-in timestamp or logged user email
    const lastSignIn = localStorage.getItem('linkvm_last_signin');
    if (lastSignIn) {
      setIsReturningUser(true);
    }
  }, []);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const handleSuccess = () => {
    // Record login timestamp to activate returning-user welcome pill in the future
    localStorage.setItem('linkvm_last_signin', Date.now().toString());
    if (onSuccess) {
      onSuccess();
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = StorageService.login(email, password, rememberMe);
      setLoading(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      handleSuccess();
    }, 400);
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    setLoading(true);
    setTimeout(() => {
      const providerEmail = `${provider}_creator@linkvm.online`;
      const providerName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} Creator`;
      StorageService.loginWithOAuth(provider, providerEmail, providerName);
      setLoading(false);
      handleSuccess();
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
        <div className="w-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-8 md:p-10 flex flex-col items-center">
          
          {/* Welcome back pill if returning visitor */}
          {isReturningUser && (
            <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/60 text-[10px] font-bold text-indigo-700 shadow-soft select-none animate-bounce">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Welcome Back</span>
            </div>
          )}

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign in to LinkVM
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 font-semibold">
              Consolidate your links in 60 seconds
            </p>
          </div>

          {/* Validation/Credential Error banner */}
          {error && (
            <div className="w-full mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="w-full flex flex-col gap-2.5 mb-5">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleOAuth('google')}
              className="w-full flex items-center justify-center gap-3 h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-soft hover:shadow-medium transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5 w-full">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white/95 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => handleNavigate('forgot-password')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </div>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Remember Me Toggle */}
            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-bold">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-bold text-xs shadow-medium hover:shadow-large transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Card footer redirect */}
          <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => handleNavigate('signup')}
              className="text-indigo-600 hover:text-indigo-700 font-black cursor-pointer underline-offset-2 hover:underline"
            >
              Sign up free
            </button>
          </p>
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
