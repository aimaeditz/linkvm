import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AuthBackdrop: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 w-full h-full bg-white -z-20 overflow-hidden select-none">
      {/* Slow-drifting blurred gradient orbs */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 20, -15, 0],
                y: [0, -25, 20, 0],
              }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-[120px]"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -25, 20, 0],
                y: [0, 20, -25, 0],
              }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-amber-50/40 blur-[120px]"
      />

      {/* Very light dotted SVG grid overlay with radial mask */}
      <div
        className="absolute inset-0 opacity-12"
        style={{
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)',
        }}
      />
    </div>
  );
};
