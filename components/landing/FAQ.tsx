'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqItems = [
    {
      q: 'Is LinkVM really free forever?',
      a: 'Yes, LinkVM is completely free forever. You get unlimited links, all themes, real-time analytics, and high-resolution QR code exports with no paywalls or trial expirations.',
    },
    {
      q: 'Do I need to sign up every time?',
      a: 'No, your session remains persistent on your device. Once signed in via Google, GitHub, or email, you can manage and update your profile without repeated authentication hurdles.',
    },
    {
      q: 'Are there any hidden fees or subscriptions?',
      a: 'None whatsoever. There are no credit card prompts, no tiered paywalls, and no subscription billing. Every core feature is accessible to all creators from day one.',
    },
    {
      q: 'Can I use my own domain?',
      a: 'Custom domain support is planned on our roadmap. Currently, every user receives a clean, memorable URL in the format linkvm.online/yourname.',
    },
    {
      q: 'How does auto-save work?',
      a: 'Our smart auto-save debounces every keystroke and change with an 800-millisecond delay. Your links, bio, and styling are saved continuously without you having to click a manual save button.',
    },
    {
      q: 'Is my data private and secure?',
      a: 'Yes. We implement strict privacy-first practices, aggregate anonymous visitor metrics, and never sell your personal information or profile activity to third parties.',
    },
    {
      q: 'Can I delete my account anytime?',
      a: 'Yes, you maintain full control over your data. You can delete your account and all associated links, analytics, and settings directly from your settings panel anytime.',
    },
    {
      q: 'Do you support team accounts?',
      a: 'LinkVM is currently optimized for individual creators, freelancers, and small brands. Multi-seat team management with shared access controls is slated for a future release.',
    },
    {
      q: 'What happens to my links if I leave?',
      a: 'You can export your profile configuration and link inventory at any time. When you choose to delete your account, your public page and all associated logs are permanently purged.',
    },
    {
      q: 'Do you use third-party trackers?',
      a: 'No, we do not employ invasive third-party ad networks or cross-site tracking scripts. Our analytics engine is built purely in-house to protect visitor privacy while delivering actionable insights.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-white scroll-mt-12 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase mb-4">
            Common Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently asked questions.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Everything you need to know about LinkVM.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-soft transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="p-1 rounded-full text-slate-400 group-hover:text-slate-700 shrink-0"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="px-6 sm:px-8 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
