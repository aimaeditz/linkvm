import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../shared/Logo';
import { StorageService, AuthService } from '../../lib/storage';
import { AuthBackdrop } from './AuthBackdrop';
import { FloatingChips } from './FloatingChips';
import { Sparkles, AlertCircle, AlertTriangle } from 'lucide-react';
import type { User } from '../../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
            }
          ) => void;
          prompt: (momentListener?: (moment: unknown) => void) => void;
        };
      };
    };
  }
}

export interface SignupPageProps {
  onSuccess?: () => void;
  onNavigate?: (route: string) => void;
}

function parseJwt(token: string): { sub: string; email: string; name?: string; picture?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse Google ID token:', err);
    return null;
  }
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSuccess, onNavigate }) => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [referredByUsername, setReferredByUsername] = useState<string | null>(null);
  const googleBtnContainerRef = useRef<HTMLDivElement | null>(null);

  const googleClientId =
    (import.meta as unknown as { env?: Record<string, string | undefined> })?.env?.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref') || localStorage.getItem('linkvm_ref_code');
    if (refParam) {
      localStorage.setItem('linkvm_ref_code', refParam);
      try {
        const users = StorageService.getAllUsers();
        const found = users.find(
          (u: User & { referralCode?: string }) =>
            u.username?.toLowerCase() === refParam.toLowerCase() || u.referralCode === refParam
        );
        if (found && found.username) {
          setReferredByUsername(found.username);
        } else {
          setReferredByUsername(refParam.split('-')[0]);
        }
      } catch {
        setReferredByUsername(refParam.split('-')[0]);
      }
    }
  }, []);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const handleCredentialResponse = (response: { credential?: string }) => {
    if (!response.credential) {
      setError('Google Sign-In failed to return credentials. Please try again.');
      setLoading(false);
      return;
    }

    const payload = parseJwt(response.credential);
    if (!payload || !payload.email || !payload.sub) {
      setError('Unable to parse Google account information.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      AuthService.loginWithGoogle({
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });

      localStorage.setItem('linkvm_last_signin', Date.now().toString());

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const initGIS = () => {
      if (!window.google?.accounts?.id) return;

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 320,
          });
        }
      } catch (err) {
        console.error('Error initializing Google Identity Services:', err);
      }
    };

    if (window.google?.accounts?.id) {
      initGIS();
    } else {
      const scriptId = 'google-identity-services-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initGIS();
        };
        document.head.appendChild(script);
      } else {
        script.onload = () => {
          initGIS();
        };
      }
    }
  }, [googleClientId]);

  const handleCustomGoogleClick = () => {
    if (!googleClientId) {
      setError('Google Sign-In is not configured yet. Add VITE_GOOGLE_CLIENT_ID to enable login.');
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
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
            onClick={() => handleNavigate('landing')}
            className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl p-1"
          >
            <Logo size="md" />
          </button>
        </div>

        <div className="w-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-8 md:p-10 flex flex-col items-center">
          <div className="text-center mb-6">
            {referredByUsername && (
              <div className="mb-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-xs">
                <Sparkles size={13} className="text-indigo-600" />
                <span>Referred by @{referredByUsername}</span>
              </div>
            )}
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 font-semibold">
              100% Free Forever · No credit card required.
            </p>
          </div>

          {error && (
            <div className="w-full mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {!googleClientId ? (
            <div className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>Configuration Required</span>
              </div>
              <p className="text-amber-700 leading-relaxed">
                Google Sign-In is not configured yet. Add <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[11px]">VITE_GOOGLE_CLIENT_ID</code> to enable login.
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-3 my-4">
              <div
                ref={googleBtnContainerRef}
                className="w-full flex justify-center min-h-[44px]"
              />

              <button
                type="button"
                disabled={loading}
                onClick={handleCustomGoogleClick}
                className="w-full max-w-[320px] flex items-center justify-center gap-3 h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-soft hover:shadow-medium transition-all cursor-pointer disabled:opacity-50"
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
                <span>{loading ? 'Connecting with Google…' : 'Continue with Google'}</span>
              </button>
            </div>
          )}

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
