// Prisma client singleton for production & edge safety
// In serverless / edge environments, prevents exhausting connection pool
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: any | undefined;
}

export const prisma =
  globalThis.prismaGlobal ||
  (() => {
    try {
      // Dynamic require or client initialization if @prisma/client is installed
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaClient } = require('@prisma/client');
      const client = new PrismaClient();
      if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = client;
      return client;
    } catch {
      return null;
    }
  })();
