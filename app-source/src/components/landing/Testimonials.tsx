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
      gradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
      iconBg: 'bg-indigo-100/80 text-indigo-600',
      border: 'border-indigo-100/80',
    },
    {
      Icon: Palette,
      title: '34 Themes Unlocked',
      text: 'Choose from dozens of premium themes. Every theme is 100% free forever.',
      gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      iconBg: 'bg-emerald-100/80 text-emerald-700',
      border: 'border-emerald-100/80',
    },
    {
      Icon: BarChart3,
      title: 'Real-Time Analytics',
      text: 'Track views, clicks, and referrers with privacy-first analytics. Clean conversion metrics.',
      gradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
      iconBg: 'bg-amber-100/80 text-amber-700',
      border: 'border-amber-100/80',
    },
    {
      Icon: QrCode,
      title: 'Instant QR Codes',
      text: 'Generate high-resolution QR codes in PNG and SVG. Ready for print or digital sharing.',
      gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      iconBg: 'bg-sky-100/80 text-sky-700',
      border: 'border-sky-100/80',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-50/50 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
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
                style={{ background: item.gradient }}
                className={`rounded-2xl border ${item.border} shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center mb-5`}>
                    <Icon size={20} />
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
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
