// Site helper for environment-driven domain resolution

export function getSiteUrl(): string {
  // Check NEXT_PUBLIC_APP_URL environment variable or Vite env
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || (import.meta as any)?.env?.VITE_APP_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  // Window origin fallback in client-side runtime
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }

  // Production domain default
  return 'https://linkvm.online';
}

export function getProfileUrl(username: string): string {
  const baseUrl = getSiteUrl();
  const domainOnly = baseUrl.replace(/^https?:\/\//, '');
  return `${domainOnly}/${username}`;
}

export function getFullProfileUrl(username: string): string {
  return `${getSiteUrl()}/${username}`;
}
