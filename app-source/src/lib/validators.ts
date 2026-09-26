import { z } from 'zod';

export const linkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(80, 'Title cannot exceed 80 characters')
    .trim(),
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL (e.g., https://example.com)')
    .trim(),
  icon: z.string().optional().nullable(),
  visible: z.boolean().default(true),
  openInNew: z.boolean().default(true),
  highlighted: z.boolean().default(false),
  animation: z.enum(['none', 'pulse', 'bounce', 'glow']).default('none'),
});

export const themeOverrideSchema = z.object({
  presetId: z.string().min(1),
  bgColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid background hex color'),
  buttonColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid button hex color'),
  textColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid text hex color'),
  buttonTextColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid button text hex color').optional(),
  buttonBorderColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid button border hex color').optional(),
  headingColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid heading hex color').optional(),
  linkHoverColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid link hover hex color').optional(),
  buttonStyle: z.enum(['solid', 'bordered', 'outline', 'soft', 'glass', 'gradient', 'shadow', 'glow']),
  buttonShape: z.enum(['rounded', 'pill', 'square', 'sharp', 'rounded-none', 'rounded-md', 'rounded-xl', 'rounded-full']),
  buttonHover: z.enum(['scale', 'lift', 'glow', 'bounce', 'shimmer', 'glass', 'none', 'darken', 'underline']),
  cardStyle: z.enum(['minimal', 'elevated', 'glass', '3d', 'card-white', 'card-glass', 'card-flat', 'card-bordered']),
  fontFamily: z.enum([
    'Inter',
    'Manrope',
    'Sora',
    'DM Sans',
    'Space Grotesk',
    'Plus Jakarta Sans',
    'Instrument Serif',
    'Bricolage Grotesque',
    'Outfit',
    'Syne',
    'Poppins',
    'Playfair Display',
  ]),
  bgType: z.enum(['solid', 'gradient', 'mesh', 'pattern']),
  bgGradientFrom: z.string().optional().nullable(),
  bgGradientTo: z.string().optional().nullable(),
  bgGradientAngle: z.string().optional().nullable(),
  stickerPack: z.enum(['none', 'geometric', 'minimal-dots', 'subtle-lines']).optional(),
  socialIconSize: z.string().optional(),
  socialIconShape: z.string().optional(),
  socialIconFill: z.string().optional(),
  socialIconColor: z.string().optional(),
  socialIconBg: z.string().optional(),
  socialIconBorder: z.string().optional(),
  socialIconSpacing: z.string().optional(),
  socialIconLayout: z.string().optional(),
  socialIconAlign: z.string().optional(),
  signature: z.enum(['3d', 'glow', 'glass', 'dark', 'gradient', 'metallic', 'flat']).optional(),
  tagline: z.string().optional(),
  badge: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().max(50, 'Name cannot exceed 50 characters').trim().optional().nullable(),
  bio: z.string().max(160, 'Bio cannot exceed 160 characters').trim().optional().nullable(),
  avatarUrl: z.string().url('Invalid avatar URL').optional().nullable().or(z.literal('')),
});

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and dashes')
    .toLowerCase()
    .trim(),
});

export const notificationsSchema = z.object({
  emailOnView: z.boolean().default(false),
  emailOnClick: z.boolean().default(false),
  weeklySummary: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
  marketingUpdates: z.boolean().default(false),
});

export const privacySchema = z.object({
  hideBranding: z.boolean().default(false),
  searchIndexing: z.boolean().default(true),
  sensitiveContent: z.boolean().default(false),
  anonymousAnalytics: z.boolean().default(false),
});

export type LinkInput = z.infer<typeof linkSchema>;
export type ThemeOverrideInput = z.infer<typeof themeOverrideSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type UsernameInput = z.infer<typeof usernameSchema>;
export type NotificationsInput = z.infer<typeof notificationsSchema>;
export type PrivacyInput = z.infer<typeof privacySchema>;
