import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Define a type that can hold both the standard and extended Prisma client
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>
const globalForPrisma = global as unknown as { prisma: ExtendedPrismaClient }

const createPrismaClient = () => {
    const client = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

    return client.$extends(withAccelerate())
}

const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma