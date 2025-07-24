import { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth.js API 路由处理器
 * 处理所有认证相关的请求
 */
const handler = NextAuth(authOptions);

/**
 * 导出 GET 和 POST 处理器
 * NextAuth.js 需要这两个方法来处理不同的认证流程
 */
export { handler as GET, handler as POST };

/**
 * 可选：添加自定义的请求处理逻辑
 */
export async function middleware(request: NextRequest) {
  // 在这里可以添加自定义的中间件逻辑
  // 例如：日志记录、速率限制等
  
  return handler(request);
}