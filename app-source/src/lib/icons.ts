import React from 'react';
import {
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
  Calendar,
  FileText,
  ShoppingBag,
  Music,
  Video,
  Camera,
  BookOpen,
  Briefcase,
  Heart,
  Star,
  Coffee,
  MapPin,
  Send,
  MessageCircle,
  Twitch,
  Facebook,
  Radio,
  Share2,
  Bookmark,
  Sparkles,
  Link as LinkIcon,
  MessageSquare,
  Compass,
  Code,
  Laptop,
} from 'lucide-react';
import { SocialIcon } from '../components/shared/SocialIcon';

// Dedicated SVG components for platforms not in standard Lucide
export const TikTokIcon: React.FC<{ className?: string; size?: number | string }> = ({ className, size = 18 }) => (
  <SocialIcon platform="tiktok" size={typeof size === 'number' ? size : 18} className={className} />
);

export const SpotifyIcon: React.FC<{ className?: string; size?: number | string }> = ({ className, size = 18 }) => (
  <SocialIcon platform="spotify" size={typeof size === 'number' ? size : 18} className={className} />
);

export const DiscordIcon: React.FC<{ className?: string; size?: number | string }> = ({ className, size = 18 }) => (
  <SocialIcon platform="discord" size={typeof size === 'number' ? size : 18} className={className} />
);

export const WhatsAppIcon: React.FC<{ className?: string; size?: number | string }> = ({ className, size = 18 }) => (
  <SocialIcon platform="whatsapp" size={typeof size === 'number' ? size : 18} className={className} />
);

export const TelegramIcon: React.FC<{ className?: string; size?: number | string }> = ({ className, size = 18 }) => (
  <SocialIcon platform="telegram" size={typeof size === 'number' ? size : 18} className={className} />
);

export interface IconDefinition {
  id: string;
  name: string;
  category?: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
}

export const AVAILABLE_ICONS: IconDefinition[] = [
  { id: 'tiktok', name: 'TikTok', category: 'Social', icon: TikTokIcon },
  { id: 'youtube', name: 'YouTube', category: 'Media', icon: Youtube },
  { id: 'instagram', name: 'Instagram', category: 'Social', icon: Instagram },
  { id: 'spotify', name: 'Spotify', category: 'Media', icon: SpotifyIcon },
  { id: 'twitter', name: 'Twitter / X', category: 'Social', icon: Twitter },
  { id: 'linkedin', name: 'LinkedIn', category: 'Social', icon: Linkedin },
  { id: 'github', name: 'GitHub', category: 'Dev', icon: Github },
  { id: 'discord', name: 'Discord', category: 'Social', icon: DiscordIcon },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Contact', icon: WhatsAppIcon },
  { id: 'telegram', name: 'Telegram', category: 'Contact', icon: TelegramIcon },
  { id: 'twitch', name: 'Twitch', category: 'Media', icon: Twitch },
  { id: 'facebook', name: 'Facebook', category: 'Social', icon: Facebook },
  { id: 'globe', name: 'Website', category: 'General', icon: Globe },
  { id: 'mail', name: 'Email', category: 'Contact', icon: Mail },
  { id: 'phone', name: 'Phone', category: 'Contact', icon: Phone },
  { id: 'calendar', name: 'Calendar / Booking', category: 'General', icon: Calendar },
  { id: 'file-text', name: 'Resume / Document', category: 'Work', icon: FileText },
  { id: 'shopping-bag', name: 'Store / Shop', category: 'Commerce', icon: ShoppingBag },
  { id: 'music', name: 'Music', category: 'Media', icon: Music },
  { id: 'video', name: 'Video / Streams', category: 'Media', icon: Video },
  { id: 'camera', name: 'Photography', category: 'Media', icon: Camera },
  { id: 'book-open', name: 'Blog / Substack', category: 'General', icon: BookOpen },
  { id: 'briefcase', name: 'Portfolio / Work', category: 'Work', icon: Briefcase },
  { id: 'heart', name: 'Support / Charity', category: 'General', icon: Heart },
  { id: 'star', name: 'Featured / Best', category: 'General', icon: Star },
  { id: 'coffee', name: 'Buy Me a Coffee', category: 'Commerce', icon: Coffee },
  { id: 'map-pin', name: 'Location / Studio', category: 'General', icon: MapPin },
  { id: 'send', name: 'Send / DM', category: 'Contact', icon: Send },
  { id: 'message-circle', name: 'Chat', category: 'Contact', icon: MessageCircle },
  { id: 'radio', name: 'Podcast', category: 'Media', icon: Radio },
  { id: 'share-2', name: 'Community', category: 'General', icon: Share2 },
  { id: 'bookmark', name: 'Newsletter', category: 'General', icon: Bookmark },
  { id: 'sparkles', name: 'Special Project', category: 'General', icon: Sparkles },
  { id: 'link', name: 'General Link', category: 'General', icon: LinkIcon },
  { id: 'message-square', name: 'Messages', category: 'Contact', icon: MessageSquare },
  { id: 'compass', name: 'Explore', category: 'General', icon: Compass },
  { id: 'code', name: 'Developer Tool', category: 'Dev', icon: Code },
  { id: 'laptop', name: 'SaaS App', category: 'Dev', icon: Laptop },
];

