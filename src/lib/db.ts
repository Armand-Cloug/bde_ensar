// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForDb = globalThis as unknown as {
  db: PrismaClient | undefined;
};

export const db = globalForDb.db ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
