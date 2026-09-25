'use client';

import React from 'react';
import {
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Save,
  Move,
  Eye,
  Shield,
  Zap,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const Features: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const featureList = [
    {
      title: 'Unlimited Links',
      description: 'Add every social account, portfolio, and business link in one place with custom icons.',
      icon: Link2,
    },
    {
      title: 'All Themes Unlocked',
      description: 'Hand-crafted themes with live preview. Colors, typography, and button shapes — all free.',
      icon: Palette,
    },
    {
      title: 'Real-Time Analytics',
      description: 'Track views, clicks, and traffic sources with beautiful charts and geo breakdown.',
      icon: BarChart3,
    },
    {
      title: 'Auto QR Code',
      description: 'Every page gets an instant high-resolution QR code, downloadable in SVG and PNG.',
      icon: QrCode,
    },
    {
      title: 'Instant Auto-Save',
      description: 'Every change saves automatically with an 800ms debounce. Zero data loss.',
      icon: Save,
    },
    {
      title: 'Drag & Drop',
      description: 'Reorder links with buttery-smooth drag and drop.',
      icon: Move,
    },
    {
      title: 'Live Preview',
      description: 'See your page update in real time as you customize.',
      icon: Eye,
    },
    {
      title: 'Privacy First',
      description: 'No third-party ad trackers. Aggregated, anonymous analytics only.',
      icon: Shield,
    },
    {
      title: 'Lightning Fast',
      description: 'Sub-100ms page loads. Optimized for mobile-first audiences.',
      icon: Zap,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section id="features" className="py-20 md:py-28 bg-white scroll-mt-12 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase mb-4">
            EVERYTHING UNLOCKED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything you need.{' '}
            <span className="text-indigo-600">Nothing you don&apos;t.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Built with premium attention to detail. Fast, lightweight, and engineered for clarity.
          </p>
        </div>

        {/* 9 Cards in 3x3 Grid */}
        <motion.div
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {featureList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={shouldReduceMotion ? undefined : itemVariants}
                className="group p-8 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-large hover:scale-[1.02] transition-all duration-300 flex flex-col items-start relative overflow-hidden"
              >
                {/* Indigo-soft circle containing Lucide icon */}
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Icon size={22} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>

                {/* Subtle hover accent line at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
