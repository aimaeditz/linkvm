import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Check,
  Link2,
  Palette,
  BarChart3,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Twitch,
  Music2,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export interface HeroProps {
  onStartFree?: () => void;
  onSeeHowItWorks?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartFree, onSeeHowItWorks }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isCardHovered, setIsCardHovered] = React.useState(false);

  const ringRadii = {
    inner: 'var(--inner-r)',
    middle: 'var(--middle-r)',
    outer: 'var(--outer-r)',
  };

  const socialIcons = [
    {
      Icon: Instagram,
      ring: 'inner' as const,
      duration: 60,
      clockwise: true,
      initialAngle: 0,
      color: 'text-pink-600',
    },
    {
      Icon: Youtube,
      ring: 'inner' as const,
      duration: 60,
      clockwise: true,
      initialAngle: 180,
      color: 'text-red-600',
    },
    {
      Icon: Twitter,
      ring: 'middle' as const,
      duration: 90,
      clockwise: false,
      initialAngle: 0,
      color: 'text-sky-500',
    },
    {
      Icon: Facebook,
      ring: 'middle' as const,
      duration: 90,
      clockwise: false,
      initialAngle: 120,
      color: 'text-blue-600',
    },
    {
      Icon: Linkedin,
      ring: 'middle' as const,
      duration: 90,
      clockwise: false,
      initialAngle: 240,
      color: 'text-blue-700',
    },
    {
      Icon: Github,
      ring: 'outer' as const,
      duration: 120,
      clockwise: true,
      initialAngle: 40,
      color: 'text-slate-800',
    },
    {
      Icon: Twitch,
      ring: 'outer' as const,
      duration: 120,
      clockwise: true,
      initialAngle: 160,
      color: 'text-purple-600',
    },
    {
      Icon: Music2,
      ring: 'outer' as const,
      duration: 120,
      clockwise: true,
      initialAngle: 280,
      color: 'text-slate-700',
    },
  ];

  const handleStart = () => {
    if (onStartFree) {
      onStartFree();
    } else {
      window.location.href = '/signup';
    }
  };

  const handleScrollToHowItWorks = () => {
    if (onSeeHowItWorks) {
      onSeeHowItWorks();
    } else {
      const el = document.querySelector('#how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const easeQuint = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative overflow-hidden pt-24 md:pt-28 lg:pt-32 pb-20 md:pb-28 bg-white w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-[580px] h-[580px] rounded-full bg-indigo-200/40 blur-[120px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-24 w-[540px] h-[540px] rounded-full bg-amber-100/40 blur-[120px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-15 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        style={{
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeQuint }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-soft select-none"
            >
              <Sparkles size={14} className="text-amber-500 fill-amber-400" />
              <span>100% Free Forever · No Credit Card · No Subscriptions</span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.08, ease: easeQuint }}
              className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-extrabold text-slate-900 tracking-tight leading-[1.08]"
            >
              All your links.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-950 bg-clip-text text-transparent">
                One premium page.
              </span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.16, ease: easeQuint }}
              className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed font-normal"
            >
              Consolidate your social media, portfolio, and business links into one beautiful,
              lightning-fast page. Every feature unlocked. Free forever.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.24, ease: easeQuint }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <button
                type="button"
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white font-medium text-sm sm:text-base shadow-medium hover:shadow-large transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 group"
              >
                <span>Start Free</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                type="button"
                onClick={handleScrollToHowItWorks}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-medium text-sm sm:text-base shadow-soft hover:shadow-medium transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Play size={10} className="fill-indigo-600 ml-0.5" />
                </div>
                <span>See How It Works</span>
              </button>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.32, ease: easeQuint }}
              className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-xs text-slate-500 font-medium"
            >
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
                No credit card
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
                No subscriptions
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
                Live in 60 seconds
              </span>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.38, ease: easeQuint }}
              className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3"
            >
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft text-xs font-medium text-slate-700">
                <Link2 size={13} className="text-indigo-600" />
                <span>Unlimited Links</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft text-xs font-medium text-slate-700">
                <Palette size={13} className="text-indigo-600" />
                <span>All Themes Unlocked</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft text-xs font-medium text-slate-700">
                <BarChart3 size={13} className="text-indigo-600" />
                <span>Full Analytics</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center justify-center relative select-none">
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] bg-gradient-to-tr from-indigo-500/10 via-violet-400/10 to-amber-300/10 rounded-full blur-3xl -z-10"
            />

            <div
              className="relative w-full max-w-[800px] aspect-square flex items-center justify-center p-24 md:p-28 lg:p-36 overflow-visible [--inner-r:145px] sm:[--inner-r:185px] md:[--inner-r:220px] [--middle-r:190px] sm:[--middle-r:235px] md:[--middle-r:280px] [--outer-r:235px] sm:[--outer-r:285px] md:[--outer-r:340px]"
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
            >
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible"
                fill="none"
              >
                <circle
                  cx="50%"
                  cy="50%"
                  r="var(--inner-r)"
                  stroke="#c7d2fe"
                  strokeWidth="1.2"
                  className="opacity-40"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="var(--middle-r)"
                  stroke="#c7d2fe"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  className="opacity-30"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="var(--outer-r)"
                  stroke="#c7d2fe"
                  strokeWidth="1.2"
                  className="opacity-20"
                />
              </svg>

              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-20 w-[240px] sm:w-[268px] rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_45px_rgba(15,23,42,0.08)] p-5 sm:p-6 flex flex-col items-center text-center select-none"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-indigo-600 p-[2px] shadow-sm flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">
                      you
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 mt-3">
                  your.name
                </h4>

                <p className="text-xs text-slate-500 font-medium -mt-0.5">
                  @yourhandle
                </p>

                <p className="text-xs text-slate-400 italic mt-1.5">
                  your bio goes here
                </p>

                <div className="w-full flex flex-col gap-1.5 mt-4 pt-3 border-t border-slate-100">
                  <div className="w-full py-2 px-3 rounded-full bg-slate-900 text-white text-[11px] font-medium flex items-center justify-between shadow-xs">
                    <span className="truncate">Featured Work</span>
                    <span className="opacity-70 text-[10px]">↗</span>
                  </div>
                  <div className="w-full py-2 px-3 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center justify-between">
                    <span className="truncate">Newsletter & Updates</span>
                    <span className="opacity-50 text-[10px]">↗</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center">
                  <span className="text-[11px] font-mono font-medium text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-md">
                    linkvm.online/yourhandle
                  </span>
                </div>
              </motion.div>

              {socialIcons.map((iconConfig, index) => {
                const { Icon, ring, duration, clockwise, initialAngle, color } = iconConfig;
                const radius = ringRadii[ring];
                const rotationValue = clockwise ? 360 : -360;

                return (
                  <motion.div
                    key={index}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: 0,
                      height: 0,
                      zIndex: 10,
                    }}
                    initial={{ opacity: 0 }}
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1, rotate: initialAngle }
                        : {
                            opacity: 1,
                            rotate: [initialAngle, initialAngle + rotationValue],
                          }
                    }
                    transition={
                      shouldReduceMotion
                        ? { opacity: { duration: 0.5, delay: index * 0.06 } }
                        : {
                            opacity: { duration: 0.5, delay: index * 0.06, ease: 'easeOut' },
                            rotate: {
                              repeat: Infinity,
                              ease: 'linear',
                              duration: isCardHovered ? duration * 1.25 : duration,
                            },
                          }
                    }
                  >
                    <div
                      style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translateX(${radius})`,
                      }}
                    >
                      <motion.div
                        animate={
                          shouldReduceMotion
                            ? { rotate: -initialAngle }
                            : {
                                rotate: [-initialAngle, -initialAngle - rotationValue],
                                y: [0, -4, 4, 0],
                              }
                        }
                        transition={
                          shouldReduceMotion
                            ? {}
                            : {
                                rotate: {
                                  repeat: Infinity,
                                  ease: 'linear',
                                  duration: isCardHovered ? duration * 1.25 : duration,
                                },
                                y: {
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  duration: 6,
                                  delay: (initialAngle / 360) * 6,
                                },
                              }
                        }
                        className="flex items-center justify-center"
                      >
                        <motion.div
                          whileHover={{ scale: 1.08, opacity: 0.95 }}
                          className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-white border border-slate-200/90 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all cursor-pointer group hover:border-indigo-200"
                        >
                          <Icon
                            size={18}
                            className={`${color} group-hover:scale-105 transition-transform`}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 font-medium text-center mt-3 sm:mt-4">
              One page. Every link. Always free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
