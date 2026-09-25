import React from 'react';
import {
  Link2,
  Palette,
  BarChart3,
  QrCode,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export interface WhyFreeProps {
  onStartFree?: () => void;
}

export const WhyFree: React.FC<WhyFreeProps> = ({ onStartFree }) => {
  const shouldReduceMotion = useReducedMotion();

  const handleStart = () => {
    if (onStartFree) {
      onStartFree();
    } else {
      window.location.href = '/signup';
    }
  };

  const cards = [
    {
      title: 'Unlimited Links',
      description: 'Add as many links as you want with custom icons and categories.',
      icon: Link2,
    },
    {
      title: 'All Themes Unlocked',
      description: 'Every hand-crafted theme available instantly with live preview.',
      icon: Palette,
    },
    {
      title: 'Full Analytics Suite',
      description: 'Views, clicks, devices, referrers, and conversion metrics.',
      icon: BarChart3,
    },
    {
      title: 'Custom QR Codes',
      description: 'High-resolution vector SVG and PNG downloads for print and web.',
      icon: QrCode,
    },
    {
      title: 'Verified Creator Badge',
      description: 'Clean verified badge for your public profile.',
      icon: CheckCircle2,
    },
    {
      title: 'High Performance',
      description: 'Sub-100ms page load speeds worldwide with zero external trackers.',
      icon: Zap,
    },
  ];

  return (
    <section id="why-free" className="py-20 md:py-28 bg-white scroll-mt-12 relative overflow-hidden w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-50/60 rounded-full blur-[100px] -z-10"
      />

      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold tracking-wide mb-4 shadow-soft">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>100% Free Forever</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything unlocked.{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Free forever.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            No credit cards. No lockouts. Every tool available to every creator from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-soft hover:shadow-large hover:scale-[1.02] transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-xl mx-auto flex flex-col items-center">
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
            We believe essential creator tools should be accessible to all. Built for maximum speed, security, and aesthetics.
          </p>

          <button
            onClick={handleStart}
            className="px-8 py-4 rounded-full bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-medium text-base shadow-medium hover:shadow-large transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2 group"
          >
            <span>Get Started — Free Forever</span>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
};
