import React from 'react';
import { User, LinkItem, ThemeConfig, SocialLinks } from '@/src/types';
import { getIconComponent } from './IconPicker';
import { CheckCircle2, Sparkles, ExternalLink, Globe } from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface ProfilePreviewProps {
  user: User;
  links: LinkItem[];
  theme: ThemeConfig;
  socials?: SocialLinks;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  user,
  links,
  theme,
  socials,
}) => {
  const visibleLinks = links.filter((l) => l.visible);
  const displayUrl = `linkvm.online/${user.username.replace(/^@/, '')}`;

  const getButtonShapeClass = (shape: string) => {
    switch (shape) {
      case 'rounded-none':
        return 'rounded-none';
      case 'rounded-md':
        return 'rounded-md';
      case 'rounded-full':
        return 'rounded-full';
      default:
        return 'rounded-xl';
    }
  };

  const getButtonStyle = (item: LinkItem) => {
    const isOutline = theme.buttonStyle === 'outline';
    const isSoft = theme.buttonStyle === 'soft';
    const isGlass = theme.buttonStyle === 'glass';
    const isGradient = theme.buttonStyle === 'gradient';

    if (isOutline) {
      return {
        backgroundColor: 'transparent',
        color: theme.textColor,
        border: `1.5px solid ${theme.buttonColor || theme.textColor}`,
      };
    }
    if (isSoft) {
      return {
        backgroundColor: `${theme.buttonColor}20`,
        color: theme.buttonColor,
        border: '1px solid transparent',
      };
    }
    if (isGlass) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        color: theme.textColor,
        border: '1px solid rgba(255, 255, 255, 0.4)',
      };
    }
    if (isGradient) {
      return {
        background: `linear-gradient(135deg, ${theme.buttonColor}, #4338CA)`,
        color: theme.buttonTextColor || '#FFFFFF',
        border: 'none',
      };
    }
    return {
      backgroundColor: theme.buttonColor,
      color: theme.buttonTextColor || '#FFFFFF',
      border: 'none',
    };
  };

  const backgroundStyle =
    theme.bgType === 'gradient' && theme.bgGradientFrom && theme.bgGradientTo
      ? {
          background: `linear-gradient(135deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})`,
        }
      : {
          backgroundColor: theme.bgColor,
        };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[340px]">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>Live Phone Preview</span>
      </div>

      {/* Phone Mockup Frame */}
      <div className="w-[300px] sm:w-[320px] h-[580px] sm:h-[600px] bg-slate-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-900/40 relative flex flex-col shrink-0">
        {/* Phone Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-900/60" />
        </div>

        {/* Screen Container */}
        <div
          className="w-full h-full rounded-[36px] overflow-y-auto overflow-x-hidden flex flex-col justify-between p-4 pt-9 shadow-inner relative no-scrollbar"
          style={{ ...backgroundStyle, fontFamily: theme.fontFamily }}
        >
          {/* Top Domain pill */}
          <div className="w-full flex justify-center mb-3">
            <div className="px-3 py-1 rounded-full bg-black/10 backdrop-blur-md text-[10px] font-medium text-slate-800 flex items-center gap-1 border border-black/5">
              <Globe className="w-2.5 h-2.5 text-slate-600" />
              <span>{displayUrl}</span>
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-black text-xl flex items-center justify-center shadow-md ring-2 ring-white/50 shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || user.username}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 justify-center">
              <h3
                className="text-base font-extrabold tracking-tight"
                style={{ color: theme.textColor }}
              >
                {user.name || user.username}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-amber-500 fill-amber-500 text-white" />
            </div>

            {user.bio ? (
              <p
                className="text-xs max-w-xs leading-relaxed opacity-85 px-2"
                style={{ color: theme.textColor }}
              >
                {user.bio}
              </p>
            ) : (
              <p className="text-[11px] opacity-60" style={{ color: theme.textColor }}>
                @{user.username}
              </p>
            )}
          </div>

          {/* Links List */}
          <div className="flex-1 space-y-2.5 w-full">
            {visibleLinks.length === 0 ? (
              <div className="py-8 text-center text-xs opacity-60">
                No active links added yet.
              </div>
            ) : (
              visibleLinks.map((link) => {
                const IconComponent = getIconComponent(link.icon);
                return (
                  <div
                    key={link.id}
                    className={`w-full px-4 py-3 text-xs font-bold transition-transform shadow-xs flex items-center justify-between gap-3 ${getButtonShapeClass(
                      theme.buttonShape
                    )}`}
                    style={getButtonStyle(link)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span className="truncate">{link.title}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Brand Credit */}
          <div className="pt-5 pb-2 text-center">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold opacity-60" style={{ color: theme.textColor }}>
              <span>LinkVM</span>
              <span>•</span>
              <span>{BRAND.badge}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
