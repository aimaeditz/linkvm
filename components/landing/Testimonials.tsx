'use client';

import React from 'react';
import { Link2, Palette, BarChart3, QrCode } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const Testimonials: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const highlights = [
    {
      Icon: Link2,
      title: 'Unlimited Links',
      text: 'Add every social account, portfolio, and business link in one place. No caps, no limits.',
    },
    {
      Icon: Palette,
      title: 'All Themes Unlocked',
      text: 'Choose from dozens of premium themes. Every theme is 100% free forever.',
    },
    {
      Icon: BarChart3,
      title: 'Real-Time Analytics',
      text: 'Track views, clicks, and referrers with privacy-first analytics. No country data, no trackers.',
    },
    {
      Icon: QrCode,
      title: 'Instant QR Codes',
      text: 'Generate high-resolution QR codes in PNG and SVG. Ready for print or digital.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-50/50 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase mb-4">
            BUILT FOR CREATORS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything you need. Free forever.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every feature unlocked from day one. No paywalls, no subscriptions, no hidden fees.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
          {highlights.map((item, idx) => {
            const { Icon } = item;
            return (
              <motion.div
                key={item.title}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon circle */}
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                    <Icon size={20} />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  {/* Text */}
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
