// Site helper for environment-driven domain and URL resolution
// Centralized domain management with https://linkvm.online/ as canonical domain.

export const CANONICAL_SITE_URL = 'https://linkvm.online';

export function getSiteUrl(): string {
  // 1. Vite environment variable (primary for client-side Vite SPA build)
  const envMap = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env;
  const viteSiteUrl = envMap?.VITE_SITE_URL || envMap?.VITE_APP_URL;
  if (viteSiteUrl && typeof viteSiteUrl === 'string' && viteSiteUrl.trim() !== '') {
    return viteSiteUrl.trim().replace(/\/+$/, '');
  }

  // 2. Process environment variable (Node / SSR / build tools)
  const processUrl =
    typeof process !== 'undefined'
      ? process.env?.VITE_SITE_URL || process.env?.NEXT_PUBLIC_APP_URL
      : undefined;
  if (processUrl && typeof processUrl === 'string' && processUrl.trim() !== '') {
    return processUrl.trim().replace(/\/+$/, '');
  }

  // Canonical single source of truth domain strictly linkvm.online
  return CANONICAL_SITE_URL;
}

export function getSiteDomain(): string {
  const url = getSiteUrl();
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

export function getProfileUrl(username: string): string {
  const domainOnly = getSiteDomain();
  const cleanUsername = (username || '').replace(/^[@$\-+!~]/, '').trim();
  return `${domainOnly}/${cleanUsername}`;
}

export function getFullProfileUrl(username: string): string {
  const siteUrl = getSiteUrl();
  const cleanUsername = (username || '').replace(/^[@$\-+!~]/, '').trim();
  return `${siteUrl}/${cleanUsername}`;
}
