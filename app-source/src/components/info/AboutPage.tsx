import React from 'react';
import { Navbar } from '../landing/Navbar';
import { Footer } from '../landing/Footer';
import { BackToTop } from '../shared/BackToTop';
import { Sparkles, Shield, Cpu, Target, ArrowRight, Check } from 'lucide-react';

export interface AboutPageProps {
  onNavigate?: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const values = [
    {
      title: 'Zero Slop',
      description:
        'No AI clutter, no intrusive popups, and no bloated feature creep. Every element on the screen serves a real creator purpose.',
      icon: Target,
    },
    {
      title: 'Design Precision',
      description:
        'Obsessively crafted micro-interactions, clean typography, balanced whitespace, and buttery-smooth responsiveness across all screen sizes.',
      icon: Cpu,
    },
    {
      title: 'Privacy First',
      description:
        'Zero third-party advertising trackers. Anonymous visitor analytics only. We respect user privacy as a fundamental human right.',
      icon: Shield,
    },
  ];

  const beliefs = [
    'Creators should own their presentation layer without paying perpetual rent.',
    'A link page should load under 100 milliseconds on any mobile network worldwide.',
    'Design elegance should be accessible out of the box, not gated behind tier upgrades.',
    'Simplicity scales better than complexity.',
    'Privacy and performance are features, not afterthoughts.',
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1">
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-100/40 rounded-full blur-[100px] -z-10"
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-soft">
              <Sparkles size={14} className="text-amber-500" />
              <span>Our Mission &amp; Story</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Built for creators who value{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-950 bg-clip-text text-transparent">
                simplicity and speed.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              LinkVM (LinkVaultMe) exists to replace bloated, subscription-gated bio link tools with a fast, pristine, and forever-free alternative built with world-class engineering standards.
            </p>

            <div className="mt-4 text-xs font-semibold text-slate-400">
              Last updated: 2026
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50/60 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-large transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pb-3 border-b-2 border-indigo-600/30 mb-8 inline-block">
              Why we started LinkVM
            </h2>

            <div className="space-y-6 text-slate-600 text-base leading-relaxed">
              <p>
                In an era where basic digital utilities have been turned into recurring subscriptions, creating a simple link-in-bio page had become unnecessarily expensive and frustratingly complex. Creators were forced to endure degraded mobile interfaces, artificial theme limits, and aggressive upsell banners just to share their work.
              </p>

              <p>
                We believed there was a better way: build a platform that strips away the bloat, charges zero dollars, offers pristine performance, and treats the user’s bio link like valuable digital real estate.
              </p>

              <p>
                Every feature in LinkVM is designed from scratch with modern frontend principles: serverless edge caching, SVG iconography, zero third-party telemetry, and instant debounced auto-saving. You never lose changes, and your visitors never wait for your page to load.
              </p>

              <p>
                By keeping our architecture clean and our infrastructure lightweight, we guarantee that the core LinkVM experience will remain free forever for every creator on the web.
              </p>
            </div>

            <div className="mt-16 pt-12 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
                What we believe
              </h3>
              <div className="space-y-3.5">
                {beliefs.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center pt-8 border-t border-slate-100">
              <button
                onClick={() => handleNavigate('signup')}
                className="px-8 py-4 rounded-full bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold text-base shadow-medium hover:shadow-large transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2 group"
              >
                <span>Join LinkVM Free</span>
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
