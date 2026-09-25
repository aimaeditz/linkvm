import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Palette,
  QrCode,
  BarChart3,
  Globe,
  Heart,
} from 'lucide-react';

interface ChipConfig {
  Icon: React.ComponentType<any>;
  positionClass: string;
  delay: number;
  duration: number;
}

export const FloatingChips: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const chips: ChipConfig[] = [
    { Icon: Sparkles, positionClass: 'top-[12%] left-[8%] sm:left-[16%] md:left-[22%]', delay: 0, duration: 6 },
    { Icon: ShieldCheck, positionClass: 'top-[15%] right-[8%] sm:right-[16%] md:right-[22%]', delay: 0.5, duration: 7 },
    { Icon: Zap, positionClass: 'top-[42%] left-[5%] sm:left-[12%] md:left-[18%]', delay: 1, duration: 5.5 },
    { Icon: Palette, positionClass: 'top-[45%] right-[5%] sm:right-[12%] md:right-[18%]', delay: 1.5, duration: 6.5 },
    { Icon: QrCode, positionClass: 'bottom-[15%] left-[8%] sm:left-[16%] md:left-[22%]', delay: 0.8, duration: 8 },
    { Icon: BarChart3, positionClass: 'bottom-[12%] right-[8%] sm:right-[16%] md:right-[22%]', delay: 1.2, duration: 7.5 },
    { Icon: Globe, positionClass: 'top-[68%] left-[7%] sm:left-[14%] md:left-[19%]', delay: 0.3, duration: 6.2 },
    { Icon: Heart, positionClass: 'top-[28%] right-[7%] sm:right-[14%] md:right-[19%]', delay: 1.7, duration: 6.8 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-15 overflow-hidden select-none">
      {chips.map((chip, index) => {
        const IconComponent = chip.Icon;
        return (
          <motion.div
            key={index}
            className={`absolute ${chip.positionClass}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: chip.delay * 0.4 }}
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -6, 0],
                      rotate: [-3, 3, -3],
                    }
              }
              transition={{
                duration: chip.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: chip.delay,
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex items-center justify-center text-slate-700"
            >
              <IconComponent className="w-[18px] h-[18px] text-slate-700" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
