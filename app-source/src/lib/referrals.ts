import { getSiteUrl } from './site';

export function generateReferralCode(username: string, userId: string): string {
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || 'user';
  let hash = 0;
  const str = userId + username;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const token = Math.abs(hash).toString(36).substring(0, 4).padStart(4, '0');
  return `${cleanUsername}-${token}`;
}

export function buildReferralUrl(code: string): string {
  const siteUrl = getSiteUrl();
  return `${siteUrl}/r/${code}`;
}

export async function resolveReferralCode(code: string) {
  if (typeof window !== 'undefined') {
    const users = JSON.parse(localStorage.getItem('linkvm_users_table') || '[]');
    return users.find((u: any) => u.referralCode === code || u.username.toLowerCase() === code.split('-')[0]) || null;
  }
  return null;
}
