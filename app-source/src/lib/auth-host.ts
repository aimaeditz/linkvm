export const ALLOWED_AUTH_HOSTS: readonly string[] = [
  'linkvm.online',
  'www.linkvm.online',
  'aimaeditz.github.io',
  'linkvm.vercel.app',
  'localhost',
  '127.0.0.1',
  'linkvme.firebaseapp.com',
  'linkvme.web.app',
];

export function isAuthHostSupported(hostname: string = typeof window !== 'undefined' ? window.location.hostname : ''): boolean {
  if (!hostname) return true;
  const host = hostname.toLowerCase();
  return ALLOWED_AUTH_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`) || host.endsWith('run.app'));
}

export const UNAUTHORIZED_PREVIEW_NOTICE =
  'Sign-in is temporarily unavailable on this preview URL. Please open linkvm.online to sign in.';

export function getFriendlyAuthErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong. Please try again.';

  const code = (error as { code?: string })?.code || '';
  const message = error instanceof Error ? error.message : String(error);

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/user-not-found' ||
    code === 'auth/wrong-password' ||
    code === 'auth/invalid-email' ||
    code === 'auth/user-disabled' ||
    message.includes('auth/invalid-credential') ||
    message.includes('auth/user-not-found') ||
    message.includes('auth/wrong-password') ||
    message.includes('auth/invalid-email')
  ) {
    return 'Incorrect email or password.';
  }

  if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists. Please sign in instead.';
  }

  if (code === 'auth/weak-password' || message.includes('auth/weak-password')) {
    return 'Password must be at least 8 characters.';
  }

  if (code === 'auth/too-many-requests' || message.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }

  if (code === 'auth/network-request-failed' || message.includes('network-request-failed')) {
    return 'Network error. Please try again.';
  }

  if (code === 'auth/popup-closed-by-user' || message.includes('popup-closed-by-user')) {
    return 'Sign-in was cancelled.';
  }

  if (code === 'auth/popup-blocked' || message.includes('popup-blocked')) {
    return 'Popup was blocked by the browser. Please allow popups and try again.';
  }

  if (code === 'auth/unauthorized-domain' || message.includes('auth/unauthorized-domain')) {
    return UNAUTHORIZED_PREVIEW_NOTICE;
  }

  return 'Something went wrong. Please try again.';
}

