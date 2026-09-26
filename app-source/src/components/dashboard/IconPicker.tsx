import React, { useState } from 'react';
import {
  Globe,
  Link as LinkIcon,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Twitch,
  Facebook,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Music,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  CreditCard,
  Briefcase,
  Folder,
  Code,
  Terminal,
  Cpu,
  Bookmark,
  Heart,
  Star,
  Sparkles,
  Camera,
  Video,
  Play,
  FileText,
  Book,
  Compass,
  MapPin,
  Calendar,
  Clock,
  Award,
  Zap,
  Flame,
  Coffee,
  Gift,
  HelpCircle,
  Share2,
  Download,
  Upload,
  Search,
  Check,
  X,
  Layers,
  Layout,
  Radio,
  Headphones,
  Podcast,
  Sliders,
  Smile,
  Shield,
  Tag,
  Key,
  Database,
  Cloud,
  Server,
  Monitor,
  Smartphone,
  Rss,
  MessageCircle,
} from 'lucide-react';

// Specialized SVG Icon components for platforms that require exact branding
export const TikTokIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-4 h-4', style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const DiscordIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-4 h-4', style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M18 6a10.42 10.42 0 0 0-4-1l-.48 1H10.48L10 5a10.42 10.42 0 0 0-4 1C3.33 10.22 3 14.78 4.22 18a11.11 11.11 0 0 0 4.24 2l1-1.53a7.43 7.43 0 0 1-2.22-1.12l.14-.11C9.62 18.1 11.81 19 12 19s2.38-.9 4.62-1.76l.14.11a7.43 7.43 0 0 1-2.22 1.12l1 1.53a11.11 11.11 0 0 0 4.24-2c1.22-3.22.89-7.78-1.78-12z" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const SpotifyIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-4 h-4', style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 10.5a12.3 12.3 0 0 1 8 0" />
    <path d="M9 13.2a9.3 9.3 0 0 1 6 0" />
    <path d="M9.5 15.8a6.3 6.3 0 0 1 5 0" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-4 h-4', style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const TelegramIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-4 h-4', style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const ThreadsIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-4 h-4', style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M19 12c0 4.5-3.5 8-8 8s-8-3.5-8-8 3.5-8 8-8 7.5 3 7.8 7.2" />
    <path d="M14.5 10.5c-.8-1-2.1-1.5-3.5-1.5-2.2 0-4 1.8-4 4s1.8 4 4 4c2.8 0 4-1.8 4-4v-1" />
  </svg>
);

export const RedditIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-4 h-4', style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="13.5" r="6.5" />
    <circle cx="9.5" cy="13" r="1" fill="currentColor" />
    <circle cx="14.5" cy="13" r="1" fill="currentColor" />
    <path d="M10 16c.8.6 1.8.8 2 .8s1.2-.2 2-.8" />
    <circle cx="4.5" cy="12" r="2" />
    <circle cx="19.5" cy="12" r="2" />
    <path d="M14 7l2-3 3 1" />
  </svg>
);

export const PinterestIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-4 h-4', style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 19.5c.5-1.8 1.4-5 1.4-5s-.3-.7-.3-1.8c0-1.7 1-3 2.2-3 .9 0 1.4.7 1.4 1.5 0 1-.6 2.3-.9 3.5-.3 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2.1-1.4-3.7-4-3.7-2.9 0-4.6 2.2-4.6 4.5 0 .8.3 1.7.7 2.2.1.1.1.2 0 .4l-.3 1.1c-.1.2-.2.3-.4.2-1.5-.7-2.2-2.5-2.2-4.1 0-3.3 2.8-7.3 8.4-7.3 4.5 0 7.5 3.3 7.5 6.8 0 4.6-2.6 8.1-6.4 8.1-1.3 0-2.5-.7-2.9-1.5l-.8 3.1c-.3 1.1-.9 2.2-1.4 3.1" />
  </svg>
);

