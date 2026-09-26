export interface User {
  id: string;
  email: string;
  name?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  coverVideoUrl?: string | null;
  coverVideoMuted?: boolean;
  coverVideoLoop?: boolean;
  galleryUrls?: string[];
  accentColor?: string | null;
  sharePattern?: string;
  invitesSent?: number;
  invitesAccepted?: number;
  referralCode?: string;
  headerLayout?: 'classic' | 'hero' | 'banner' | 'cutout' | 'shape';
  titleStyle?: 'text' | 'logo';
  titleFont?: string;
  altTitleFont?: boolean;
  googleSub?: string;
  googleEmail?: string;
  googleName?: string;
  googlePicture?: string;
  notifications?: {
    emailOnView?: boolean;
    emailOnClick?: boolean;
    weeklySummary?: boolean;
    securityAlerts?: boolean;
    marketingUpdates?: boolean;
  };
  privacy?: {
    hideBranding?: boolean;
    searchIndexing?: boolean;
    sensitiveContent?: boolean;
    hideViewCount?: boolean;
    anonymousAnalytics?: boolean;
  };
  hasSharedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LinkItem {
  id: string;
  userId: string;
  title: string;
  url: string;
  icon?: string | null;
  position: number;
  visible: boolean;
  clicks: number;
  openInNew: boolean;
  highlighted?: boolean;
  animation?: 'none' | 'pulse' | 'bounce' | 'glow';
  createdAt: string;
  updatedAt: string;
}

export type ButtonStyle = 'solid' | 'bordered' | 'outline' | 'soft' | 'glass' | 'gradient' | 'shadow' | 'glow';
export type ButtonShape = 'rounded-none' | 'rounded-md' | 'rounded-xl' | 'rounded-full' | 'rounded' | 'pill' | 'square' | 'sharp';
export type ButtonHover = 'scale' | 'lift' | 'glow' | 'bounce' | 'shimmer' | 'glass' | 'none' | 'darken' | 'underline';
export type CardStyle = 'card-white' | 'card-glass' | 'card-flat' | 'card-bordered' | 'minimal' | 'elevated' | 'glass' | '3d';
export type BgType = 'solid' | 'gradient' | 'mesh' | 'pattern';
export type StickerPack = 'none' | 'geometric' | 'minimal-dots' | 'subtle-lines';

export type FontFamily =
  | 'Inter'
  | 'Plus Jakarta Sans'
  | 'Outfit'
  | 'DM Sans'
  | 'Space Grotesk'
  | 'Syne'
  | 'Poppins'
  | 'Playfair Display'
  | 'Manrope'
  | 'Sora'
  | 'Instrument Serif'
  | 'Bricolage Grotesque';

export type ThemeCategory =
  | 'Minimal'
  | 'Warm'
  | 'Cool'
  | 'Gradient'
  | 'Bold'
  | 'Nature'
  | 'Dark'
  | 'Glass'
  | 'Glow'
  | '3D'
  | 'Metallic'
  | 'Curated';

export interface ThemeConfig {
  id: string;
  userId: string;
  presetId: string;
  category: ThemeCategory;
  customizable: boolean;
  tagline: string;
  badge: string;
  bgColor: string;
  bgGradientFrom?: string | null;
  bgGradientTo?: string | null;
  bgGradientAngle?: string | null;
  bgType: BgType;
  textColor: string;
  headingColor: string;
  linkHoverColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonBorderColor: string;
  buttonStyle: ButtonStyle;
  buttonShape: ButtonShape;
  buttonHover: ButtonHover;
  cardStyle: CardStyle;
  fontFamily: FontFamily;
  headingFont: string;
  bodyFont: string;
  baseSize: number;
  fontWeight: string;
  letterSpacing: string;
  stickerPack: StickerPack;
  socialIconSize?: string;
  socialIconShape?: string;
  socialIconFill?: string;
  socialIconColor?: string;
  socialIconBg?: string;
  socialIconBorder?: string;
  socialIconSpacing?: string;
  socialIconLayout?: string;
  socialIconAlign?: string;
  signature?: '3d' | 'glow' | 'glass' | 'dark' | 'gradient' | 'metallic' | 'flat';
  updatedAt: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  category: ThemeCategory;
  customizable: boolean;
  tagline: string;
  badge: string;
  bgColor: string;
  bgGradientFrom?: string;
  bgGradientTo?: string;
  bgGradientAngle?: string;
  bgType: BgType;
  textColor: string;
  headingColor: string;
  linkHoverColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonBorderColor: string;
  buttonStyle: ButtonStyle;
  buttonShape: ButtonShape;
  buttonHover: ButtonHover;
  cardStyle: CardStyle;
  fontFamily: FontFamily;
  headingFont: string;
  bodyFont: string;
  baseSize: number;
  fontWeight: string;
  letterSpacing: string;
  stickerPack: StickerPack;
  socialIconSize?: string;
  socialIconShape?: string;
  socialIconFill?: string;
  socialIconColor?: string;
  socialIconBg?: string;
  socialIconBorder?: string;
  socialIconSpacing?: string;
  socialIconLayout?: string;
  socialIconAlign?: string;
  signature?: '3d' | 'glow' | 'glass' | 'dark' | 'gradient' | 'metallic' | 'flat';
}

export interface SocialLinks {
  id: string;
  userId: string;
  instagram?: string | null;
  youtube?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  github?: string | null;
  tiktok?: string | null;
  whatsapp?: string | null;
  telegram?: string | null;
  discord?: string | null;
  twitch?: string | null;
  spotify?: string | null;
  email?: string | null;
  website?: string | null;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  linkId?: string | null;
  event: 'view' | 'click';
  device?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  clickRate: number;
  chartData: { date: string; views: number; clicks: number }[];
  topLinks: { id: string; title: string; url: string; clicks: number }[];
  devices: { name: string; count: number; percentage: number }[];
  referrers: { name: string; count: number; percentage: number }[];
  recentEvents: AnalyticsEvent[];
}
