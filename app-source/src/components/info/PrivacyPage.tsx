import React from 'react';
import { Navbar } from '../landing/Navbar';
import { Footer } from '../landing/Footer';
import { BackToTop } from '../shared/BackToTop';
import { ShieldCheck, Lock, Download, Trash2, EyeOff, Cookie, FileText, Mail } from 'lucide-react';

export interface PrivacyPageProps {
  onNavigate?: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
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
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Data Protection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Privacy Policy
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We respect your privacy as a fundamental human right. LinkVM collects only what is strictly necessary to host and render your creator page.
            </p>

            <div className="mt-4 text-xs font-semibold text-slate-400">
              Last updated: 2026
            </div>
          </div>
        </section>

        {/* Intro / Commitment Card */}
        <section className="py-12 bg-slate-50/60 border-y border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1 sm:mb-2">
                  Our Absolute Commitment to Your Privacy
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                  We do not sell your personal data. We do not use third-party advertising trackers. We collect only what is strictly necessary to host and render your creator page.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Numbered Content Sections */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* 1. Data We Collect */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <FileText size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  1. Data We Collect
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                When you create an account and build your LinkVM page, we collect only the essential information needed to operate your profile:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-600 leading-relaxed">
                <li>
                  <strong className="text-slate-800 font-semibold">Account Credentials:</strong> Display name, unique username handle, and email address.
                </li>
                <li>
                  <strong className="text-slate-800 font-semibold">Profile Content:</strong> Custom link titles, destination URLs, bio description, avatar image URL, and social media profile handles.
                </li>
                <li>
                  <strong className="text-slate-800 font-semibold">Design Preferences:</strong> Selected theme configuration, button styles, custom colors, and pattern selections.
                </li>
              </ul>
            </section>

            {/* 2. How We Use It */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Lock size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  2. How We Use It
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                We use the information collected exclusively for functional platform purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-600 leading-relaxed">
                <li>To render your public bio link profile across desktop and mobile devices.</li>
                <li>To authenticate your session and allow you to edit your links and appearance settings.</li>
                <li>To count visits and clicks on your links and display aggregated statistics in your private dashboard.</li>
                <li>To maintain system performance, prevent spam, and secure accounts against unauthorized access.</li>
              </ul>
            </section>

            {/* 3. Cookies and Local Storage */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Cookie size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  3. Cookies and Local Storage
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                We use essential first-party browser local storage and secure authentication tokens strictly to keep you logged in and persist your interface preferences (such as your active tab). We do not set tracking cookies, behavioral tracking scripts, or cross-site advertising identifiers.
              </p>
            </section>

            {/* 4. Analytics (Privacy-First, Anonymous) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <EyeOff size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  4. Analytics (Privacy-First, Anonymous)
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                Our analytics architecture is built from the ground up to protect visitor anonymity:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-600 leading-relaxed">
                <li>We do not record personal identity, exact geographic coordinates, or invasive device fingerprints.</li>
                <li>Page views and link clicks are recorded as aggregated counters.</li>
                <li>Referrer data is processed in aggregate so you can see top traffic sources without tracking individual visitors.</li>
              </ul>
            </section>

            {/* 5. Data Retention */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <FileText size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  5. Data Retention
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                We store your account and profile data for as long as your account remains active. If you choose to delete your account, all associated links, customizations, and analytics counters are permanently erased from active storage.
              </p>
            </section>

            {/* 6. Your Rights */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <ShieldCheck size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  6. Your Rights
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                You retain full authority and ownership over your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-600 leading-relaxed">
                <li>
                  <strong className="text-slate-800 font-semibold">Right of Access:</strong> You can view all information saved in your profile directly from your dashboard.
                </li>
                <li>
                  <strong className="text-slate-800 font-semibold">Right of Rectification:</strong> You can edit or correct your profile details, links, and username at any time.
                </li>
                <li>
                  <strong className="text-slate-800 font-semibold">Right to Object:</strong> You can turn off or toggle profile visibility whenever you wish.
                </li>
              </ul>
            </section>

            {/* 7. Data Export and Deletion */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1 text-indigo-600 shrink-0">
                  <Download size={18} />
                  <Trash2 size={18} />
                </div>
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  7. Data Export and Deletion
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                You can download a full copy of your profile configuration and link structure in standard machine-readable JSON format directly from your Settings page. You can also initiate permanent account erasure at any time with a single confirmation, deleting all profile records immediately.
              </p>
            </section>

            {/* 8. Contact */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Mail size={20} className="text-indigo-600 shrink-0" />
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                  8. Contact
                </h2>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                If you have questions, feedback, or data requests regarding this Privacy Policy, please reach out to our team at:
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
