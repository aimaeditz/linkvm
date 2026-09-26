import React, { useState } from 'react';
import { Logo } from '../shared/Logo';
import { AuthService } from '../../lib/storage';
import { AuthBackdrop } from './AuthBackdrop';
import { FloatingChips } from './FloatingChips';
import { AlertCircle, Info, Loader2, Mail, Lock } from 'lucide-react';
import { AuthStatusOverlay, AuthStatus } from './AuthStatusOverlay';
import {
  isAuthHostSupported,
  UNAUTHORIZED_PREVIEW_NOTICE,
  getFriendlyAuthErrorMessage,
} from '../../lib/auth-host';
import { isFirebaseConfigured, firebaseMissingError } from '../../lib/firebase';

export interface AuthPageProps {
  mode?: 'login' | 'signup';
  onSuccess?: () => void;
  onNavigate?: (route: string) => void;
}

export const LoginPage: React.FC<AuthPageProps> = ({
  onSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const isHostAllowed = isAuthHostSupported();

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHostAllowed) {
      setError(UNAUTHORIZED_PREVIEW_NOTICE);
      return;
    }
    setError('');

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

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoadingEmail(true);
    setAuthStatus('loading');
    setAuthMethod('email');
    setStatusMessage('Signing you in...');

    try {
      await AuthService.loginWithEmail(trimmedEmail, password);
      setAuthStatus('success');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Email sign-in error:', err);
      setError(getFriendlyAuthErrorMessage(err));
      setAuthStatus('idle');
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isHostAllowed) {
      setError(UNAUTHORIZED_PREVIEW_NOTICE);
      return;
    }

    setError('');
    setLoadingGoogle(true);
    setAuthStatus('loading');
    setAuthMethod('google');
    setStatusMessage('Connecting with Google...');

    try {
      await AuthService.loginWithGoogleFirebase();
      setAuthStatus('success');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(getFriendlyAuthErrorMessage(err));
      setAuthStatus('idle');
    } finally {
      setLoadingGoogle(false);
    }
  };

  const isLoading = loadingEmail || loadingGoogle;

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

        <div className="relative overflow-hidden w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-8 md:p-10 flex flex-col items-center">
          <AuthStatusOverlay
            status={authStatus}
            mode="login"
            method={authMethod}
            message={statusMessage}
          />
          <div className="text-center mb-6 w-full">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 font-semibold">
              Sign in to your LinkVM account.
            </p>
          </div>

          {!isFirebaseConfigured && (
            <div className="w-full mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
              <span>{firebaseMissingError}</span>
            </div>
          )}

          {!isHostAllowed && (
            <div className="w-full mb-5 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/70 text-amber-800 text-xs font-semibold flex items-start gap-2.5">
              <Info size={16} className="shrink-0 text-amber-600 mt-0.5" />
              <span>{UNAUTHORIZED_PREVIEW_NOTICE}</span>
            </div>
          )}

          {error && (
            <div className="w-full mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="w-full space-y-4">
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
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => handleNavigate('forgot-password')}
                  className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isHostAllowed}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingEmail ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <div className="w-full flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            <button
              type="button"
              disabled={isLoading || !isHostAllowed}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingGoogle ? (
                <>
                  <Loader2 size={16} className="animate-spin text-slate-600" />
                  <span>Connecting with Google…</span>
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </div>

          <div className="w-full text-center mt-6">
            <p className="text-xs text-slate-600 font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleNavigate('signup')}
                className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-2 cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="w-full text-center mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 font-medium">
              By continuing, you agree to our{' '}
              <button
                type="button"
                onClick={() => handleNavigate('terms')}
                className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-2 cursor-pointer"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => handleNavigate('privacy')}
                className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-2 cursor-pointer"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
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
