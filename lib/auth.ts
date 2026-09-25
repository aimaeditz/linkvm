import { AuthOptions } from 'next-auth';
import { authOptions as configOptions } from './auth.config';

export const authOptions: AuthOptions = configOptions;

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  username?: string;
  image?: string | null;
}

export interface AuthSession {
  user?: SessionUser;
  expires: string;
}

export async function getSession(): Promise<AuthSession | null> {
  if (typeof window !== 'undefined') {
    const sessionUserId = localStorage.getItem('linkvm_session_user_id') || localStorage.getItem('linkvaultme_session_user_id');
    const expiresAt = localStorage.getItem('linkvm_session_expires_at') || localStorage.getItem('linkvaultme_session_expires_at');
    if (!sessionUserId || !expiresAt || Date.now() > Number(expiresAt)) {
      return null;
    }
    const usersRaw = localStorage.getItem('linkvm_users_table') || localStorage.getItem('linkvaultme_users_table');
    if (usersRaw) {
      try {
        const users = JSON.parse(usersRaw);
        const current = users.find((u: { id: string }) => u.id === sessionUserId);
        if (current) {
          return {
            user: {
              id: current.id,
              name: current.name,
              email: current.email,
              username: current.username,
              image: current.avatarUrl,
            },
            expires: new Date(Number(expiresAt)).toISOString(),
          };
        }
      } catch {
        return null;
      }
    }
    return null;
  }
  return null;
}
