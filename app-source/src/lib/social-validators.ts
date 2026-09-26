import { z } from 'zod';

export const SOCIAL_PATTERNS = {
  instagram: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._\-]+\/?(\?.*)?$/i,
  youtube: /^https?:\/\/(www\.)?(youtube\.com\/(c\/|channel\/|user\/|@)?[a-zA-Z0-9_\-]+|youtu\.be\/[a-zA-Z0-9_\-]+)(\/.*|\?.*)?$/i,
  twitter: /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[a-zA-Z0-9_]+\/?(\?.*)?$/i,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|company|school)\/[a-zA-Z0-9_\-]+\/?(\?.*)?$/i,
  github: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_\-]+\/?(\?.*)?$/i,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._\-]+\/?(\?.*)?$/i,
  whatsapp: /^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\/.+$/i,
  telegram: /^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z0-9_]+\/?(\?.*)?$/i,
  discord: /^https?:\/\/(discord\.gg\/[a-zA-Z0-9_\-]+|discord\.com\/invite\/[a-zA-Z0-9_\-]+)(\/.*|\?.*)?$/i,
  twitch: /^https?:\/\/(www\.)?twitch\.tv\/[a-zA-Z0-9_]+\/?(\?.*)?$/i,
  spotify: /^https?:\/\/open\.spotify\.com\/(artist|user|playlist|album|track|episode|show)\/[a-zA-Z0-9_\-]+(\/.*|\?.*)?$/i,
  email: /^(mailto:)?[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i,
  website: /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/i,
};

export const socialFieldNames = [
  'instagram',
  'youtube',
  'twitter',
  'linkedin',
  'github',
  'tiktok',
  'whatsapp',
  'telegram',
  'discord',
  'twitch',
  'spotify',
  'email',
  'website',
] as const;

export type SocialFieldName = typeof socialFieldNames[number];

export const platformDisplayNames: Record<SocialFieldName, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  discord: 'Discord',
  twitch: 'Twitch',
  spotify: 'Spotify',
  email: 'Email',
  website: 'Personal Website',
};

export const platformPlaceholders: Record<SocialFieldName, string> = {
  instagram: 'https://instagram.com/username',
  youtube: 'https://youtube.com/@username',
  twitter: 'https://x.com/username',
  linkedin: 'https://linkedin.com/in/username',
  github: 'https://github.com/username',
  tiktok: 'https://tiktok.com/@username',
  whatsapp: 'https://wa.me/1234567890',
  telegram: 'https://t.me/username',
  discord: 'https://discord.gg/invitecode',
  twitch: 'https://twitch.tv/username',
  spotify: 'https://open.spotify.com/artist/id',
  email: 'mailto:you@domain.com',
  website: 'https://yourwebsite.com',
};

export function detectPlatformFromUrl(url: string): SocialFieldName | null {
  const trimmed = url.trim().toLowerCase();
  if (/(www\.)?instagram\.com/i.test(trimmed)) return 'instagram';
  if (/(www\.)?(youtube\.com|youtu\.be)/i.test(trimmed)) return 'youtube';
  if (/(www\.)?(twitter\.com|x\.com)/i.test(trimmed)) return 'twitter';
  if (/(www\.)?linkedin\.com/i.test(trimmed)) return 'linkedin';
  if (/(www\.)?github\.com/i.test(trimmed)) return 'github';
  if (/(www\.)?tiktok\.com/i.test(trimmed)) return 'tiktok';
  if (/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)/i.test(trimmed)) return 'whatsapp';
  if (/(t\.me|telegram\.me)/i.test(trimmed)) return 'telegram';
  if (/(discord\.gg|discord\.com\/invite)/i.test(trimmed)) return 'discord';
  if (/(www\.)?twitch\.tv/i.test(trimmed)) return 'twitch';
  if (/open\.spotify\.com/i.test(trimmed)) return 'spotify';
  if (/^mailto:/i.test(trimmed) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'email';
  return null;
}

export function validateSocialLink(platform: SocialFieldName, url: string): { isValid: boolean; error?: string } {
  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: true }; // empty is allowed and simply hides the icon
  }

  const detectedPlatform = detectPlatformFromUrl(trimmed);
  const targetDisplayName = platformDisplayNames[platform];

  // Cross-platform URL rejection
  if (detectedPlatform && detectedPlatform !== platform) {
    const otherDisplayName = platformDisplayNames[detectedPlatform];
    if (platform === 'website') {
      return {
        isValid: false,
        error: `Cross-platform URL rejected: This is a ${otherDisplayName} link. Please use the dedicated ${otherDisplayName} field above or enter your website URL.`,
      };
    }
    return {
      isValid: false,
      error: `Cross-platform URL rejected: This is a ${otherDisplayName} link. Only ${targetDisplayName} URLs are accepted in this field.`,
    };
  }

  const pattern = SOCIAL_PATTERNS[platform];
  if (!pattern.test(trimmed)) {
    return {
      isValid: false,
      error: `Please enter a valid ${targetDisplayName} URL (e.g. ${platformPlaceholders[platform]}).`,
    };
  }

  return { isValid: true };
}

// Full schema validation for social form state
export const socialLinksFormSchema = z.object({
  instagram: z.string().trim().refine(val => !val || validateSocialLink('instagram', val).isValid, {
    message: 'Only valid Instagram URLs are accepted.',
  }).optional().nullable(),
  youtube: z.string().trim().refine(val => !val || validateSocialLink('youtube', val).isValid, {
    message: 'Only valid YouTube URLs are accepted.',
  }).optional().nullable(),
  twitter: z.string().trim().refine(val => !val || validateSocialLink('twitter', val).isValid, {
    message: 'Only valid X (Twitter) URLs are accepted.',
  }).optional().nullable(),
  linkedin: z.string().trim().refine(val => !val || validateSocialLink('linkedin', val).isValid, {
    message: 'Only valid LinkedIn URLs are accepted.',
  }).optional().nullable(),
  github: z.string().trim().refine(val => !val || validateSocialLink('github', val).isValid, {
    message: 'Only valid GitHub URLs are accepted.',
  }).optional().nullable(),
  tiktok: z.string().trim().refine(val => !val || validateSocialLink('tiktok', val).isValid, {
    message: 'Only valid TikTok URLs are accepted.',
  }).optional().nullable(),
  whatsapp: z.string().trim().refine(val => !val || validateSocialLink('whatsapp', val).isValid, {
    message: 'Only valid WhatsApp URLs are accepted.',
  }).optional().nullable(),
  telegram: z.string().trim().refine(val => !val || validateSocialLink('telegram', val).isValid, {
    message: 'Only valid Telegram URLs are accepted.',
  }).optional().nullable(),
  discord: z.string().trim().refine(val => !val || validateSocialLink('discord', val).isValid, {
    message: 'Only valid Discord URLs are accepted.',
  }).optional().nullable(),
  twitch: z.string().trim().refine(val => !val || validateSocialLink('twitch', val).isValid, {
    message: 'Only valid Twitch URLs are accepted.',
  }).optional().nullable(),
  spotify: z.string().trim().refine(val => !val || validateSocialLink('spotify', val).isValid, {
    message: 'Only valid Spotify URLs are accepted.',
  }).optional().nullable(),
  email: z.string().trim().refine(val => !val || validateSocialLink('email', val).isValid, {
    message: 'Only valid Email addresses or mailto links are accepted.',
  }).optional().nullable(),
  website: z.string().trim().refine(val => !val || validateSocialLink('website', val).isValid, {
    message: 'Only valid personal website URLs are accepted.',
  }).optional().nullable(),
});
