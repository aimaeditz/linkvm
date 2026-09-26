import { getSiteUrl } from './site';

export const BRAND = {
  name: 'LinkVM',
  tagline: 'All your links. One unified page.',
  mission: 'Consolidate your social media, portfolio, and digital content into one lightning-fast, beautifully designed page. Every feature unlocked. 100% Free Forever.',
  get domain() {
    return getSiteUrl().replace(/^https?:\/\//, '');
  },
  get appUrl() {
    return getSiteUrl();
  },
  supportEmail: 'support@linkvm.online',
  credit: 'Created by AiMAEditz',
  badge: '100% Free Forever',
  planLabel: 'Free Forever Plan',
};

export const BUILD_PUBLIC_URL = (username: string): string => {
  if (!username) return getSiteUrl();
  const clean = username.replace(/^@/, '');
  return `${getSiteUrl()}/${clean}`;
};

export const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', prefix: 'https://instagram.com/' },
  { id: 'youtube', label: 'YouTube', prefix: 'https://youtube.com/@' },
  { id: 'twitter', label: 'X (Twitter)', prefix: 'https://x.com/' },
  { id: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
  { id: 'github', label: 'GitHub', prefix: 'https://github.com/' },
  { id: 'tiktok', label: 'TikTok', prefix: 'https://tiktok.com/@' },
  { id: 'whatsapp', label: 'WhatsApp', prefix: 'https://wa.me/' },
  { id: 'telegram', label: 'Telegram', prefix: 'https://t.me/' },
  { id: 'discord', label: 'Discord', prefix: 'https://discord.gg/' },
  { id: 'twitch', label: 'Twitch', prefix: 'https://twitch.tv/' },
  { id: 'spotify', label: 'Spotify', prefix: 'https://open.spotify.com/artist/' },
  { id: 'email', label: 'Email', prefix: 'mailto:' },
  { id: 'website', label: 'Personal Website', prefix: 'https://' },
] as const;

export const FONTS = [
  'Inter',
  'Plus Jakarta Sans',
  'Outfit',
  'DM Sans',
  'Space Grotesk',
  'Syne',
  'Poppins',
  'Playfair Display',
  'Manrope',
  'Sora',
  'Instrument Serif',
  'Bricolage Grotesque'
] as const;

export const SIZES = [14, 15, 16, 17, 18, 19, 20] as const;
export const WEIGHTS = ['normal', 'medium', 'semibold', 'bold'] as const;
export const LETTER_SPACINGS = ['tight', 'normal', 'wide'] as const;
export const STICKER_PACKS = ['none', 'geometric', 'minimal-dots', 'subtle-lines'] as const;

export const WHY_FREE_FEATURES = [
  {
    title: 'Unlimited Links & Content',
    description: 'Add unlimited bio links, social profiles, embeds, and custom animations without limits.',
    icon: 'Link2',
  },
  {
    title: '48 Free Themes & Presets',
    description: 'Every curated theme unlocked with comprehensive color, font, shape, and hover styling.',
    icon: 'Palette',
  },
  {
    title: 'Real-Time Analytics Suite',
    description: 'Track views, clicks, referrer breakdown, device distribution, and export data anytime.',
    icon: 'BarChart3',
  },
  {
    title: 'Vector QR Code Suite',
    description: 'Generate high-resolution custom vector SVG and crisp PNG QR codes instantly.',
    icon: 'QrCode',
  },
  {
    title: '5 Header Layouts',
    description: 'Choose between Classic, Hero, Banner, Cutout, and Shape headers with live previews.',
    icon: 'LayoutTemplate',
  },
  {
    title: 'Verified Creator Badge',
    description: 'Every creator gets an official verified badge to establish audience trust.',
    icon: 'CheckCircle2',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Is LinkVM really 100% free forever?',
    answer: 'Yes, absolutely. Every feature—unlimited links, all 48 themes, full analytics suite, and vector QR code generator—is unlocked forever for all creators with zero fees.',
  },
  {
    question: 'Are there any hidden costs or paywalls?',
    answer: 'None whatsoever. There are no surprise paywalls, monthly subscription charges, credit card requirements, or artificial restrictions.',
  },
  {
    question: 'How do I claim my unique LinkVM handle?',
    answer: 'Simply sign up or visit your Settings to claim your personal username. Your page will be instantly live at linkvm.online/{username}.',
  },
  {
    question: 'How does the auto-save functionality work?',
    answer: 'Every change to your links, profile details, or theme options debounces automatically (800ms) and saves in real-time with an instant status indicator.',
  },
  {
    question: 'Can I customize my page themes and button shapes?',
    answer: 'Yes! Choose from 48 crafted theme presets or customize backgrounds, button borders, radius, shadows, text styles, and font pairings.',
  },
  {
    question: 'Is my data secure and private?',
    answer: 'LinkVM protects your privacy. Analytics are collected without invasive trackers, and you can export or delete your account anytime.',
  },
];

export function getThemeStyles(theme: any) {
  if (!theme) return { bgStyle: {}, buttonStyle: {}, cardStyle: {} };
  
  const signature = theme.signature || 'flat';
  
  // Background style
  let bgStyle: React.CSSProperties = {};
  if (theme.bgType === 'gradient' || signature === 'gradient') {
    const angle = theme.bgGradientAngle || '135deg';
    const cleanAngle = angle.includes('deg') ? angle : (angle === 'to-b' ? '180deg' : angle === 'to-br' ? '135deg' : angle === 'to-tr' ? '45deg' : '135deg');
    const from = theme.bgGradientFrom || theme.bgColor || '#ffffff';
    const to = theme.bgGradientTo || theme.bgColor || '#ffffff';
    bgStyle = {
      background: `linear-gradient(${cleanAngle}, ${from}, ${to})`,
    };
  } else if (signature === 'dark') {
    bgStyle = {
      backgroundColor: theme.bgColor || '#0B1220',
    };
  } else {
    bgStyle = {
      backgroundColor: theme.bgColor || '#FFFFFF',
    };
  }

  // Button styles
  let buttonStyle: React.CSSProperties = {};
  
  const btnColor = theme.buttonColor || '#000000';
  const btnTextColor = theme.buttonTextColor || '#ffffff';
  const btnBorderColor = theme.buttonBorderColor || theme.buttonColor || '#000000';
  
  buttonStyle.color = btnTextColor;
  
  if (theme.buttonStyle === 'solid') {
    buttonStyle.backgroundColor = btnColor;
    buttonStyle.borderColor = btnBorderColor;
    buttonStyle.borderWidth = '1px';
    buttonStyle.borderStyle = 'solid';
  } else if (theme.buttonStyle === 'bordered' || theme.buttonStyle === 'outline') {
    buttonStyle.backgroundColor = 'transparent';
    buttonStyle.borderColor = btnBorderColor;
    buttonStyle.borderWidth = '2px';
    buttonStyle.borderStyle = 'solid';
  } else if (theme.buttonStyle === 'soft') {
    buttonStyle.backgroundColor = `${btnColor}1A`; // 10% opacity
    buttonStyle.borderColor = 'transparent';
    buttonStyle.borderWidth = '1px';
    buttonStyle.borderStyle = 'solid';
  } else if (theme.buttonStyle === 'gradient') {
    buttonStyle.background = `linear-gradient(135deg, ${btnColor}, ${btnColor}dd)`;
    buttonStyle.borderColor = 'transparent';
    buttonStyle.borderWidth = '1px';
    buttonStyle.borderStyle = 'solid';
  } else if (theme.buttonStyle === 'glass') {
    buttonStyle.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    buttonStyle.backdropFilter = 'blur(16px)';
    buttonStyle.WebkitBackdropFilter = 'blur(16px)';
    buttonStyle.borderColor = 'rgba(255, 255, 255, 0.25)';
    buttonStyle.borderWidth = '1px';
    buttonStyle.borderStyle = 'solid';
    buttonStyle.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 15px rgba(0, 0, 0, 0.05)';
    buttonStyle.color = theme.textColor || '#000000';
  } else if (theme.buttonStyle === 'shadow') {
    buttonStyle.backgroundColor = btnColor;
    buttonStyle.borderColor = btnBorderColor || '#000000';
    buttonStyle.borderWidth = '2px';
    buttonStyle.borderStyle = 'solid';
    buttonStyle.boxShadow = `6px 6px 0px 0px ${btnBorderColor || '#000000'}`;
  } else if (theme.buttonStyle === 'glow') {
    buttonStyle.backgroundColor = btnColor;
    buttonStyle.borderColor = btnBorderColor;
    buttonStyle.borderWidth = '1px';
    buttonStyle.borderStyle = 'solid';
    buttonStyle.boxShadow = `0 0 15px ${btnColor}88, 0 0 30px ${btnColor}44`;
  }

  // Signature Adjustments
  if (signature === '3d') {
    buttonStyle.backgroundColor = btnColor;
    buttonStyle.borderColor = btnBorderColor || '#000000';
    buttonStyle.borderWidth = '2px';
    buttonStyle.borderStyle = 'solid';
    buttonStyle.boxShadow = `6px 6px 0px 0px ${btnBorderColor || '#000000'}`;
  } else if (signature === 'glow') {
    buttonStyle.backgroundColor = btnColor;
    buttonStyle.borderColor = btnBorderColor;
    buttonStyle.borderWidth = '1px';
    buttonStyle.borderStyle = 'solid';
    buttonStyle.boxShadow = `0 0 15px ${btnColor}88, 0 0 30px ${btnColor}44`;
  } else if (signature === 'glass') {
    buttonStyle.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    buttonStyle.backdropFilter = 'blur(16px)';
    buttonStyle.WebkitBackdropFilter = 'blur(16px)';
    buttonStyle.borderColor = 'rgba(255, 255, 255, 0.25)';
    buttonStyle.borderWidth = '1px';
    buttonStyle.borderStyle = 'solid';
    buttonStyle.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 15px rgba(0, 0, 0, 0.05)';
    buttonStyle.color = theme.textColor || '#000000';
  } else if (signature === 'metallic') {
    // Silver or gold metallic
    const baseMetal = btnColor === '#000000' || btnColor === '#FFFFFF' ? '#E5E7EB' : btnColor;
    buttonStyle.background = `linear-gradient(110deg, ${baseMetal} 0%, #FFFFFF 50%, ${baseMetal} 100%)`;
    buttonStyle.color = theme.buttonTextColor || theme.textColor || '#000000';
    buttonStyle.borderColor = btnBorderColor;
    buttonStyle.borderWidth = '1px';
    buttonStyle.borderStyle = 'solid';
    buttonStyle.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 10px rgba(0, 0, 0, 0.08)';
  }

  // Custom typography properties
  if (theme.fontWeight === 'normal') buttonStyle.fontWeight = 400;
  else if (theme.fontWeight === 'medium') buttonStyle.fontWeight = 500;
  else if (theme.fontWeight === 'semibold') buttonStyle.fontWeight = 600;
  else if (theme.fontWeight === 'bold') buttonStyle.fontWeight = 700;

  if (theme.letterSpacing === 'tight') buttonStyle.letterSpacing = '-0.025em';
  else if (theme.letterSpacing === 'normal') buttonStyle.letterSpacing = 'normal';
  else if (theme.letterSpacing === 'wide') buttonStyle.letterSpacing = '0.05em';

  if (theme.baseSize) buttonStyle.fontSize = `${theme.baseSize}px`;

  // Card styles
  let cardStyle: React.CSSProperties = {};
  if (theme.cardStyle === 'elevated') {
    cardStyle.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)';
    cardStyle.borderWidth = '1px';
    cardStyle.borderColor = 'rgba(0, 0, 0, 0.05)';
  } else if (theme.cardStyle === 'glass' || signature === 'glass') {
    cardStyle.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    cardStyle.backdropFilter = 'blur(16px)';
    cardStyle.WebkitBackdropFilter = 'blur(16px)';
    cardStyle.borderColor = 'rgba(255, 255, 255, 0.25)';
    cardStyle.borderWidth = '1px';
    cardStyle.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 15px rgba(0, 0, 0, 0.05)';
  } else if (theme.cardStyle === '3d' || signature === '3d') {
    cardStyle.boxShadow = `6px 6px 0px 0px ${theme.textColor || '#000000'}`;
    cardStyle.borderWidth = '2px';
    cardStyle.borderColor = theme.textColor || '#000000';
  } else {
    cardStyle.borderWidth = '1px';
    cardStyle.borderColor = 'rgba(0, 0, 0, 0.06)';
  }

  return { bgStyle, buttonStyle, cardStyle };
}
