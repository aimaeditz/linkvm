import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export interface FinalCTAProps {
  onStartFree?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartFree }) => {
  const shouldReduceMotion = useReducedMotion();

  const handleStart = () => {
    if (onStartFree) {
      onStartFree();
    } else {
      window.location.href = '/signup';
    }
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-amber-50/50 border-t border-slate-100 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase shadow-soft">
            Instant Deployment
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Launch today. Scale indefinitely.{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-950 bg-clip-text text-transparent">
              Free forever.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Join creators, builders, and agencies sharing their work with poise. Start free in 60 seconds.
          </p>

          <div className="pt-4 flex flex-col items-center gap-4">
            <button
              onClick={handleStart}
              className="px-9 py-4 rounded-full bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold text-lg shadow-large hover:shadow-premium transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-3 group"
            >
              <span>Create Your Free Page</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1">
                <Check size={14} className="text-emerald-500" strokeWidth={2.5} />
                Zero commitment
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Check size={14} className="text-emerald-500" strokeWidth={2.5} />
                No credit card
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Check size={14} className="text-emerald-500" strokeWidth={2.5} />
                Instant live URL
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-200/40 blur-3xl -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl -z-0"
      />
    </section>
  );
};
