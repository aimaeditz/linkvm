'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Logo } from '@/components/shared/Logo';
import { StorageService } from '@/lib/storage';
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Check, Sparkles } from 'lucide-react';

const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);
  const [genericError, setGenericError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const passwordValue = watch('password') || '';

  // Calculate live password strength: Weak / Fair / Strong
  const getStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Weak', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getStrength(passwordValue);

  const onSubmit = async (data: SignupFormData) => {
    setDuplicateEmailError(false);
    setGenericError(null);

    try {
      // 1. Try registration endpoint
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (res.status === 409) {
        setDuplicateEmailError(true);
        return;
      }

      if (!res.ok && res.status !== 404) {
        setGenericError('Something went wrong. Please try again.');
        return;
      }

      // 2. Register in client local storage
      const localRes = StorageService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (localRes.error && localRes.error.toLowerCase().includes('already exists')) {
        setDuplicateEmailError(true);
        return;
      }

      // 3. Auto sign-in
      try {
        await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });
      } catch {
        // Fallback handled by local session
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      // Offline / standalone fallback
      const localRes = StorageService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (localRes.error && localRes.error.toLowerCase().includes('already exists')) {
        setDuplicateEmailError(true);
        return;
      }

      StorageService.login(data.email, data.password, true);
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setGenericError(null);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch {
      const providerEmail = `${provider}_creator@linkvm.online`;
      const providerName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} Creator`;
      StorageService.loginWithOAuth(provider, providerEmail, providerName);
      router.push('/dashboard');
      router.refresh();
    }
  };

  const features = [
    'Claim your unique memorable username',
    'Unlimited links with custom icons and styling',
    'All themes unlocked, free forever',
    'Real-time privacy-first visitor analytics',
    'High-resolution vector and PNG QR codes',
  ];

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 bg-white selection:bg-indigo-500 selection:text-white">
      {/* Left Form Column */}
      <div className="w-full flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 min-h-screen">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
              <Logo size="md" />
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              100% Free Forever · No credit card required.
            </p>
          </div>

          {/* Generic Toast / Error Notice */}
          {genericError && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2"
            >
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{genericError}</span>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="w-full h-11 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-soft hover:shadow-medium transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                OR SIGN UP WITH EMAIL
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                placeholder="Sarah Chen"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="sarah@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email || duplicateEmailError
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.email.message}
                </p>
              )}
              {duplicateEmailError && !errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span>An account with this email already exists.</span>
                  <Link href="/login" className="underline font-bold text-indigo-600 hover:text-indigo-700">
                    Sign in
                  </Link>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  placeholder="At least 8 characters"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter: Three horizontal bars labeled Weak / Fair / Strong */}
              {passwordValue && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
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
                  <span className="text-[11px] font-semibold text-slate-500">
                    {strength.label}
                  </span>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  placeholder="Re-enter password"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('terms')}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="text-indigo-600 underline font-semibold hover:text-indigo-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-indigo-600 underline font-semibold hover:text-indigo-700">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 px-4 rounded-xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white text-sm font-semibold shadow-medium hover:shadow-large transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating your free account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Small Footer */}
          <p className="mt-8 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Decorative Panel (Desktop Only) */}
      <div className="hidden lg:flex w-full h-full min-h-screen relative bg-gradient-to-br from-indigo-50 via-slate-50 to-amber-50/40 p-12 flex-col justify-between border-l border-slate-200/70 select-none overflow-hidden">
        {/* Background Grid Pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Abstract CSS Graphic Illustration on Top (no images) */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-soft">
            <Sparkles size={12} className="text-amber-500" />
            <span>100% Free Forever · No credit card required</span>
          </div>
        </div>

        {/* Center Feature Highlights Glass Card */}
        <div className="relative z-10 max-w-sm w-full mx-auto my-auto p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
            Why LinkVaultMe?
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Everything you need to build your single, high-converting home on the web.
          </p>

          <div className="space-y-3.5">
            {features.map((item) => (
              <div key={item} className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Micro-Copy */}
        <div className="relative z-10 text-xs text-slate-400">
          linkvm.online · 100% Free Forever · Zero Trackers
        </div>
      </div>
    </div>
  );
}
