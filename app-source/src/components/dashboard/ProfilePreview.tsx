import React from 'react';
import { User, LinkItem, ThemeConfig, SocialLinks } from '../../types';
import { getIconComponent } from './IconPicker';
import { CheckCircle2, Sparkles, ExternalLink, Globe } from 'lucide-react';
import { BRAND, getThemeStyles } from '../../lib/constants';
import { buildPatternDisplayUrl } from '../../lib/username-patterns';
import { SocialIconsRow } from '../profile/SocialIconsRow';

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
  const cleanUsername = (user.username || 'google-creator').replace(/^[@$\-+!~]/, '').trim();
  const displayUrl = `linkvm.online/${cleanUsername}`;

  const getButtonShapeClass = (shape: string) => {
    switch (shape) {
      case 'sharp':
      case 'rounded-none':
        return 'rounded-none';
      case 'square':
      case 'rounded-md':
        return 'rounded-lg';
      case 'rounded':
      case 'rounded-xl':
        return 'rounded-2xl';
      case 'pill':
      case 'rounded-full':
        return 'rounded-full';
      default:
        return 'rounded-xl';
    }
  };

  const { bgStyle, buttonStyle, cardStyle } = getThemeStyles(theme);

  const getButtonStyle = (item: LinkItem) => {
    return {
      ...buttonStyle,
      fontFamily: theme.fontFamily || 'Inter',
      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      ...cardStyle,
    };
  };

  const backgroundStyle = bgStyle;

  // Extract decorative background patterns
  const renderStickerPatterns = () => {
    if (theme.stickerPack === 'geometric') {
      return (
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-10 left-6 w-16 h-16 border-2 border-slate-900 rotate-12 rounded-lg" />
          <div className="absolute bottom-20 right-6 w-20 h-20 border-2 border-slate-900 rotate-45" />
          <div className="absolute top-1/2 left-10 w-8 h-8 rounded-full border-2 border-slate-900" />
        </div>
      );
    }
    if (theme.stickerPack === 'minimal-dots') {
      return (
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden select-none" 
             style={{ backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
      );
    }
    if (theme.stickerPack === 'subtle-lines') {
      return (
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden select-none"
             style={{ backgroundImage: 'linear-gradient(45deg, #000000 25%, transparent 25%), linear-gradient(-45deg, #000000 25%, transparent 25%)', backgroundSize: '24px 24px' }} />
      );
    }
    return null;
  };

  // Card hover physics classes
  const getHoverClass = (hover: string) => {
    switch (hover) {
      case 'lift':
        return 'hover:-translate-y-1 hover:shadow-md';
      case 'glow':
        return 'hover:brightness-110 hover:shadow-lg';
      case 'darken':
        return 'hover:brightness-90';
      case 'underline':
        return 'hover:underline';
      case 'shimmer':
        return 'relative overflow-hidden hover:opacity-95';
      case 'scale':
        return 'hover:scale-[1.02]';
      default:
        return 'hover:-translate-y-0.5';
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[340px]">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-slate-900" />
        <span>Live Phone Preview</span>
      </div>

      {/* Phone Mockup Frame */}
      <div className="w-[300px] sm:w-[320px] h-[580px] sm:h-[600px] bg-slate-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-900/40 relative flex flex-col shrink-0">
        {/* Phone Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900/40" />
        </div>

        {/* Screen Container */}
        <div
          className="w-full h-full rounded-[36px] overflow-y-auto overflow-x-hidden flex flex-col justify-between p-3.5 pt-9 shadow-inner relative no-scrollbar"
          style={{ ...backgroundStyle, fontFamily: theme.fontFamily }}
        >
          {/* Decorative Stickers */}
          {renderStickerPatterns()}

          <div className="relative z-10">
            {/* Top Cover Media (Video or Image) */}
            {user.coverVideoUrl ? (
              <div className="w-full h-24 rounded-2xl overflow-hidden mb-3 relative bg-slate-900 shadow-2xs">
                <video
                  src={user.coverVideoUrl}
                  muted={user.coverVideoMuted ?? true}
                  loop={user.coverVideoLoop ?? true}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ) : user.coverImageUrl ? (
              <div className="w-full h-24 rounded-2xl overflow-hidden mb-3 relative bg-slate-100 shadow-2xs">
                <img src={user.coverImageUrl} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : null}

            {/* Top Domain pill */}
            <div className="w-full flex justify-center mb-3">
              <div className="px-3 py-1 rounded-full bg-black/10 backdrop-blur-md text-[10px] font-medium text-slate-800 flex items-center gap-1 border border-black/5">
                <Globe className="w-2.5 h-2.5 text-slate-600" />
                <span className="font-mono">{displayUrl}</span>
              </div>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-2 mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-black text-xl flex items-center justify-center shadow-md ring-2 ring-white/50 shrink-0 overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 justify-center">
                <h3
                  className="text-base font-extrabold tracking-tight"
                  style={{ color: theme.headingColor || theme.textColor }}
                >
                  {user.name || user.username}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-900 text-white" />
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

              {/* Real-time styled Social Icons Row */}
              <SocialIconsRow socials={socials} theme={theme} />

              {/* Optional Gallery Strip */}
              {user.galleryUrls && user.galleryUrls.length > 0 && (
                <div className="w-full pt-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar px-1">
                    {user.galleryUrls.map((gUrl, idx) => (
                      <img
                        key={idx}
                        src={gUrl}
                        alt={`Gallery ${idx}`}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-black/10 shadow-2xs"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Links List with Card styling */}
            <div className="space-y-2.5 w-full">
              {visibleLinks.length === 0 ? (
                <div className="py-6 text-center text-xs opacity-60" style={{ color: theme.textColor }}>
                  No active links added yet.
                </div>
              ) : (
                visibleLinks.map((link) => {
                  const IconComponent = getIconComponent(link.icon);

                  return (
                    <div
                      key={link.id}
                      className={`w-full px-4 py-3 text-xs font-bold flex items-center justify-between gap-3 ${getButtonShapeClass(
                        theme.buttonShape
                      )} ${getHoverClass(theme.buttonHover || 'lift')}`}
                      style={getButtonStyle(link)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComponent className="w-4 h-4 shrink-0" style={{ color: getButtonStyle(link).color }} />
                        <span className="truncate">{link.title}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" style={{ color: getButtonStyle(link).color }} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer Brand Credit */}
          <div className="pt-5 pb-2 text-center relative z-10 space-y-1">
            <div className="text-[10px] font-mono font-semibold opacity-75" style={{ color: theme.textColor }}>
              linkvm.online/{user.username || 'google-creator'}
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold opacity-60" style={{ color: theme.textColor }}>
              <span>Made with LinkVM</span>
              <span>•</span>
              <span>100% Free Forever</span>
            </div>
            <div className="text-[8px] font-medium opacity-40" style={{ color: theme.textColor }}>
              Created by AiMAEditz
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
