// Site helper for environment-driven domain resolution

export function getSiteUrl(): string {
  // 1. Vite environment variable (primary for Vite SPA build)
  const viteSiteUrl = (import.meta as any)?.env?.VITE_SITE_URL || (import.meta as any)?.env?.VITE_APP_URL;
  if (viteSiteUrl) {
    return viteSiteUrl.replace(/\/$/, '');
  }

  // 2. Process environment variable (Node / Next.js)
  const processUrl =
    typeof process !== 'undefined'
      ? process.env?.VITE_SITE_URL || process.env?.NEXT_PUBLIC_APP_URL
      : undefined;
  if (processUrl) {
    return processUrl.replace(/\/$/, '');
  }

  // 3. Window origin fallback in client-side runtime
  if (typeof window !== 'undefined' && window.location?.origin) {
    const base = ((import.meta as any)?.env?.BASE_URL || '/').replace(/\/$/, '');
    if (base && window.location.pathname.startsWith(base)) {
      return `${window.location.origin}${base}`;
    }
    return window.location.origin.replace(/\/$/, '');
  }

  // Production domain default fallback
  return 'https://aimaeditz.github.io/linkvm';
}

export function getProfileUrl(username: string): string {
  const baseUrl = getSiteUrl();
  const domainOnly = baseUrl.replace(/^https?:\/\//, '');
  return `${domainOnly}/${username}`;
}

export function getFullProfileUrl(username: string): string {
  return `${getSiteUrl()}/${username}`;
}
