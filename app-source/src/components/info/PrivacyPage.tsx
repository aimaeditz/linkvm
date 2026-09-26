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
    <div className="min-h-screen w-full bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1 w-full py-12 md:py-20">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-8 lg:px-10">
          {/* Header Banner - Centered */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold tracking-widest uppercase mb-4">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Data Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center">
              Privacy Policy
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-2 text-center">
              Last updated: 2026
            </p>
          </div>

          {/* Privacy Commitment Banner */}
          <div className="w-full p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-12 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lock size={18} />
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Our Absolute Commitment to Your Privacy
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                We do not sell your personal data. We do not use third-party advertising trackers. We collect only what is strictly necessary to host and render your creator page.
              </p>
            </div>
          </div>

          {/* Prose Content */}
          <div className="w-full space-y-10">
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">1. Data We Collect</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                When you create an account and build your LinkVM page, we collect only the essential information needed to operate your profile:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li><strong className="text-slate-800 font-semibold">Account Credentials:</strong> Display name, unique username handle, and email address.</li>
                <li><strong className="text-slate-800 font-semibold">Profile Content:</strong> Custom link titles, destination URLs, bio description, avatar image URL, and social media profile handles.</li>
                <li><strong className="text-slate-800 font-semibold">Design Preferences:</strong> Selected theme configuration, button styles, custom colors, and pattern selections.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Lock size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">2. How We Use It</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We use the information collected exclusively for functional platform purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li>To render your public bio link profile across desktop and mobile devices.</li>
                <li>To authenticate your session and allow you to edit your links and appearance settings.</li>
                <li>To count visits and clicks on your links and display aggregated statistics in your private dashboard.</li>
                <li>To maintain system performance, prevent spam, and secure accounts against unauthorized access.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Cookie size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">3. Cookies and Local Storage</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We use essential first-party browser local storage and secure authentication tokens strictly to keep you logged in and persist your interface preferences (such as your active tab). We do not set tracking cookies, behavioral tracking scripts, or cross-site advertising identifiers.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <EyeOff size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">4. Analytics (Privacy-First, Anonymous)</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our analytics architecture is built from the ground up to protect visitor anonymity:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li>We do not record personal identity, exact geographic coordinates, or invasive device fingerprints.</li>
                <li>Page views and link clicks are recorded as aggregated counters.</li>
                <li>Referrer data is processed in aggregate so you can see top traffic sources without tracking individual visitors.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">5. Data Retention</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We store your account and profile data for as long as your account remains active. If you choose to delete your account, all associated links, customizations, and analytics counters are permanently erased from active storage.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldCheck size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">6. Your Rights</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                You retain full authority and ownership over your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li><strong className="text-slate-800 font-semibold">Right of Access:</strong> You can view all information saved in your profile directly from your dashboard.</li>
                <li><strong className="text-slate-800 font-semibold">Right of Rectification:</strong> You can edit or correct your profile details, links, and username at any time.</li>
                <li><strong className="text-slate-800 font-semibold">Right to Object:</strong> You can turn off or toggle profile visibility whenever you wish.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1 text-indigo-600 shrink-0">
                  <Download size={16} />
                  <Trash2 size={16} />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">7. Data Export and Deletion</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                You can download a full copy of your profile configuration and link structure in standard machine-readable JSON format directly from your Settings page. You can also initiate permanent account erasure at any time with a single confirmation, deleting all profile records immediately.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Mail size={18} className="text-indigo-600 shrink-0" />
                <h2 className="text-lg font-semibold text-slate-900">8. Contact</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you have questions, feedback, or data requests regarding this Privacy Policy, please reach out to our team at:
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
