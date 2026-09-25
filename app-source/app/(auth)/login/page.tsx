'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Logo } from '@/components/shared/Logo';
import { StorageService } from '@/lib/storage';
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const quotes = [
  {
    text: 'LinkVaultMe turned our scattered online presence into a clean, unified launchpad.',
    author: 'Design Engineer & Founder',
  },
  {
    text: 'Every theme unlocked out of the box, zero subscriptions, lightning-fast rendering.',
    author: 'Independent Creator',
  },
  {
    text: 'The best link-in-bio experience we have deployed. No bloat, just absolute precision.',
    author: 'Software Architect',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        // Fallback for client/SPA session validation
        const localRes = StorageService.login(data.email, data.password, rememberMe);
        if (!localRes.error) {
          router.push('/dashboard');
          router.refresh();
          return;
        }
        setAuthError('Invalid email or password.');
        return;
      }

      // Synchronize client storage session
      StorageService.login(data.email, data.password, rememberMe);
      router.push('/dashboard');
      router.refresh();
    } catch {
      // Offline / standalone client fallback
      const localRes = StorageService.login(data.email, data.password, rememberMe);
      if (!localRes.error) {
        router.push('/dashboard');
        router.refresh();
        return;
      }
      setAuthError('Invalid email or password.');
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setAuthError(null);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch {
      // Mock OAuth fallback for standalone local client preview
      const providerEmail = `${provider}_creator@linkvm.online`;
      const providerName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} Creator`;
      StorageService.loginWithOAuth(provider, providerEmail, providerName);
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 bg-white selection:bg-indigo-500 selection:text-white">
      {/* Left Form Column (Glass card, max-w-md, centered) */}
      <div className="w-full flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 min-h-screen">
        <div className="max-w-md w-full mx-auto">
          {/* LinkVaultMe Logo at Top */}
          <div className="mb-8">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
              <Logo size="md" />
            </Link>
          </div>

          {/* Heading & Subheading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              Sign in to manage your LinkVaultMe page.
            </p>
          </div>

          {/* Inline Error Message */}
          {authError && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2"
            >
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          {/* OAuth Buttons (Outline Style, Full-Width, SVG Logos) */}
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
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
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
                placeholder="you@domain.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field with Eye Toggle */}
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
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Switch + Forgot Password Link */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-slate-600">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 px-4 rounded-xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white text-sm font-semibold shadow-medium hover:shadow-large transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Small Footer */}
          <p className="mt-8 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Decorative Panel (Desktop Only) */}
      <div className="hidden lg:flex w-full h-full min-h-screen relative bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100/60 p-12 flex-col justify-between border-l border-slate-200/70 select-none overflow-hidden">
        {/* Abstract CSS Geometric Shapes */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Concentric Circles SVG Graphic */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] pointer-events-none opacity-40"
          fill="none"
        >
          <circle cx="200" cy="200" r="70" stroke="#818cf8" strokeWidth="1" />
          <circle cx="200" cy="200" r="120" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="170" stroke="#818cf8" strokeWidth="1" />
          <circle cx="200" cy="200" r="195" stroke="#818cf8" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="20" y1="20" x2="380" y2="380" stroke="#a5b4fc" strokeWidth="0.75" strokeDasharray="3 3" />
        </svg>

        {/* Top Tagline */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold">
            LinkVaultMe Platform
          </span>
        </div>

        {/* Center Rotating Quote Carousel (Fade every 6s) */}
        <div className="relative z-10 my-auto py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 max-w-sm"
            >
              <p className="text-xl font-medium text-slate-800 leading-snug tracking-tight">
                &ldquo;{quotes[quoteIndex].text}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                — {quotes[quoteIndex].author}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-6">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuoteIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  quoteIndex === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
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