/**
 * Auto-detects platform icon name from any destination URL.
 * Supports TikTok, YouTube, Instagram, Twitter/X, Spotify, Discord, GitHub, LinkedIn, etc.
 */
export function detectPlatformIcon(url: string): string | null {
  if (!url) return null;
  const clean = url.trim().toLowerCase();

  if (/(www\.)?tiktok\.com/i.test(clean)) return 'tiktok';
  if (/(www\.)?(youtube\.com|youtu\.be)/i.test(clean)) return 'youtube';
  if (/(www\.)?instagram\.com/i.test(clean)) return 'instagram';
  if (/open\.spotify\.com|spotify:/i.test(clean)) return 'spotify';
  if (/(www\.)?(twitter\.com|x\.com)/i.test(clean)) return 'twitter';
  if (/(www\.)?linkedin\.com/i.test(clean)) return 'linkedin';
  if (/(www\.)?github\.com/i.test(clean)) return 'github';
  if (/(discord\.gg|discord\.com)/i.test(clean)) return 'discord';
  if (/(wa\.me|whatsapp\.com)/i.test(clean)) return 'whatsapp';
  if (/(t\.me|telegram\.me)/i.test(clean)) return 'telegram';
  if (/(www\.)?twitch\.tv/i.test(clean)) return 'twitch';
  if (/(www\.)?(facebook\.com|fb\.me)/i.test(clean)) return 'facebook';
  if (/^mailto:/i.test(clean) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return 'mail';
  if (/^tel:/i.test(clean)) return 'phone';
  if (/(buymeacoffee\.com|ko-fi\.com)/i.test(clean)) return 'coffee';
  if (/(substack\.com|medium\.com)/i.test(clean)) return 'book-open';
  if (/(calendly\.com|cal\.com)/i.test(clean)) return 'calendar';

  return null;
}

export function getIconComponent(
  id?: string | null,
  urlFallback?: string
): React.ComponentType<{ className?: string; size?: number | string }> {
  // 1. If explicit specific icon is given (not generic globe/link)
  if (id && id.toLowerCase() !== 'globe' && id.toLowerCase() !== 'link') {
    const match = AVAILABLE_ICONS.find((item) => item.id.toLowerCase() === id.toLowerCase() || item.name.toLowerCase() === id.toLowerCase());
    if (match) return match.icon;
  }

  // 2. If URL fallback is provided, auto-detect platform
  if (urlFallback) {
    const detected = detectPlatformIcon(urlFallback);
    if (detected) {
      const match = AVAILABLE_ICONS.find((item) => item.id === detected);
      if (match) return match.icon;
    }
  }

  // 3. Fallback to matched id if it was globe or link
  if (id) {
    const match = AVAILABLE_ICONS.find((item) => item.id.toLowerCase() === id.toLowerCase() || item.name.toLowerCase() === id.toLowerCase());
    if (match) return match.icon;
  }

  return Globe;
}