export const ICONS_LIST = [
  // Platform & Social
  { name: 'TikTok', icon: TikTokIcon, category: 'Social' },
  { name: 'Youtube', icon: Youtube, category: 'Media' },
  { name: 'Instagram', icon: Instagram, category: 'Social' },
  { name: 'Twitter', icon: Twitter, category: 'Social' },
  { name: 'Spotify', icon: SpotifyIcon, category: 'Media' },
  { name: 'Discord', icon: DiscordIcon, category: 'Social' },
  { name: 'Github', icon: Github, category: 'Dev' },
  { name: 'Linkedin', icon: Linkedin, category: 'Work' },
  { name: 'Twitch', icon: Twitch, category: 'Media' },
  { name: 'Facebook', icon: Facebook, category: 'Social' },
  { name: 'WhatsApp', icon: WhatsAppIcon, category: 'Contact' },
  { name: 'Telegram', icon: TelegramIcon, category: 'Contact' },
  { name: 'Threads', icon: ThreadsIcon, category: 'Social' },
  { name: 'Reddit', icon: RedditIcon, category: 'Social' },
  { name: 'Pinterest', icon: PinterestIcon, category: 'Social' },

  // General & Web
  { name: 'Globe', icon: Globe, category: 'General' },
  { name: 'Link', icon: LinkIcon, category: 'General' },
  { name: 'Mail', icon: Mail, category: 'Contact' },
  { name: 'Phone', icon: Phone, category: 'Contact' },
  { name: 'MessageSquare', icon: MessageSquare, category: 'Contact' },
  { name: 'Send', icon: Send, category: 'Contact' },

  // Media
  { name: 'Music', icon: Music, category: 'Media' },
  { name: 'Headphones', icon: Headphones, category: 'Media' },
  { name: 'Podcast', icon: Podcast, category: 'Media' },
  { name: 'Play', icon: Play, category: 'Media' },
  { name: 'Video', icon: Video, category: 'Media' },
  { name: 'Camera', icon: Camera, category: 'Media' },
  { name: 'Radio', icon: Radio, category: 'Media' },

  // Commerce & Support
  { name: 'ShoppingBag', icon: ShoppingBag, category: 'Commerce' },
  { name: 'ShoppingCart', icon: ShoppingCart, category: 'Commerce' },
  { name: 'DollarSign', icon: DollarSign, category: 'Commerce' },
  { name: 'CreditCard', icon: CreditCard, category: 'Commerce' },
  { name: 'Gift', icon: Gift, category: 'Commerce' },
  { name: 'Coffee', icon: Coffee, category: 'Commerce' },
  { name: 'Heart', icon: Heart, category: 'General' },

  // Work & Dev
  { name: 'Briefcase', icon: Briefcase, category: 'Work' },
  { name: 'Folder', icon: Folder, category: 'Work' },
  { name: 'Code', icon: Code, category: 'Dev' },
  { name: 'Terminal', icon: Terminal, category: 'Dev' },
  { name: 'Cpu', icon: Cpu, category: 'Dev' },
  { name: 'Database', icon: Database, category: 'Dev' },
  { name: 'Cloud', icon: Cloud, category: 'Dev' },
  { name: 'Server', icon: Server, category: 'Dev' },
  { name: 'Monitor', icon: Monitor, category: 'Tech' },
  { name: 'Smartphone', icon: Smartphone, category: 'Tech' },

  // General & Utility
  { name: 'FileText', icon: FileText, category: 'General' },
  { name: 'Book', icon: Book, category: 'General' },
  { name: 'Bookmark', icon: Bookmark, category: 'General' },
  { name: 'Star', icon: Star, category: 'General' },
  { name: 'Sparkles', icon: Sparkles, category: 'General' },
  { name: 'Zap', icon: Zap, category: 'General' },
  { name: 'Flame', icon: Flame, category: 'General' },
  { name: 'Award', icon: Award, category: 'General' },
  { name: 'Compass', icon: Compass, category: 'General' },
  { name: 'MapPin', icon: MapPin, category: 'General' },
  { name: 'Calendar', icon: Calendar, category: 'General' },
  { name: 'Clock', icon: Clock, category: 'General' },
  { name: 'Share2', icon: Share2, category: 'General' },
  { name: 'Download', icon: Download, category: 'General' },
  { name: 'Upload', icon: Upload, category: 'General' },
  { name: 'Shield', icon: Shield, category: 'General' },
  { name: 'Tag', icon: Tag, category: 'General' },
  { name: 'Key', icon: Key, category: 'General' },
  { name: 'Layers', icon: Layers, category: 'General' },
  { name: 'Layout', icon: Layout, category: 'General' },
  { name: 'Sliders', icon: Sliders, category: 'General' },
  { name: 'Smile', icon: Smile, category: 'General' },
  { name: 'HelpCircle', icon: HelpCircle, category: 'General' },
  { name: 'Rss', icon: Rss, category: 'General' },
];

