import React, { useState, useEffect } from 'react';
import { Navbar } from '../landing/Navbar';
import { Footer } from '../landing/Footer';
import { BackToTop } from '../shared/BackToTop';
import { Mail, Send, CheckCircle2, MessageSquare, ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';

export interface ContactPageProps {
  onNavigate?: (route: string) => void;
}

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  subject: z.string().optional(),
  message: z.string().trim().min(1, 'Please enter your message.'),
});

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = `/${route}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const result = contactSchema.safeParse({ name, email, subject, message });
    if (!result.success) {
      const formattedErrors: { name?: string; email?: string; message?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as 'name' | 'email' | 'message';
        if (field && !formattedErrors[field]) {
          formattedErrors[field] = issue.message;
        }
      }
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const formData = new FormData();
    formData.append('access_key', '730da326-14c2-4f3c-9fc9-fa2b98c62122');
    formData.append('name', name.trim());
    formData.append('email', email.trim());
    formData.append('subject', subject.trim() || 'New LinkVM contact message');
    formData.append('message', message.trim());
    formData.append('from_name', 'LinkVM Contact Form');
    formData.append('botcheck', '');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success === true) {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setStatusMessage({
          type: 'success',
          text: "Thanks — your message has been sent. We'll reply within 24 hours.",
        });
        setToast({
          type: 'success',
          text: 'Message sent successfully.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Something went wrong. Please try again or email aimaeditz.info@gmail.com directly.',
        });
        setToast({
          type: 'error',
          text: 'Failed to send. Please try again.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Something went wrong. Please try again or email aimaeditz.info@gmail.com directly.',
      });
      setToast({
        type: 'error',
        text: 'Failed to send. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const quickFaqs = [
    {
      q: 'How quickly do you reply to inquiries?',
      a: 'Our engineering and support team reviews every message and responds within 24 hours Monday through Friday.',
    },
    {
      q: 'Where can I submit a feature recommendation?',
      a: 'You can submit suggestions directly through this contact form or email us at aimaeditz.info@gmail.com with the subject line Feature Request.',
    },
    {
      q: 'Do you charge for support tickets?',
      a: 'Never. Priority technical assistance is free for all creators.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase mb-4">
              Direct Support
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Get in touch.
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-lg mx-auto">
              Have questions, feedback, or need help? Reach out directly and we&apos;ll reply within 24 hours.
            </p>
            <div className="mt-3 text-xs text-slate-400 font-medium">
              Last updated: 2026
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="your.name"
                    className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all shadow-soft ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="you@domain.com"
                    className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all shadow-soft ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Question about LinkVM"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-soft"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    placeholder="How can we assist you?"
                    className={`w-full p-3.5 rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all shadow-soft resize-none ${
                      errors.message ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold text-sm shadow-medium hover:shadow-large transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </div>

                {statusMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-medium border ${
                      statusMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                        : 'bg-red-50 text-red-800 border-red-200/80'
                    }`}
                  >
                    {statusMessage.text}
                  </div>
                )}

                <p className="text-[11px] text-slate-400 text-center">
                  We&apos;ll reply within 24 hours.
                </p>
              </form>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
                  <Mail size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Email Support
                </h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Prefer direct email? Send a message to our support desk:
                </p>
                <a
                  href="mailto:aimaeditz.info@gmail.com"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 break-all"
                >
                  aimaeditz.info@gmail.com
                </a>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
                  <MessageSquare size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Community &amp; Bugs
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Notice an edge-case issue or want to suggest an improvement? We address feedback proactively on our GitHub repository.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 text-center mb-6">
              Quick Answers
            </h3>
            <div className="space-y-3">
              {quickFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-soft"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-3.5 px-5 flex items-center justify-between text-left text-sm font-semibold text-slate-900 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-slate-400 shrink-0"
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-2 leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
      <BackToTop />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2.5 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-red-600 text-white border-red-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-200 shrink-0" />
            )}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
