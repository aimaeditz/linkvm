import type { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
    newUser: '/dashboard',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        (token as any).username = (user as any).username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = (token as any).username;
      }
      return session;
    },
  },
  providers: [],
};

export const authConfig = authOptions;
