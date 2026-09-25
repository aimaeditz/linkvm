import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-indigo-500 selection:text-white">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </header>

      <main className="max-w-md w-full mx-auto my-12 text-center p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-premium">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-2xl mx-auto mb-6 shadow-soft">
          404
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Page not found
        </h1>

        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          The link you followed may be broken or the page may have been relocated.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-medium transition-all inline-flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Back to Home</span>
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400">
        &copy; 2026 LinkVaultMe · 100% Free Forever
      </footer>
    </div>
  );
}
