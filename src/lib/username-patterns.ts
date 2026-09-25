// Utility helpers for alternative URL patterns under dynamic site URL
import { getSiteUrl } from './site';

export interface PatternItem {
  id: string;
  pattern: string; // e.g. "{username}", "@{username}", "${username}", etc.
  label: string;
  example: string;
  description: string;
}

export const PATTERNS: PatternItem[] = [
  {
    id: 'standard',
    pattern: '{username}',
    label: 'Standard',
    example: 'linkvm.online/aimaeditz',
    description: 'Clean direct path',
  },
  {
    id: 'at',
    pattern: '@{username}',
    label: 'At-Symbol (@)',
    example: 'linkvm.online/@aimaeditz',
    description: 'Social handle style',
  },
  {
    id: 'dollar',
    pattern: '${username}',
    label: 'Dollar ($)',
    example: 'linkvm.online/$aimaeditz',
    description: 'Creator / cashtag style',
  },
  {
    id: 'dash',
    pattern: '-{username}',
    label: 'Dash (-)',
    example: 'linkvm.online/-aimaeditz',
    description: 'Minimal prefix',
  },
  {
    id: 'plus',
    pattern: '+{username}',
    label: 'Plus (+)',
    example: 'linkvm.online/+aimaeditz',
    description: 'Positive badge style',
  },
  {
    id: 'exclamation',
    pattern: '!{username}',
    label: 'Exclamation (!)',
    example: 'linkvm.online/!aimaeditz',
    description: 'Bold priority style',
  },
  {
    id: 'tilde',
    pattern: '~{username}',
    label: '~Tilde (~)',
    example: 'linkvm.online/~aimaeditz',
    description: 'Developer / home dir style',
  },
  {
    id: 'subdomain',
    pattern: '{username}.subdomain',
    label: 'Short Subdomain',
    example: 'aimaeditz.linkvm.online',
    description: 'Direct subdomain shortcut',
  },
];

export function normalizeUsername(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.trim();
  // Strip leading prefixes if present
  if (/^[@$\-+!~]/.test(cleaned)) {
    cleaned = cleaned.substring(1);
  }
  return cleaned.toLowerCase().replace(/[^a-z0-9_\-]/g, '');
}

export function buildPatternUrl(pattern: string | undefined, username: string, baseUrl?: string): string {
  const cleanUsername = normalizeUsername(username) || 'username';
  const siteUrl = (baseUrl || getSiteUrl()).replace(/\/$/, '');

  if (pattern === '{username}.subdomain' || pattern === 'subdomain') {
    try {
      const urlObj = new URL(siteUrl);
      if (!urlObj.pathname || urlObj.pathname === '/') {
        return `${urlObj.protocol}//${cleanUsername}.${urlObj.host}`;
      }
    } catch {
      // fallback
    }
    return `${siteUrl}/${cleanUsername}`;
  }

  const activePattern = pattern || '{username}';
  const formattedPath = activePattern.replace('{username}', cleanUsername);
  return `${siteUrl}/${formattedPath}`;
}

export function buildPatternDisplayUrl(pattern: string | undefined, username: string, baseUrl?: string): string {
  const full = buildPatternUrl(pattern, username, baseUrl);
  return full.replace(/^https?:\/\//, '');
}
