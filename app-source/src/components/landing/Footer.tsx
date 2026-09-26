import React from 'react';
import { Logo } from '../shared/Logo';
import { Instagram, Youtube, Globe } from 'lucide-react';
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
    { label: 'Privacy Policy', target: 'privacy' },
    { label: 'Terms of Service', target: 'terms' },
  ];

  const exploreLinks = [
    { label: 'MTV Hub', href: 'http://multitubeviews.com/' },
    { label: 'PMT Hub', href: 'https://publicmediatool.com/' },
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
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
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

            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">
                Explore
              </h4>
              <ul className="space-y-2">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hidden md:block w-px self-stretch bg-slate-100" />

          <div className="flex flex-col gap-3 shrink-0">
            <h4 className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/its_abid29/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Instagram size={17} />
              </a>

              <a
                href="https://www.youtube.com/@aimabideditz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Youtube size={17} />
              </a>

              <a
                href="https://www.tiktok.com/@its_abid29"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>

              <a
                href="https://whatsapp.com/channel/0029Vb669jh11ulG8ttZ3K3s"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>

              <a
                href="https://aimaeditz.blogspot.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Blog"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Globe size={17} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <Logo size="sm" showSubtitle={false} />
            </div>
            <div className="flex flex-col text-right leading-tight space-y-1">
              <span className="text-xs text-slate-500">© 2026 LinkVM. All rights reserved.</span>
              <span className="text-xs text-slate-400">Created by AiMAEditz</span>
              <a
                href="https://linkvm.online/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                linkvm.online
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
