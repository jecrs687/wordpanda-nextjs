import { PrismaClient } from '@prisma/client/edge';

let prisma: PrismaClient;
prisma = new PrismaClient();


export default prisma;