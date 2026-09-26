import React from 'react';
import { Navbar } from '../landing/Navbar';
import { Footer } from '../landing/Footer';
import { BackToTop } from '../shared/BackToTop';
import {
  Scale,
  CheckCircle2,
  UserCheck,
  AlertOctagon,
  Copyright,
  Ban,
  HelpCircle,
  ShieldAlert,
  RefreshCw,
  Mail,
} from 'lucide-react';

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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* Header Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-100/40 rounded-full blur-[100px] -z-10"
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-soft">
              <Scale size={14} className="text-indigo-600" />
              <span>Legal Agreement</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Terms of Service
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Clear, transparent rules governing your access to and use of the LinkVM platform and services.
            </p>

            <div className="mt-4 text-xs font-semibold text-slate-400">
              Last updated: 2026
            </div>
          </div>
        </section>

        {/* Intro / Terms Overview Card */}
        <section className="py-12 bg-slate-50/60 border-y border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1 sm:mb-2">
                  Clear &amp; Transparent Terms
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                  These terms govern your access to and use of LinkVM. Please read them carefully before creating an account or publishing your link page.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Numbered Content Sections */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* 1. Acceptance of Terms */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Scale size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  1. Acceptance of Terms
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                By registering for an account, accessing, or using LinkVM, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not access or use the platform.
              </p>
            </section>

            {/* 2. Accounts */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <UserCheck size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  2. Accounts
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                When you create an account on LinkVM, you are responsible for maintaining the confidentiality of your authentication details and ensuring that information associated with your profile is accurate. You are responsible for all activities that occur under your account.
              </p>
            </section>

            {/* 3. Acceptable Use */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <AlertOctagon size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  3. Acceptable Use
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                LinkVM is designed for creators, professionals, and individuals to share their links and portfolios. You agree not to use LinkVM to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-600 leading-relaxed">
                <li>Host or distribute phishing, malware, deceptive redirects, or harmful software.</li>
                <li>Impersonate any person, creator, or entity without authorization.</li>
                <li>Publish content that promotes harassment, abuse, illegal acts, or violates intellectual property rights.</li>
                <li>Engage in automated scraping, denial of service attacks, or disruption of platform availability.</li>
              </ul>
            </section>

            {/* 4. Content Ownership */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Copyright size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  4. Content Ownership
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                You retain complete ownership and intellectual property rights over all titles, links, bio descriptions, and assets you publish on LinkVM. You grant LinkVM a non-exclusive, worldwide license solely to display, format, and deliver your page to visitors on your behalf.
              </p>
            </section>

            {/* 5. Termination */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Ban size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  5. Termination
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                You may delete your account and terminate your use of LinkVM at any time via your account settings. We reserve the right to suspend or remove profiles that violate acceptable use standards, host malicious links, or disrupt service for other users.
              </p>
            </section>

            {/* 6. Disclaimers */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <HelpCircle size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  6. Disclaimers
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                The platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted availability, error-free operation, or specific third-party integration functionality.
              </p>
            </section>

            {/* 7. Limitation of Liability */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <ShieldAlert size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  7. Limitation of Liability
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                To the maximum extent permitted by law, LinkVM and its creators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of, or inability to use, the platform or links shared through it.
              </p>
            </section>

            {/* 8. Changes to Terms */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <RefreshCw size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  8. Changes to Terms
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                We may modify these Terms of Service from time to time to reflect product improvements, operational updates, or legal compliance. When changes are made, the revision date at the top of this page will be updated.
              </p>
            </section>

            {/* 9. Contact */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Mail size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  9. Contact
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                If you have any questions or concerns regarding these Terms of Service, please contact us at:
              </p>
              <p className="font-semibold text-indigo-600 text-base">
                aimaeditz.info@gmail.com
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
};
