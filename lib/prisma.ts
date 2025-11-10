let PrismaClient: any
try {
  PrismaClient = require('@prisma/client').PrismaClient
} catch (error) {
  console.warn('Prisma client not available during build')
  PrismaClient = class MockPrismaClient {}
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

export const prisma = globalForPrisma.prisma ?? (PrismaClient ? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
}) : null)

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}
