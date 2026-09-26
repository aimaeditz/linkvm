import React from 'react';
import { Navbar } from '../landing/Navbar';
import { Footer } from '../landing/Footer';
import { BackToTop } from '../shared/BackToTop';
import { ShieldCheck, Lock } from 'lucide-react';

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

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold tracking-widest uppercase mb-4">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Data Protection</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-2">
              Last updated: 2026
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-12 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-soft">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Our Absolute Commitment to Your Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                We do not sell your data. We do not use third-party ad trackers. We collect only what is strictly necessary to host and render your creator page.
              </p>
            </div>
          </div>

          <div className="space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                1. Data We Collect
              </h2>
              <p>
                When you create an account on LinkVM, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
                <li>Your chosen display name, username, and email address.</li>
                <li>Your profile content: custom links, bio description, theme preferences, and icon configurations.</li>
                <li>Aggregated, non-personally identifiable visit counts to generate real-time click and impression metrics.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                2. How We Use It
              </h2>
              <p>
                We use the collected information exclusively to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
                <li>Render your public LinkVM page when visitors navigate to your unique URL.</li>
                <li>Authenticate your identity and restore your profile settings across sessions.</li>
                <li>Provide accurate click-through counts on your personal dashboard.</li>
                <li>Ensure system security and prevent automated abusive behavior.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                3. Cookies and Local Storage
              </h2>
              <p>
                We use essential first-party cookies and browser local storage strictly for authentication session tokens and client-side preferences (such as remembering your active tab or display mode). We do not deploy third-party advertising cookies or cross-site tracking beacons.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                4. Third Parties
              </h2>
              <p>
                We do not sell, rent, or trade your personal information to data brokers or advertising exchanges under any circumstance. We only utilize trusted cloud hosting infrastructure providers to serve encrypted web traffic and store data under strict security compliance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                5. Your Rights and Data Control
              </h2>
              <p>
                Under global privacy frameworks (including GDPR and CCPA), you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
                <li>Access all personal data stored under your account.</li>
                <li>Correct, update, or modify your links and profile details at any time.</li>
                <li>Request permanent account deletion and complete erasure of all associated logs.</li>
                <li>Export your profile information in standard machine-readable JSON format.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                6. Data Retention
              </h2>
              <p>
                We retain your account details as long as your LinkVM account remains active. If you elect to delete your account via the settings dashboard, all personal profiles, stored links, and private logs are permanently removed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                7. Contact
              </h2>
              <p>
                For questions regarding this privacy policy or to submit a data erasure request, please contact our team directly at:
              </p>
              <p className="font-semibold text-indigo-600">
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
