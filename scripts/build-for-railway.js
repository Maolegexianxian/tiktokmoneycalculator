#!/usr/bin/env node

/**
 * Railway构建脚本 - 跳过数据库连接
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Building for Railway deployment...');

// 设置环境变量避免数据库连接
process.env.DATABASE_URL = 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
process.env.NEXTAUTH_SECRET = 'placeholder-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// 创建一个临时的Prisma客户端mock
const mockPrismaClient = `
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
`;

// 备份原始的Prisma客户端
if (fs.existsSync('src/lib/prisma.ts')) {
  fs.copyFileSync('src/lib/prisma.ts', 'src/lib/prisma.ts.backup');
  console.log('📋 Backed up original Prisma client');
}

// 创建mock Prisma客户端
fs.writeFileSync('src/lib/prisma.ts', mockPrismaClient);
console.log('🔧 Created mock Prisma client for build');

try {
  console.log('🔨 Running Next.js build...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // 恢复原始的Prisma客户端
  if (fs.existsSync('src/lib/prisma.ts.backup')) {
    fs.copyFileSync('src/lib/prisma.ts.backup', 'src/lib/prisma.ts');
    fs.unlinkSync('src/lib/prisma.ts.backup');
    console.log('🔄 Restored original Prisma client');
  }
}

console.log('🎉 Railway build preparation complete!');
