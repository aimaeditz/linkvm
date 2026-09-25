// Site helper for environment-driven domain and URL resolution
// Reads from centralized VITE_SITE_URL environment variable with robust fallbacks.

export function getSiteUrl(): string {
  // 1. Vite environment variable (primary for client-side Vite SPA build)
  const viteSiteUrl = (import.meta as any)?.env?.VITE_SITE_URL || (import.meta as any)?.env?.VITE_APP_URL;
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

  // 3. Window origin fallback in client-side runtime
  if (typeof window !== 'undefined' && window.location?.origin) {
    const base = ((import.meta as any)?.env?.BASE_URL || '/').replace(/\/+$/, '');
    if (base && base !== '/' && window.location.pathname.startsWith(base)) {
      return `${window.location.origin}${base}`;
    }
    return window.location.origin.replace(/\/+$/, '');
  }

  // Default fallback (GitHub Pages repository deployment)
  return 'https://aimaeditz.github.io/linkvm';
}

export function getSiteDomain(): string {
  const url = getSiteUrl();
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

export function getProfileUrl(username: string): string {
  const domainOnly = getSiteDomain();
  const cleanUsername = username.replace(/^@/, '').trim();
  return `${domainOnly}/${cleanUsername}`;
}

export function getFullProfileUrl(username: string): string {
  const siteUrl = getSiteUrl();
  const cleanUsername = username.replace(/^@/, '').trim();
  return `${siteUrl}/${cleanUsername}`;
}
