'use client';

import React, { useState } from 'react';
import { Navbar } from '../landing/Navbar';
import { Footer } from '../landing/Footer';
import { BackToTop } from '../shared/BackToTop';
import {
  ShieldCheck,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  CheckCircle2,
  LifeBuoy,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WhyFreePageProps {
  onNavigate?: (route: string) => void;
}

export const WhyFreePage: React.FC<WhyFreePageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const featureCards = [
    {
      title: 'Unlimited Links',
      description:
        'Add as many links as you want without arbitrary caps. Organize social profiles, portfolios, newsletters, stores, and resources in one high-impact hub.',
      icon: Link2,
    },
    {
      title: 'All Themes Unlocked',
      description:
        'Every theme in our library is accessible without a paywall. Custom color accents, typography settings, and button rounding options are yours unconditionally.',
      icon: Palette,
    },
    {
      title: 'Full Analytics Suite',
      description:
        'Track every click, view, referral source, and geography with precision. Clean privacy-first metrics with no hidden tier restrictions or export paywalls.',
      icon: BarChart3,
    },
    {
      title: 'Custom QR Codes',
      description:
        'Generate and download crisp vector SVG and high-resolution PNG QR codes tailored to your page. Ideal for merchandise, flyers, conference slides, and packaging.',
      icon: QrCode,
    },
    {
      title: 'Free Verified Badge',
      description:
        'Every creator receives an authenticated verified badge on their profile. We do not charge monthly fees for legitimacy.',
      icon: CheckCircle2,
    },
    {
      title: 'Priority Support',
      description:
        'Get timely assistance from real software engineers. We believe customer service should not be gated behind premium tiers.',
      icon: LifeBuoy,
    },
  ];

  const freePillars = [
    {
      title: 'Unlimited Links',
      desc: 'No restrictions on link count, link types, or embedded rich media.',
    },
    {
      title: 'All Themes Unlocked',
      desc: 'No gated templates or locked color palettes. Full styling autonomy.',
    },
    {
      title: 'Full Analytics Suite',
      desc: 'Real-time aggregated view and click metrics without trial expiration.',
    },
    {
      title: 'Zero Third-Party Ads',
      desc: 'We never inject advertising onto your personal link page.',
    },
  ];

  const billingFaqs = [
    {
      q: 'Will LinkVaultMe ever charge for core features?',
      a: 'No. The core functionality—unlimited links, all themes, real-time analytics, and high-res QR codes—will remain 100% free forever for every creator.',
    },
    {
      q: 'Do I need to enter credit card details at any point?',
      a: 'Never. We do not ask for credit card numbers, billing addresses, or bank details. Account creation is completely friction-free.',
    },
    {
      q: 'How does LinkVaultMe sustain operations without subscriptions?',
      a: 'We operate with modern lean cloud infrastructure and low server overhead. In the future, optional non-intrusive enterprise add-ons or developer tooling may exist, but the core creator platform is permanently free.',
    },
    {
      q: 'Are there hidden limits on visitor traffic or page views?',
      a: 'No limits. Whether your page receives ten visits or ten million visits from a viral social post, your LinkVaultMe page stays fast and online.',
    },
    {
      q: 'Is there a trial period that expires after 14 or 30 days?',
      a: 'There is no trial period. Your account, links, themes, and analytics remain active and accessible indefinitely.',
    },
    {
      q: 'Can I export my data if I ever want to move?',
      a: 'Yes. You have full ownership of your content. You can view, copy, and export your links and information at any time without fee or lock-in.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-100/40 rounded-full blur-[100px] -z-10"
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-soft">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>100% Free · No Subscriptions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Premium tools should be free.{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                So we made ours free.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We founded LinkVaultMe on the principle that consolidating your digital presence should never come with a monthly subscription tax. Every feature is unlocked for everyone, forever.
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => handleNavigate('signup')}
                className="px-8 py-4 rounded-full bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold text-base shadow-medium hover:shadow-large transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2 group"
              >
                <span>Get Started — 100% Free</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </section>

        {/* 6 Expanded Feature Cards */}
        <section className="py-16 md:py-24 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Zero paywalls. Pure utility.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Compare what other platforms lock behind expensive monthly fees with what LinkVaultMe delivers for free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featureCards.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.title}
                    className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-large hover:scale-[1.01] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                        {c.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <Check size={14} strokeWidth={3} />
                      <span>Unlocked for all users</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What "Free Forever" Means */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Our Guarantee
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                What &ldquo;Free Forever&rdquo; actually means
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {freePillars.map((p) => (
                <div
                  key={p.title}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Sustain This */}
        <section className="py-16 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-soft">
              <Sparkles size={22} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How we sustain this
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              We leverage modern edge rendering, static asset pipelines, and lean serverless architectures that cost pennies per million requests. Because our operational efficiency is so high, we do not need to extract recurring subscription fees from creators. The core product is and will always remain completely free.
            </p>
          </div>
        </section>

        {/* Billing FAQs */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Billing &amp; Model Questions
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Transparent answers about our free architecture.
              </p>
            </div>

            <div className="space-y-4">
              {billingFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-soft"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-4 px-6 flex items-center justify-between text-left gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <span className="text-base font-bold text-slate-900">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-slate-400 shrink-0"
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <button
                onClick={() => handleNavigate('signup')}
                className="px-8 py-4 rounded-full bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold text-base shadow-medium hover:shadow-large transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2 group"
              >
                <span>Get Started — 100% Free</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
};
