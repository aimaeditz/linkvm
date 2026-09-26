import { User } from '../types';
import { getSiteUrl } from './site';
import { db, isFirebaseConfigured } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

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

export async function resolveReferralCode(code: string): Promise<User | null> {
  if (!code || !isFirebaseConfigured) return null;
  const usernamePart = code.split('-')[0]?.toLowerCase();
  if (!usernamePart) return null;

  try {
    const unameDoc = await getDoc(doc(db, 'usernames', usernamePart));
    if (unameDoc.exists()) {
      const uid = unameDoc.data()?.uid;
      if (uid) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          return userDoc.data() as User;
        }
      }
    }
  } catch (err) {
    console.warn('Failed to resolve referral code from Firestore:', err);
  }
  return null;
}
