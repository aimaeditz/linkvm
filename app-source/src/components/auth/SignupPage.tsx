import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../shared/Logo';
import { StorageService } from '../../lib/storage';
import { getSiteDomain } from '../../lib/site';
import { AuthBackdrop } from './AuthBackdrop';
import { FloatingChips } from './FloatingChips';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle, Sparkles, AtSign, Loader2 } from 'lucide-react';

export interface SignupPageProps {
  onSuccess?: () => void;
  onNavigate?: (route: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSuccess, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referredByUsername, setReferredByUsername] = useState<string | null>(null);

  // Real debounced username availability state
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [usernameFeedback, setUsernameFeedback] = useState<string>('');
  const usernameDebounceRef = useRef<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref') || localStorage.getItem('linkvm_ref_code');
    if (refParam) {
      localStorage.setItem('linkvm_ref_code', refParam);
      try {
        const users = StorageService.getAllUsers();
        const found = users.find(
          (u: any) => u.username?.toLowerCase() === refParam.toLowerCase() || u.referralCode === refParam
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

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
    setUsername(clean);
    setError('');

    if (usernameDebounceRef.current) {
      clearTimeout(usernameDebounceRef.current);
    }

    if (!clean) {
      setUsernameStatus('idle');
      setUsernameFeedback('');
      return;
    }

    if (clean.length < 3) {
      setUsernameStatus('unavailable');
      setUsernameFeedback('Must be at least 3 characters');
      return;
    }

    setUsernameStatus('checking');
    usernameDebounceRef.current = setTimeout(() => {
      const res = StorageService.checkUsernameAvailable(clean);
      if (res.available) {
        setUsernameStatus('available');
        setUsernameFeedback(`${getSiteDomain()}/${clean} is available!`);
      } else {
        setUsernameStatus('unavailable');
        setUsernameFeedback(res.error || 'Username is unavailable');
      }
    }, 300);
  };

  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', score: 0, color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'Weak', score: 1, color: 'bg-rose-500' };
    if (score <= 3) return { label: 'Fair', score: 2, color: 'bg-amber-500' };
    return { label: 'Strong', score: 3, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const handleSuccess = () => {
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

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (username && usernameStatus === 'unavailable') {
      setError(usernameFeedback || 'Please choose a valid available username.');
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
    if (!agreed) {
      setError('You must accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = StorageService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        username: username.trim() || undefined,
      });
      setLoading(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      handleSuccess();
    }, 450);
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

          <div className="relative flex items-center justify-center mb-5 w-full">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white/95 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
              OR SIGN UP WITH EMAIL
            </span>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <User size={16} />
                </div>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Chen"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-soft"
                />
              </div>
            </div>

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
                  placeholder="sarah@example.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-soft"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Choose Username (Optional)
                </label>
                {usernameStatus === 'checking' && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" /> Checking
                  </span>
                )}
                {usernameStatus === 'available' && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check size={11} strokeWidth={3} /> Available
                  </span>
                )}
                {usernameStatus === 'unavailable' && (
                  <span className="text-[10px] text-rose-500 font-bold">
                    {usernameFeedback}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <AtSign size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="yourname"
                  className={`w-full h-11 pl-10 pr-3 rounded-xl border bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all shadow-soft font-mono ${
                    usernameStatus === 'available'
                      ? 'border-emerald-300 focus:ring-emerald-500'
                      : usernameStatus === 'unavailable'
                      ? 'border-rose-300 focus:ring-rose-500'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Your live link will be <span className="font-mono font-bold text-slate-600">{getSiteDomain()}/{username || 'yourname'}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
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

              {password && (
                <div className="mt-2 flex items-center gap-2 select-none">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        strength.score >= 1 ? strength.color : 'bg-transparent'
                      } w-1/3`}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        strength.score >= 2 ? strength.color : 'bg-transparent'
                      } w-1/3`}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        strength.score >= 3 ? strength.color : 'bg-transparent'
                      } w-1/3`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirm Password
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
                  placeholder="Re-enter password"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-soft"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-[11px] text-slate-600 cursor-pointer select-none font-semibold">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => handleNavigate('terms')}
                    className="text-indigo-600 underline font-extrabold cursor-pointer"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => handleNavigate('privacy')}
                    className="text-indigo-600 underline font-extrabold cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-bold text-xs shadow-medium hover:shadow-large transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account…</span>
                  </div>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => handleNavigate('login')}
              className="text-indigo-600 hover:text-indigo-700 font-black cursor-pointer underline-offset-2 hover:underline"
            >
              Log in
            </button>
          </p>
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
