import React from 'react';
import { Navbar } from '../landing/Navbar';
import { Footer } from '../landing/Footer';
import { BackToTop } from '../shared/BackToTop';
import { Scale } from 'lucide-react';

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

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase mb-4">
              <Scale size={14} className="text-indigo-600" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-2">
              Last updated: 2026
            </p>
          </div>

          <div className="space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                1. Acceptance of Terms
              </h2>
              <p>
                By registering for an account, accessing, or using LinkVM (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of the Service immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                2. User Accounts &amp; Registration
              </h2>
              <p>
                You must provide accurate and verifiable information when creating an account. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your username.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                3. Acceptable Use
              </h2>
              <p>
                LinkVM is intended for sharing legitimate professional, creative, personal, and commercial links. You agree NOT to use the Service to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
                <li>Host or distribute phishing links, malware, spyware, or malicious software.</li>
                <li>Impersonate any individual, organization, or brand without authorization.</li>
                <li>Engage in illegal, deceptive, fraudulent, or harassing conduct.</li>
                <li>Violate third-party intellectual property or copyright protections.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                4. Content Ownership &amp; Intellectual Property
              </h2>
              <p>
                You retain complete ownership of all content, titles, bios, and links you publish through LinkVM. You grant us a limited, worldwide license solely to store, display, and transmit your public profile on your behalf.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                5. Termination &amp; Account Suspension
              </h2>
              <p>
                You may terminate your account at any time via your account settings. We reserve the right to suspend or remove profiles that violate acceptable use standards, spread malicious redirects, or compromise platform integrity.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                6. Disclaimers
              </h2>
              <p>
                The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, error-free, or entirely free of transient network faults.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                7. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, LinkVM and its maintainers shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to access the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                8. Changes to Terms
              </h2>
              <p>
                We may revise these Terms of Service periodically to reflect product updates or legal requirements. Material revisions will be posted on this page with an updated revision date.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                9. Contact Information
              </h2>
              <p>
                For questions regarding these terms, please contact:
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
