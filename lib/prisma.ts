// Prisma client singleton for production & edge safety
// In serverless / edge environments, prevents exhausting connection pool
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: any | undefined;
}

// Prisma client singleton with AI Studio in-memory fallback
let prisma: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  prisma = (globalThis as any).prismaGlobal || new PrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    (globalThis as any).prismaGlobal = prisma;
  }
} catch {
  console.warn('[AI Studio] Prisma client not connected — using mock proxy');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
    count: async () => 0,
    upsert: async (d: any) => d?.create ?? {},
  };
  prisma = new Proxy({}, { get: () => noOp });
}

export { prisma };

