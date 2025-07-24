import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './routing';

/**
 * 速率限制配置
 */
interface RateLimitConfig {
  windowMs: number; // 时间窗口（毫秒）
  maxRequests: number; // 最大请求数
}

/**
 * 速率限制存储
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * 清理过期的速率限制记录
 */
function cleanupRateLimitStore(): void {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}

/**
 * 检查速率限制
 */
function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  
  // 清理过期记录
  if (rateLimitStore.size > 1000) {
    cleanupRateLimitStore();
  }
  
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // 创建新记录或重置过期记录
    const newRecord = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newRecord);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newRecord.resetTime,
    };
  }
  
  // 更新现有记录
  record.count++;
  
  return {
    allowed: record.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - record.count),
    resetTime: record.resetTime,
  };
}

/**
 * 获取客户端标识符
 */
function getClientIdentifier(request: NextRequest): string {
  // 优先使用真实IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || request.ip || 'unknown';
  
  // 对于已认证用户，使用用户ID
  const userId = request.headers.get('x-user-id');
  if (userId) {
    return `user:${userId}`;
  }
  
  return `ip:${ip}`;
}

/**
 * 应用速率限制
 */
function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): NextResponse | null {
  const identifier = getClientIdentifier(request);
  const result = checkRateLimit(identifier, config);
  
  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      { status: 429 }
    );
    
    // 添加速率限制头部
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());
    response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
    
    return response;
  }
  
  return null;
}

/**
 * 受保护的路由
 */
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/history',
  '/saved',
];

/**
 * 管理员路由
 */
const adminRoutes = [
  '/admin',
];

/**
 * API路由速率限制配置
 */
const apiRateLimits: Record<string, RateLimitConfig> = {
  '/api/calculator': {
    windowMs: 60 * 1000, // 1分钟
    maxRequests: 30, // 每分钟30次
  },
  '/api/auth': {
    windowMs: 15 * 60 * 1000, // 15分钟
    maxRequests: 10, // 每15分钟10次
  },
  '/api/feedback': {
    windowMs: 60 * 60 * 1000, // 1小时
    maxRequests: 5, // 每小时5次
  },
  '/api/upload': {
    windowMs: 60 * 60 * 1000, // 1小时
    maxRequests: 20, // 每小时20次
  },
  default: {
    windowMs: 60 * 1000, // 1分钟
    maxRequests: 100, // 每分钟100次
  },
};

/**
 * 创建国际化中间件
 */
const intlMiddleware = createIntlMiddleware(routing);

/**
 * 检查路由是否受保护
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * 检查路由是否为管理员路由
 */
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route));
}

/**
 * 检查路由是否为API路由
 */
function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api');
}

/**
 * 获取API路由的速率限制配置
 */
function getApiRateLimit(pathname: string): RateLimitConfig {
  for (const [route, config] of Object.entries(apiRateLimits)) {
    if (route !== 'default' && pathname.startsWith(route)) {
      return config;
    }
  }
  return apiRateLimits.default || { maxRequests: 100, windowMs: 60000 };
}

/**
 * 主中间件函数
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 跳过静态文件和内部路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // API路由处理
  if (isApiRoute(pathname)) {
    // 应用速率限制
    const rateLimitConfig = getApiRateLimit(pathname);
    const rateLimitResponse = applyRateLimit(request, rateLimitConfig);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    // API认证检查
    if (pathname.startsWith('/api/auth/') || pathname === '/api/calculator') {
      // 这些API路由不需要认证
      return NextResponse.next();
    }
    
    // 检查其他API路由的认证
    if (
      pathname.startsWith('/api/user/') ||
      pathname.startsWith('/api/history/') ||
      pathname.startsWith('/api/saved/') ||
      pathname.startsWith('/api/admin/')
    ) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
      });
      
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // 管理员API检查
      if (pathname.startsWith('/api/admin/') && token.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Admin access required' },
          { status: 403 }
        );
      }
      
      // 添加用户信息到请求头
      const response = NextResponse.next();
      response.headers.set('x-user-id', token.sub || '');
      response.headers.set('x-user-email', token.email || '');
      response.headers.set('x-user-role', (token as any).role || 'user');
      
      return response;
    }
    
    return NextResponse.next();
  }
  
  // 页面路由处理
  
  // 移除语言前缀以检查路由
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  
  // 受保护路由检查
  if (isProtectedRoute(pathnameWithoutLocale)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
    });
    
    if (!token) {
      // 重定向到登录页面
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // 管理员路由检查
  if (isAdminRoute(pathnameWithoutLocale)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
    });
    
    if (!token) {
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }
  
  // 应用国际化中间件
  try {
    const intlResponse = intlMiddleware(request);
    
    if (!intlResponse) {
      return NextResponse.next();
    }
    
    // 添加安全头部
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://www.google-analytics.com https://api.exchangerate-api.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');
    
    intlResponse.headers.set('Content-Security-Policy', csp);
    intlResponse.headers.set('X-Frame-Options', 'DENY');
    intlResponse.headers.set('X-Content-Type-Options', 'nosniff');
    intlResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    intlResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // HSTS (仅在生产环境)
    if (process.env.NODE_ENV === 'production') {
      intlResponse.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
    
    return intlResponse;
  } catch (error) {
    console.error('Intl middleware error:', error);
    // 如果国际化中间件失败，重定向到默认语言
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/en', request.url));
    }
    return NextResponse.next();
  }
  

}

/**
 * 中间件配置
 */
export const config = {
  matcher: [
    // 匹配所有路径，除了以下路径：
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ],
};