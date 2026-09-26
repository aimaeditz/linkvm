import React from 'react';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

export type AuthStatus = 'idle' | 'loading' | 'success';

interface AuthStatusOverlayProps {
  status: AuthStatus;
  mode: 'login' | 'signup';
  method?: 'email' | 'google';
  message?: string;
}

export const AuthStatusOverlay: React.FC<AuthStatusOverlayProps> = ({
  status,
  mode,
  method = 'email',
  message,
}) => {
  if (status === 'idle') return null;

  const isLogin = mode === 'login';
  const defaultLoadingText = isLogin
    ? method === 'google'
      ? 'Connecting with Google...'
      : 'Signing you in...'
    : method === 'google'
      ? 'Connecting with Google...'
      : 'Creating your account...';

  const defaultSuccessTitle = isLogin ? 'Welcome back!' : 'Account created!';
  const defaultSuccessSubtext = isLogin
    ? 'Redirecting to your dashboard...'
    : 'Setting up your profile & workspace...';

  return (
    <div className="absolute inset-0 z-30 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 animate-in fade-in zoom-in-95">
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center space-y-5 my-auto">
          {/* Animated Spinner with Glow Ring */}
          <div className="relative flex items-center justify-center">
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-indigo-600/30 blur-xl animate-spinner-glow" />

            {/* Outer Rotating Ring */}
            <div className="relative w-20 h-20 rounded-full border-4 border-indigo-100 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-500 animate-spin" />
              {/* Center Icon */}
              <div className="w-11 h-11 rounded-2xl bg-indigo-50/90 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
                {method === 'google' ? (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                ) : (
                  <Sparkles size={20} className="text-indigo-600 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {message || defaultLoadingText}
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Verifying your credentials and securing your session...
            </p>
          </div>

          {/* Sleek Pulse Bar */}
          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative mt-2">
            <div className="absolute inset-y-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 w-1/2 rounded-full animate-marquee" />
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center justify-center space-y-4 my-auto">
          {/* Success Checkmark Circle with Radiant Glow */}
          <div className="relative flex items-center justify-center">
            {/* Ambient Emerald Glow */}
            <div className="absolute -inset-4 rounded-full bg-emerald-500/25 blur-xl animate-pulse" />

            {/* Outer ring badge */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-check-bounce">
              <Check size={38} className="stroke-[3] text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>{defaultSuccessTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {defaultSuccessSubtext}
            </p>
          </div>

          {/* Verified Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Authenticated</span>
          </div>
        </div>
      )}
    </div>
  );
};
