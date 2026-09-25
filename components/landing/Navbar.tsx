'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '../shared/Logo';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface NavbarProps {
  onNavigate?: (route: string) => void;
  isLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, isLoggedIn = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY >= 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run once at mount in case already scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle ESC key for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (target: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(target);
    } else {
      if (target.startsWith('#')) {
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = `/${target}`;
      }
    }
  };

  const navLinks = [
    { label: 'Features', target: '#features' },
    { label: 'How It Works', target: '#how-it-works' },
    { label: 'Why Free', target: '#why-free' },
    { label: 'About', target: 'about' },
    { label: 'FAQ', target: '#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${
          shouldReduceMotion ? 'transition-none' : 'transition-all duration-300 ease-out'
        } ${
          scrolled
            ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 h-20 flex items-center justify-between">
          {/* Left: Brand Logo (Vault glyph + wordmark) */}
          <div
            onClick={() => handleLinkClick('landing')}
            className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            tabIndex={0}
            role="button"
            aria-label="LinkVaultMe Home"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleLinkClick('landing');
            }}
          >
            <Logo size="md" />
          </div>

          {/* Center nav links (desktop): Features · How It Works · Why Free · About · FAQ */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleLinkClick(link.target)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1.5 py-1 whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: "Log in" ghost button + "Get Started — Free Forever" gradient primary button */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => handleLinkClick('dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-medium transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleLinkClick('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 rounded-full transition-all cursor-pointer"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('signup')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white text-sm font-medium shadow-medium hover:shadow-large transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                >
                  <span>Get Started — Free Forever</span>
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </>
            )}
          </div>

          {/* Mobile / Tablet Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dark Overlay */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-in Drawer from Right */}
            <motion.div
              initial={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
              }
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white border-l border-slate-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              <div>
                {/* Drawer Top */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <Logo size="sm" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links: Features · How It Works · Why Free · About · FAQ */}
                <div className="py-6 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => handleLinkClick(link.target)}
                      className="w-full text-left py-3 px-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Bottom Auth Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 px-1 mb-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>100% Free · No credit card required</span>
                </div>

                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => handleLinkClick('dashboard')}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-medium"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('login')}
                      className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-800 font-medium text-sm hover:bg-slate-50 transition-colors"
                    >
                      Log in
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('signup')}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-medium"
                    >
                      <span>Get Started — Free Forever</span>
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
