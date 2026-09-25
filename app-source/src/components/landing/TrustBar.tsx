import React from 'react';

interface LogoItem {
  name: string;
  renderIcon: () => React.ReactNode;
}

export const TrustBar: React.FC = () => {
  const logos: LogoItem[] = [
    {
      name: 'KINETIC',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v9l6 3" />
        </svg>
      ),
    },
    {
      name: 'NEXUS',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      name: 'PRISM',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <polygon points="12 2 22 20 2 20" />
          <path d="M12 9v11" />
        </svg>
      ),
    },
    {
      name: 'AETHER',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      name: 'SYNAPSE',
      renderIcon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full border-y border-slate-100 bg-white py-12 overflow-hidden select-none">
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.3333%);
          }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .marquee-wrapper:hover .animate-marquee {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none !important;
            transform: none !important;
            width: 100% !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          .marquee-duplicate-set {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full px-6 md:px-10 mb-8 text-center">
        <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          TRUSTED BY TOP CREATORS, TEAMS, AND BUILDERS WORLDWIDE
        </h2>
      </div>

      <div className="relative w-full overflow-hidden marquee-wrapper">
        <div className="flex w-max animate-marquee gap-12 md:gap-16">
          <div className="flex flex-shrink-0 gap-12 md:gap-16">
            {logos.map((logo, index) => (
              <div
                key={`set1-${index}`}
                className="flex items-center gap-3 text-slate-400 hover:text-slate-700 transition-colors duration-200 cursor-default shrink-0"
              >
                {logo.renderIcon()}
                <span className="font-extrabold tracking-wider text-sm">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-shrink-0 gap-12 md:gap-16 marquee-duplicate-set">
            {logos.map((logo, index) => (
              <div
                key={`set2-${index}`}
                className="flex items-center gap-3 text-slate-400 hover:text-slate-700 transition-colors duration-200 cursor-default shrink-0"
              >
                {logo.renderIcon()}
                <span className="font-extrabold tracking-wider text-sm">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-shrink-0 gap-12 md:gap-16 marquee-duplicate-set">
            {logos.map((logo, index) => (
              <div
                key={`set3-${index}`}
                className="flex items-center gap-3 text-slate-400 hover:text-slate-700 transition-colors duration-200 cursor-default shrink-0"
              >
                {logo.renderIcon()}
                <span className="font-extrabold tracking-wider text-sm">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
