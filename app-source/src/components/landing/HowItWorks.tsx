import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      number: '01',
      title: 'Sign up once',
      description:
        'Google, GitHub, or email. Your session stays active so you never re-authenticate daily.',
      renderGraphic: () => (
        <div className="w-full h-32 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="w-48 p-3 rounded-lg bg-white border border-slate-200/80 shadow-soft flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              ID
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="w-20 h-2 rounded bg-slate-200" />
              <div className="w-12 h-1.5 rounded bg-slate-100" />
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border border-indigo-100/60 pointer-events-none" />
        </div>
      ),
    },
    {
      number: '02',
      title: 'Add your links',
      description:
        'Paste URLs, pick from dozens of clean icons, drag to reorder, tweak your theme in real time.',
      renderGraphic: () => (
        <div className="w-full h-32 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center gap-2 p-4 relative overflow-hidden">
          <div className="w-full py-2 px-3 rounded-lg bg-white border border-indigo-200 shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="w-24 h-2 rounded bg-slate-300" />
            </div>
            <div className="w-4 h-2 rounded bg-slate-200" />
          </div>
          <div className="w-full py-2 px-3 rounded-lg bg-white border border-slate-200/80 shadow-soft flex items-center justify-between opacity-75">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <div className="w-20 h-2 rounded bg-slate-200" />
            </div>
            <div className="w-4 h-2 rounded bg-slate-100" />
          </div>
        </div>
      ),
    },
    {
      number: '03',
      title: 'Share your page',
      description:
        'One memorable URL. Every platform, every client, every follower — best impression.',
      renderGraphic: () => (
        <div className="w-full h-32 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="px-4 py-2.5 rounded-full bg-white border border-slate-200 shadow-medium flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-semibold text-slate-800">
              linkvm.online/you
            </span>
          </div>
          <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full border border-amber-100 pointer-events-none" />
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-slate-50/60 scroll-mt-12 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase mb-4">
            Streamlined Flow
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Live in 60 seconds.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            No bloated dashboards. No steep learning curves. Just simple, beautiful perfection.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: shouldReduceMotion ? 0 : idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative p-8 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-large transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="mb-6">{step.renderGraphic()}</div>

                <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent font-mono mb-3">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < 2 && (
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
