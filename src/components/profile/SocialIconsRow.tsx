import React from 'react';
import { SocialLinks, ThemeConfig } from '../../types';
import { SocialIcon } from '../shared/SocialIcon';
import { SOCIAL_PLATFORMS } from '../../lib/constants';

interface SocialIconsRowProps {
  socials?: SocialLinks;
  theme: ThemeConfig;
}

export const SocialIconsRow: React.FC<SocialIconsRowProps> = ({ socials, theme }) => {
  if (!socials) return null;

  // Extract filled socials (skip empty values, id and userId)
  const filledPlatforms = SOCIAL_PLATFORMS.filter((plat) => {
    const val = (socials as any)[plat.id];
    return Boolean(val) && val.trim() !== '';
  });

  if (filledPlatforms.length === 0) return null;

  // Parse appearance controls
  const sizeValue = theme.socialIconSize || 'medium';
  const shapeValue = theme.socialIconShape || 'circle';
  const fillValue = theme.socialIconFill || 'outline';
  const colorValue = theme.socialIconColor || '#0F172A';
  const bgValue = theme.socialIconBg || '#FFFFFF';
  const borderValue = theme.socialIconBorder || '#E2E8F0';
  const spacingValue = theme.socialIconSpacing || 'normal';
  const layoutValue = theme.socialIconLayout || 'row';
  const alignValue = theme.socialIconAlign || 'center';
  const hoverValue = theme.buttonHover || 'lift'; // fallback to theme's button hover if not separate

  // Sizing definitions
  let wrapperClass = 'h-9 w-9';
  let innerIconSize = 18;
  if (sizeValue === 'small') {
    wrapperClass = 'h-7 w-7';
    innerIconSize = 14;
  } else if (sizeValue === 'large') {
    wrapperClass = 'h-11 w-11';
    innerIconSize = 22;
  }

  // Shape definitions
  let shapeClass = 'rounded-full';
  if (shapeValue === 'rounded-square') {
    shapeClass = 'rounded-lg';
  } else if (shapeValue === 'square') {
    shapeClass = 'rounded-none';
  }

  // Spacing definitions
  let spacingClass = 'gap-3';
  if (spacingValue === 'tight') {
    spacingClass = 'gap-1.5';
  } else if (spacingValue === 'relaxed') {
    spacingClass = 'gap-5';
  }

  // Layout definitions
  let layoutClass = 'flex flex-row flex-wrap';
  if (layoutValue === 'row') {
    layoutClass = 'flex flex-row overflow-x-auto no-scrollbar whitespace-nowrap';
  } else if (layoutValue === 'two-rows') {
    layoutClass = 'grid grid-rows-2 grid-flow-col';
  }

  // Alignment definitions
  let alignClass = 'justify-center';
  if (alignValue === 'left') {
    alignClass = 'justify-start';
  } else if (alignValue === 'right') {
    alignClass = 'justify-end';
  }

  // Hover animations
  let hoverClass = 'transition-all duration-350 ease-[0.22,1,0.36,1] motion-reduce:transition-none';
  if (hoverValue === 'lift') {
    hoverClass += ' hover:-translate-y-1 hover:shadow-md';
  } else if (hoverValue === 'glow') {
    hoverClass += ' hover:brightness-110 hover:shadow-lg';
  } else if (hoverValue === 'darken') {
    hoverClass += ' hover:brightness-90';
  } else if (hoverValue === 'underline') {
    hoverClass += ' hover:scale-105'; // subtle scale
  } else if (hoverValue === 'scale') {
    hoverClass += ' hover:scale-110';
  } else if (hoverValue === 'bounce') {
    hoverClass += ' hover:animate-bounce';
  }

  return (
    <div className={`w-full flex ${alignClass} py-2`}>
      <div className={`${layoutClass} ${spacingClass} ${alignClass} items-center max-w-full`}>
        {filledPlatforms.map((plat) => {
          const val = (socials as any)[plat.id];
          const fullUrl = val.startsWith('http') || val.startsWith('mailto:') ? val : `${plat.prefix}${val}`;

          // Styling options
          const style: React.CSSProperties = {
            color: colorValue,
            borderColor: borderValue,
            borderWidth: '1px',
            borderStyle: 'solid',
            backgroundColor: fillValue === 'solid' ? bgValue : 'transparent',
          };

          return (
            <a
              key={plat.id}
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center shrink-0 border select-none cursor-pointer ${wrapperClass} ${shapeClass} ${hoverClass}`}
              style={style}
              title={plat.label}
            >
              <SocialIcon platform={plat.id} size={innerIconSize} color={colorValue} />
            </a>
          );
        })}
      </div>
    </div>
  );
};
