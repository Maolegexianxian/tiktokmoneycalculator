
// Mock Prisma Client for build
export class PrismaClient {
  constructor() {
    console.log('Mock Prisma Client initialized for build');
  }
  
  $connect() {
    return Promise.resolve();
  }
  
  $disconnect() {
    return Promise.resolve();
  }
}

export const prisma = new PrismaClient();