export const getIconComponent = (
  name?: string | null,
  url?: string | null
): React.ComponentType<{ className?: string; style?: React.CSSProperties }> => {
  let resolvedName = name;
  if (!resolvedName && url) {
    const detected = detectPlatformFromUrl(url);
    if (detected) {
      resolvedName = detected.icon;
    }
  }

  if (!resolvedName) return Globe;
  const normalized = resolvedName.trim().toLowerCase();

  // Aliases for common platforms and casing
  if (normalized === 'tiktok') return TikTokIcon;
  if (normalized === 'youtube' || normalized === 'youtu.be') return Youtube;
  if (normalized === 'spotify') return SpotifyIcon;
  if (normalized === 'discord') return DiscordIcon;
  if (normalized === 'whatsapp') return WhatsAppIcon;
  if (normalized === 'telegram') return TelegramIcon;
  if (normalized === 'threads') return ThreadsIcon;
  if (normalized === 'reddit') return RedditIcon;
  if (normalized === 'pinterest') return PinterestIcon;
  if (normalized === 'instagram') return Instagram;
  if (normalized === 'twitter' || normalized === 'x') return Twitter;
  if (normalized === 'github') return Github;
  if (normalized === 'linkedin') return Linkedin;
  if (normalized === 'twitch') return Twitch;
  if (normalized === 'facebook') return Facebook;
  if (normalized === 'mail' || normalized === 'email') return Mail;

  const found = ICONS_LIST.find((i) => i.name.toLowerCase() === normalized);
  return found ? found.icon : Globe;
};

// URL Auto-Detection Helper
export function detectPlatformFromUrl(url: string): { icon: string; platformName: string } | null {
  const trimmed = url.trim().toLowerCase();
  if (!trimmed) return null;

  if (trimmed.includes('tiktok.com')) return { icon: 'TikTok', platformName: 'TikTok' };
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) return { icon: 'Youtube', platformName: 'YouTube' };
  if (trimmed.includes('spotify.com')) return { icon: 'Spotify', platformName: 'Spotify' };
  if (trimmed.includes('instagram.com')) return { icon: 'Instagram', platformName: 'Instagram' };
  if (trimmed.includes('twitter.com') || trimmed.includes('x.com')) return { icon: 'Twitter', platformName: 'X (Twitter)' };
  if (trimmed.includes('discord.gg') || trimmed.includes('discord.com')) return { icon: 'Discord', platformName: 'Discord' };
  if (trimmed.includes('github.com')) return { icon: 'Github', platformName: 'GitHub' };
  if (trimmed.includes('linkedin.com')) return { icon: 'Linkedin', platformName: 'LinkedIn' };
  if (trimmed.includes('twitch.tv')) return { icon: 'Twitch', platformName: 'Twitch' };
  if (trimmed.includes('facebook.com') || trimmed.includes('fb.me')) return { icon: 'Facebook', platformName: 'Facebook' };
  if (trimmed.includes('threads.net')) return { icon: 'Threads', platformName: 'Threads' };
  if (trimmed.includes('reddit.com')) return { icon: 'Reddit', platformName: 'Reddit' };
  if (trimmed.includes('pinterest.com')) return { icon: 'Pinterest', platformName: 'Pinterest' };
  if (trimmed.includes('wa.me') || trimmed.includes('whatsapp.com')) return { icon: 'WhatsApp', platformName: 'WhatsApp' };
  if (trimmed.includes('t.me') || trimmed.includes('telegram.me')) return { icon: 'Telegram', platformName: 'Telegram' };
  if (trimmed.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { icon: 'Mail', platformName: 'Email' };
  if (trimmed.startsWith('tel:')) return { icon: 'Phone', platformName: 'Phone' };

  return null;
}

interface IconPickerProps {
  selectedIcon?: string | null;
  onSelectIcon: (iconName: string) => void;
  onClose?: () => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Social', 'Media', 'Commerce', 'Dev', 'Contact', 'Work', 'General'];

  const filtered = ICONS_LIST.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-3 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 60+ icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500"
          />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedIcon?.toLowerCase() === item.name.toLowerCase();
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelectIcon(item.name)}
              title={item.name}
              className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
