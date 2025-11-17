import { PrismaClient } from '@prisma/client'

/**
 * PrismaClient Singleton Pattern
 *
 * This prevents creating multiple instances of PrismaClient in serverless environments
 * like Vercel, which can exhaust database connections.
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */

// Declare global type for PrismaClient instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Create a singleton instance
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// In development, save the instance to global to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma
