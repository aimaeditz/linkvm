'use client';

import React from 'react';
import { Logo } from '../shared/Logo';
import { Github, Linkedin, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export interface FooterProps {
  onNavigate?: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const shouldReduceMotion = useReducedMotion();

  const handleLink = (target: string) => {
    if (onNavigate) {
      onNavigate(target);
    } else {
      if (target.startsWith('#')) {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `/${target}`;
      }
    }
  };

  const productLinks = [
    { label: 'Features', target: '#features' },
    { label: 'How It Works', target: '#how-it-works' },
    { label: 'Why Free', target: '#why-free' },
    { label: 'FAQ', target: '#faq' },
  ];

  const companyLinks = [
    { label: 'About', target: 'about' },
    { label: 'Contact', target: 'contact' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', target: 'privacy' },
    { label: 'Terms of Service', target: 'terms' },
  ];

  return (
    <footer className="w-full bg-white border-t border-slate-100 py-10 md:py-12 select-none">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
      >
        {/* Main 3 Columns + Connect */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* 3 Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
            {/* Column 1: Product */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">
                Product
              </h4>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleLink(link.target)}
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Company */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">
                Company
              </h4>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleLink(link.target)}
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <h4 className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">
                Legal
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleLink(link.target)}
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vertical Divider on Desktop */}
          <div className="hidden md:block w-px self-stretch bg-slate-100" />

          {/* Right side — Connect */}
          <div className="flex flex-col gap-3 shrink-0">
            <h4 className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">
              Connect
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Github size={17} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Linkedin size={17} />
              </a>

              <a
                href="mailto:support@linkvm.online"
                aria-label="Email"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Logo Left, Credits Right */}
        <div className="border-t border-slate-100 mt-8 pt-6 pb-6">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex flex-col items-start">
              <Logo size="sm" showSubtitle={false} />
              <span className="text-xs text-slate-400 mt-1">linkvm.online</span>
            </div>
            {/* Right Side */}
            <div className="flex flex-col text-right leading-tight">
              <span className="text-xs text-slate-500">© 2026 LinkVM. All rights reserved.</span>
              <span className="text-xs text-slate-400">Created by AiMAEditz</span>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
