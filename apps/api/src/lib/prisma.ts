import prismaPkg from '@prisma/client';

const { PrismaClient } = prismaPkg as unknown as {
  PrismaClient: new () => {
    inquiry: {
      create: (...args: unknown[]) => Promise<any>;
    };
  };
};

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientInstance };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
