import { z } from 'zod';

export const SOCIAL_PATTERNS = {
  instagram: /^https?:\/\/(www\.)?instagram\.com\/.+$/i,
  youtube: /^https?:\/\/(www\.)?youtube\.com\/.+$/i,
  twitter: /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/.+$/i,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+$/i,
  github: /^https?:\/\/(www\.)?github\.com\/.+$/i,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/.+$/i,
  whatsapp: /^https?:\/\/wa\.me\/.+$/i,
  telegram: /^https?:\/\/t\.me\/.+$/i,
  discord: /^https?:\/\/discord\.gg\/.+$/i,
  twitch: /^https?:\/\/(www\.)?twitch\.tv\/.+$/i,
  spotify: /^https?:\/\/open\.spotify\.com\/(artist|user|playlist|album|track|episode|show)\/.+$/i,
  email: /^mailto:[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i,
  website: /^https:\/\/.+$/i,
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
  website: 'Website',
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

export function validateSocialLink(platform: SocialFieldName, url: string): { isValid: boolean; error?: string } {
  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: true }; // empty is allowed
  }

  const pattern = SOCIAL_PATTERNS[platform];
  const displayName = platformDisplayNames[platform];

  if (!pattern.test(trimmed)) {
    return {
      isValid: false,
      error: `This does not look like a valid ${displayName} link.`,
    };
  }

  return { isValid: true };
}

// Full schema validation for social form state
export const socialLinksFormSchema = z.object({
  instagram: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.instagram.test(val), {
    message: 'This does not look like a valid Instagram link.',
  }).optional().nullable(),
  youtube: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.youtube.test(val), {
    message: 'This does not look like a valid YouTube link.',
  }).optional().nullable(),
  twitter: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.twitter.test(val), {
    message: 'This does not look like a valid X (Twitter) link.',
  }).optional().nullable(),
  linkedin: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.linkedin.test(val), {
    message: 'This does not look like a valid LinkedIn link.',
  }).optional().nullable(),
  github: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.github.test(val), {
    message: 'This does not look like a valid GitHub link.',
  }).optional().nullable(),
  tiktok: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.tiktok.test(val), {
    message: 'This does not look like a valid TikTok link.',
  }).optional().nullable(),
  whatsapp: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.whatsapp.test(val), {
    message: 'This does not look like a valid WhatsApp link.',
  }).optional().nullable(),
  telegram: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.telegram.test(val), {
    message: 'This does not look like a valid Telegram link.',
  }).optional().nullable(),
  discord: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.discord.test(val), {
    message: 'This does not look like a valid Discord link.',
  }).optional().nullable(),
  twitch: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.twitch.test(val), {
    message: 'This does not look like a valid Twitch link.',
  }).optional().nullable(),
  spotify: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.spotify.test(val), {
    message: 'This does not look like a valid Spotify link.',
  }).optional().nullable(),
  email: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.email.test(val), {
    message: 'This does not look like a valid Email link.',
  }).optional().nullable(),
  website: z.string().trim().refine(val => !val || SOCIAL_PATTERNS.website.test(val), {
    message: 'This does not look like a valid Website link.',
  }).optional().nullable(),
});
