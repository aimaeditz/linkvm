import React from 'react';
import { User, LinkItem, ThemeConfig, SocialLinks } from '../../types';
import { getIconComponent } from '../dashboard/IconPicker';
import { getInitials } from '../../lib/utils';
import { Check, ExternalLink, Link as LinkIcon, Sparkles } from 'lucide-react';
import { BRAND } from '../../lib/constants';

export interface PhoneMockupProps {
  user?: Partial<User>;
  links?: LinkItem[];
  theme?: Partial<ThemeConfig>;
  socials?: Partial<SocialLinks>;
  onLinkClick?: (link: LinkItem) => void;
  scale?: number;
  interactive?: boolean;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  user,
  links = [],
  theme,
  socials,
  onLinkClick,
  scale = 1,
  interactive = true,
}) => {
  const displayName = user?.name || user?.username || 'Creator';
  const displayBio = user?.bio || '';
  const initials = getInitials(displayName);

  const bgColor = theme?.bgColor || '#FFFFFF';
  const buttonColor = theme?.buttonColor || '#0F172A';
  const textColor = theme?.textColor || '#0F172A';
  const buttonTextColor = theme?.buttonTextColor || '#FFFFFF';
  const buttonStyle = theme?.buttonStyle || 'solid';
  const buttonShape = theme?.buttonShape || 'rounded-xl';
  const bgType = theme?.bgType || 'solid';
  const bgGradientFrom = theme?.bgGradientFrom || '#FFFFFF';
  const bgGradientTo = theme?.bgGradientTo || '#F8FAFC';
  const fontFamily = theme?.fontFamily || 'Inter';

  const activeLinks = links.filter((l) => l.visible);

  const shapeClass =
    buttonShape === 'rounded-full'
      ? 'rounded-full'
      : buttonShape === 'rounded-none'
      ? 'rounded-none'
      : buttonShape === 'rounded-md'
      ? 'rounded-md'
      : 'rounded-xl';

  const getButtonStyles = (): React.CSSProperties => {
    switch (buttonStyle) {
      case 'solid':
        return {
          backgroundColor: buttonColor,
          color: buttonTextColor,
          border: '1px solid transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: textColor,
          border: `1.5px solid ${buttonColor}`,
        };
      case 'soft':
        return {
          backgroundColor: `${buttonColor}15`,
          color: buttonColor,
          border: '1px solid transparent',
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(12px)',
          color: textColor,
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${buttonColor}, #4338CA)`,
          color: buttonTextColor,
          border: 'none',
        };
      default:
        return {
          backgroundColor: buttonColor,
          color: buttonTextColor,
        };
    }
  };

  const getBackgroundStyles = (): React.CSSProperties => {
    if (bgType === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${bgGradientFrom} 0%, ${bgGradientTo} 100%)`,
      };
    }
    return {
      backgroundColor: bgColor,
    };
  };

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        fontFamily: fontFamily,
      }}
      className="relative mx-auto w-[320px] h-[640px] rounded-[3rem] border-[8px] border-slate-900 bg-white shadow-2xl overflow-hidden select-none flex flex-col"
    >
      {/* Phone Notch Pill */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-900/40" />
      </div>

      {/* Screen container */}
      <div
        className="w-full h-full pt-10 pb-6 px-4 overflow-y-auto flex flex-col transition-colors duration-300"
        style={getBackgroundStyles()}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-indigo-700 font-bold text-2xl tracking-wider shadow-inner">
                {initials}
              </div>
            </div>

            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-slate-950 shadow-sm"
              title="Verified Creator · 100% Free Forever"
            >
              <Check size={12} strokeWidth={3} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-3">
            <h4 className="font-bold text-base tracking-tight" style={{ color: textColor }}>
              {displayName}
            </h4>
          </div>

          {user?.username && (
            <p className="text-[11px] font-medium opacity-60 -mt-0.5" style={{ color: textColor }}>
              @{user.username}
            </p>
          )}

          {displayBio && (
            <p
              className="text-xs max-w-[260px] mt-2 leading-relaxed opacity-80"
              style={{ color: textColor }}
            >
              {displayBio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-2.5 my-auto w-full">
          {activeLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-200/80 rounded-2xl my-auto">
              <LinkIcon size={24} className="opacity-40 mb-2" style={{ color: textColor }} />
              <p className="text-xs font-semibold opacity-60" style={{ color: textColor }}>
                Add a link to preview
              </p>
            </div>
          ) : (
            activeLinks.map((link) => {
              const Icon = getIconComponent(link.icon);
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => interactive && onLinkClick && onLinkClick(link)}
                  className={`w-full py-3 px-3.5 flex items-center justify-between text-left text-xs font-semibold transition-all duration-150 group cursor-pointer ${shapeClass}`}
                  style={getButtonStyles()}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 opacity-90">
                      <Icon size={16} />
                    </div>
                    <span className="truncate">{link.title}</span>
                  </div>
                  <ExternalLink
                    size={12}
                    className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Subtle footer */}
        <div className="mt-4 pt-2 text-center text-[10px] opacity-60 font-medium tracking-wide" style={{ color: textColor }}>
          LinkVM • {BRAND.badge}
        </div>
      </div>
    </div>
  );
};
