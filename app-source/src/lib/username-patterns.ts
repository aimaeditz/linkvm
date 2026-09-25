// Utility helpers for alternative URL patterns under dynamic site URL
import { getSiteUrl, getSiteDomain } from './site';

export interface PatternItem {
  id: string;
  pattern: string; // e.g. "{username}", "@{username}", "${username}", etc.
  label: string;
  example: string;
  description: string;
}

export function getPatternsList(): PatternItem[] {
  const domain = getSiteDomain();
  const baseHost = domain.split('/')[0] || domain;

  return [
    {
      id: 'standard',
      pattern: '{username}',
      label: 'Standard',
      example: `${domain}/username`,
      description: 'Clean direct path',
    },
    {
      id: 'at',
      pattern: '@{username}',
      label: 'At-Symbol (@)',
      example: `${domain}/@username`,
      description: 'Social handle style',
    },
    {
      id: 'dollar',
      pattern: '${username}',
      label: 'Dollar ($)',
      example: `${domain}/$username`,
      description: 'Creator / cashtag style',
    },
    {
      id: 'dash',
      pattern: '-{username}',
      label: 'Dash (-)',
      example: `${domain}/-username`,
      description: 'Minimal prefix',
    },
    {
      id: 'plus',
      pattern: '+{username}',
      label: 'Plus (+)',
      example: `${domain}/+username`,
      description: 'Positive badge style',
    },
    {
      id: 'exclamation',
      pattern: '!{username}',
      label: 'Exclamation (!)',
      example: `${domain}/!username`,
      description: 'Bold priority style',
    },
    {
      id: 'tilde',
      pattern: '~{username}',
      label: '~Tilde (~)',
      example: `${domain}/~username`,
      description: 'Developer / home dir style',
    },
    {
      id: 'subdomain',
      pattern: '{username}.subdomain',
      label: 'Short Subdomain',
      example: `username.${baseHost}`,
      description: 'Direct subdomain shortcut',
    },
  ];
}

// Export PATTERNS proxy/array for full backwards compatibility
export const PATTERNS: PatternItem[] = getPatternsList();

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
