import { z } from 'zod';

export const linkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(80, 'Title is too long'),
  url: z.string().min(1, 'URL is required'),
  icon: z.string().nullable().optional(),
  visible: z.boolean().default(true),
  openInNew: z.boolean().default(true),
  highlighted: z.boolean().optional(),
  animation: z.enum(['none', 'pulse', 'bounce', 'glow']).optional(),
});

export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const formatted = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')
      ? url
      : `https://${url}`;
    new URL(formatted);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
