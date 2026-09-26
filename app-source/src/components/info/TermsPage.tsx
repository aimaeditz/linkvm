import React from 'react';
import { Navbar } from '../landing/Navbar';
import { Footer } from '../landing/Footer';
import { BackToTop } from '../shared/BackToTop';
import { Scale, CheckCircle2, UserCheck, AlertOctagon, Copyright, Ban, HelpCircle, ShieldAlert, RefreshCw, Mail } from 'lucide-react';

export interface TermsPageProps {
  onNavigate?: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1 w-full py-12 md:py-20">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-8 lg:px-10">
          {/* Header Banner - Centered */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase mb-4">
              <Scale size={14} className="text-indigo-600" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center">
              Terms of Service
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-2 text-center">
              Last updated: 2026
            </p>
          </div>

          {/* Terms Overview Banner */}
          <div className="w-full p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-12 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 size={18} />
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Clear &amp; Transparent Terms
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                These terms govern your access to and use of LinkVM. Please read them carefully before creating an account or publishing your link page.
              </p>
            </div>
          </div>

          {/* Prose Content */}
          <div className="w-full space-y-10">
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Scale size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">1. Acceptance of Terms</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                By registering for an account, accessing, or using LinkVM, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not access or use the platform.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <UserCheck size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">2. Accounts</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                When you create an account on LinkVM, you are responsible for maintaining the confidentiality of your authentication details and ensuring that information associated with your profile is accurate. You are responsible for all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <AlertOctagon size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">3. Acceptable Use</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                LinkVM is designed for creators, professionals, and individuals to share their links and portfolios. You agree not to use LinkVM to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li>Host or distribute phishing, malware, deceptive redirects, or harmful software.</li>
                <li>Impersonate any person, creator, or entity without authorization.</li>
                <li>Publish content that promotes harassment, abuse, illegal acts, or violates intellectual property rights.</li>
                <li>Engage in automated scraping, denial of service attacks, or disruption of platform availability.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Copyright size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">4. Content Ownership</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                You retain complete ownership and intellectual property rights over all titles, links, bio descriptions, and assets you publish on LinkVM. You grant LinkVM a non-exclusive, worldwide license solely to display, format, and deliver your page to visitors on your behalf.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Ban size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">5. Termination</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                You may delete your account and terminate your use of LinkVM at any time via your account settings. We reserve the right to suspend or remove profiles that violate acceptable use standards, host malicious links, or disrupt service for other users.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <HelpCircle size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">6. Disclaimers</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                The platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted availability, error-free operation, or specific third-party integration functionality.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldAlert size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">7. Limitation of Liability</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                To the maximum extent permitted by law, LinkVM and its creators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of, or inability to use, the platform or links shared through it.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <RefreshCw size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">8. Changes to Terms</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We may modify these Terms of Service from time to time to reflect product improvements, operational updates, or legal compliance. When changes are made, the revision date at the top of this page will be updated.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Mail size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">9. Contact</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you have any questions or concerns regarding these Terms of Service, please contact us at:
              </p>
              <p className="font-semibold text-indigo-600 text-base">
                aimaeditz.info@gmail.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
};
