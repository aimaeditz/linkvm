import React from 'react';
import { User, LinkItem, ThemeConfig, SocialLinks } from '../../types';
import { ExternalLink, CheckCircle2, ArrowLeft, Globe } from 'lucide-react';
import { getThemeStyles } from '../../lib/constants';
import { getIconComponent } from '../dashboard/IconPicker';
import { StorageService } from '../../lib/storage';

interface PublicProfilePageProps {
  user: User;
  links: LinkItem[];
  theme: ThemeConfig;
  socials: SocialLinks;
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
  const { bgStyle, buttonStyle } = getThemeStyles(theme);

  const handleLinkClick = (lnk: LinkItem) => {
    StorageService.trackEvent({
      userId: user.id,
      event: 'click',
      linkId: lnk.id,
    });
    if (lnk.openInNew) {
      window.open(lnk.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = lnk.url;
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500 selection:text-white"
      style={{
        ...bgStyle,
        color: theme.textColor || '#0F172A',
        fontFamily: theme.bodyFont || theme.fontFamily || 'Inter, sans-serif',
      }}
    >
      {/* Top Banner Navigation bar if logged in */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 mb-6">
        {onBackToDashboard ? (
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        ) : (
          <div />
        )}

        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md text-[11px] font-bold transition-all cursor-pointer"
          >
            <span>LinkVM</span>
          </button>
        )}
      </div>

      {/* Main Profile Card Container */}
      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        {/* Avatar Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-24 h-24 rounded-full border-4 border-white/40 shadow-lg overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-black shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name || user.username} className="w-full h-full object-cover" />
            ) : (
              (user.name || user.username || 'C').charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-xl font-extrabold tracking-tight">
                {user.name || 'Creator'}
              </h1>
              <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-500/20 shrink-0" />
            </div>
            <p className="text-xs font-semibold opacity-70">@{user.username}</p>
          </div>

          {user.bio && (
            <p className="text-xs max-w-xs leading-relaxed opacity-90 font-medium">
              {user.bio}
            </p>
          )}
        </div>

        {/* Links Stack */}
        <div className="w-full space-y-3 pt-2">
          {links
            .filter((l) => l.visible)
            .map((lnk) => {
              const IconComp = getIconComponent(lnk.icon);
              return (
                <button
                  key={lnk.id}
                  onClick={() => handleLinkClick(lnk)}
                  style={buttonStyle}
                  className="w-full py-3.5 px-5 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="truncate">{lnk.title}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 shrink-0" />
                </button>
              );
            })}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-12 pb-4 text-center">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigateHome) onNavigateHome();
            else window.location.href = '/';
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-extrabold opacity-80 hover:opacity-100 transition-opacity"
        >
          <span>Created with LinkVM</span>
        </a>
      </div>
    </div>
  );
};
