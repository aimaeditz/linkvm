import React, { useState, useEffect } from 'react';
import { User, LinkItem, ThemeConfig, SocialLinks } from '../../types';
import { StorageService } from '../../lib/storage';
import { getIconComponent } from '../dashboard/IconPicker';
import { ShareMenu } from '../profile/ShareMenu';
import { SOCIAL_PLATFORMS, BRAND, getThemeStyles } from '../../lib/constants';
import { CheckCircle2, Share2, ExternalLink, ArrowLeft, Globe } from 'lucide-react';
import { buildPatternDisplayUrl } from '../../lib/username-patterns';
import { SocialIconsRow } from '../profile/SocialIconsRow';

interface PublicProfilePageProps {
  user: User;
  links: LinkItem[];
  theme: ThemeConfig;
  socials?: SocialLinks;
  onBackToDashboard?: () => void;
  onNavigateHome?: () => void;
}

export const PublicProfilePage: React.FC<PublicProfilePageProps> = ({
  user,
  links,
  theme,
  socials,
  onBackToDashboard,
  onNavigateHome,
}) => {
  const [shareOpen, setShareOpen] = useState(false);
  const visibleLinks = links.filter((l) => l.visible);
  const displayUrl = buildPatternDisplayUrl(user.sharePattern || '{username}', user.username);

  // Record profile view event on mount
  useEffect(() => {
    if (user.id) {
      StorageService.recordEvent({
        userId: user.id,
        event: 'view',
      });
    }
  }, [user.id]);

  const handleLinkClick = (link: LinkItem) => {
    StorageService.recordEvent({
      userId: user.id,
      linkId: link.id,
      event: 'click',
    });
  };

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
        return 'rounded-2xl';
    }
  };

  const getButtonHoverClass = (hover?: string) => {
    switch (hover) {
      case 'lift':
        return 'hover:-translate-y-1 hover:shadow-lg transition-transform duration-200';
      case 'bounce':
        return 'hover:scale-105 active:scale-95 transition-transform duration-200';
      case 'glow':
        return 'hover:brightness-110 hover:shadow-md transition-all duration-200';
      case 'scale':
        return 'hover:scale-[1.02] transition-transform duration-200';
      case 'shimmer':
        return 'relative overflow-hidden hover:opacity-95 transition-all duration-200';
      case 'darken':
        return 'hover:brightness-90 transition-all duration-200';
      case 'underline':
        return 'hover:underline transition-all duration-200';
      default:
        return 'transition-all duration-200 hover:-translate-y-0.5';
    }
  };

  const { bgStyle, buttonStyle, cardStyle } = getThemeStyles(theme);

  const getButtonStyle = (item: LinkItem) => {
    return {
      ...buttonStyle,
      fontFamily: theme.fontFamily || 'Inter',
      ...cardStyle,
    };
  };

  const backgroundStyle = bgStyle;

  const layout = user.headerLayout || 'classic';

  // Extract decorative background patterns
  const renderStickerPatterns = () => {
    if (theme.stickerPack === 'geometric') {
      return (
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute top-12 left-10 w-28 h-28 border-2 border-slate-900 rotate-12 rounded-2xl" />
          <div className="absolute bottom-32 right-12 w-36 h-36 border-2 border-slate-900 rotate-45" />
          <div className="absolute top-1/3 left-16 w-16 h-16 rounded-full border-2 border-slate-900" />
          <div className="absolute top-2/3 right-1/4 w-12 h-12 border-2 border-slate-900 rotate-12" />
        </div>
      );
    }
    if (theme.stickerPack === 'minimal-dots') {
      return (
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden select-none z-0" 
             style={{ backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)', backgroundSize: '20px 24px' }} />
      );
    }
    if (theme.stickerPack === 'subtle-lines') {
      return (
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden select-none z-0"
             style={{ backgroundImage: 'linear-gradient(45deg, #000000 25%, transparent 25%), linear-gradient(-45deg, #000000 25%, transparent 25%)', backgroundSize: '30px 30px' }} />
      );
    }
    return null;
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden"
      style={{ ...backgroundStyle, fontFamily: theme.bodyFont || theme.fontFamily }}
    >
      {/* Background Stickers */}
      {renderStickerPatterns()}

      {/* Inner Centered Container */}
      <div className="w-full max-w-[520px] mx-auto px-4 sm:px-6 flex flex-col items-center flex-1 justify-between relative z-10">
        {/* Top Floating Utility Bar */}
        <div className="w-full flex items-center justify-between gap-3 mb-6">
          {onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          ) : (
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>LinkVM</span>
            </button>
          )}

          <button
            onClick={() => setShareOpen(true)}
            className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 hover:text-indigo-600 hover:bg-white transition-all shadow-xs cursor-pointer"
            title="Share profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content container */}
        <main className="w-full flex flex-col items-center space-y-6">
          {/* Cover Media (Video or Image Header) */}
          {user.coverVideoUrl ? (
            <div className="w-full h-36 rounded-3xl overflow-hidden relative shadow-sm border border-white/20 bg-slate-950">
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
            <div className="w-full h-36 rounded-3xl overflow-hidden relative shadow-sm border border-white/20 bg-slate-100">
              <img src={user.coverImageUrl} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ) : null}

          {/* Profile Card / Header Presets */}
          <div className="w-full flex flex-col items-center text-center space-y-3">
            {/* Layout Variant: Banner */}
            {layout === 'banner' && (
              <div className="w-full h-24 rounded-3xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-800 shadow-sm relative mb-6">
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-black text-2xl flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name || user.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span>{user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Standard Avatar (Classic, Hero, Cutout, Shape) */}
            {layout !== 'banner' && (
              <div
                className={`${
                  layout === 'hero'
                    ? 'w-28 h-28 ring-4 ring-white/80'
                    : layout === 'cutout'
                    ? 'w-24 h-24 rounded-3xl ring-2 ring-indigo-500/50'
                    : layout === 'shape'
                    ? 'w-24 h-24 rounded-3xl'
                    : 'w-24 h-24 rounded-full'
                } bg-slate-900 text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-white/60 shrink-0 overflow-hidden`}
              >
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
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5">
                <h1
                  className="text-xl sm:text-2xl font-black tracking-tight"
                  style={{
                    color: theme.headingColor || theme.textColor,
                    fontFamily: user.altTitleFont ? 'Space Grotesk' : theme.headingFont || theme.fontFamily,
                  }}
                >
                  {user.name || user.username}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-slate-900 fill-slate-900 text-white" />
              </div>

              {user.bio ? (
                <p
                  className="text-xs sm:text-sm max-w-sm leading-relaxed opacity-90 px-3 font-semibold"
                  style={{ color: theme.textColor }}
                >
                  {user.bio}
                </p>
              ) : (
                <p className="text-xs opacity-60 font-semibold" style={{ color: theme.textColor }}>
                  @{user.username}
                </p>
              )}

              {/* Image Gallery Horizontal Strip */}
              {user.galleryUrls && user.galleryUrls.length > 0 && (
                <div className="w-full pt-4 max-w-sm mx-auto">
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2 px-1 justify-center no-scrollbar">
                    {user.galleryUrls.map((gUrl, idx) => (
                      <img
                        key={idx}
                        src={gUrl}
                        alt={`Gallery ${idx}`}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Real-time styled Social Icons Row */}
            <SocialIconsRow socials={socials} theme={theme} />
          </div>

          {/* Links Stack with updated card styles */}
          <div className="w-full space-y-3">
            {visibleLinks.length === 0 ? (
              <div className="p-8 text-center text-xs opacity-60 bg-white/50 rounded-2xl border border-slate-200/40" style={{ color: theme.textColor }}>
                No active links available.
              </div>
            ) : (
              visibleLinks.map((link) => {
                const IconComponent = getIconComponent(link.icon);

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.openInNew ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link)}
                    className={`w-full px-5 py-3.5 text-sm font-bold flex items-center justify-between gap-3 ${getButtonShapeClass(
                      theme.buttonShape
                    )} ${getButtonHoverClass(theme.buttonHover)} ${
                      link.animation === 'pulse'
                        ? 'animate-pulse'
                        : link.animation === 'bounce'
                        ? 'animate-bounce'
                        : ''
                    } ${link.highlighted ? 'ring-2 ring-amber-400 shadow-md' : ''}`}
                    style={getButtonStyle(link)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <IconComponent className="w-5 h-5 shrink-0" style={{ color: getButtonStyle(link).color }} />
                      <span className="truncate">{link.title}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-70 shrink-0" style={{ color: getButtonStyle(link).color }} />
                  </a>
                );
              })
            )}
          </div>
        </main>

        {/* Footer Branding */}
        <footer className="w-full max-w-md pt-12 pb-4 text-center flex flex-col items-center gap-1.5">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200/80 text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer"
          >
            <span className="text-slate-900">Made with LinkVM</span>
            <span>•</span>
            <span className="text-slate-500 font-bold">{BRAND.badge}</span>
          </a>
          <div className="text-[10px] font-bold text-slate-400 select-none">
            Created by AiMAEditz
          </div>
        </footer>

        {/* Share Modal */}
        <ShareMenu
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          username={user.username}
          name={user.name}
        />
      </div>
    </div>
  );
};
