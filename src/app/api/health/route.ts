import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/cache';

/**
 * GET /api/health
 * 健康检查端点
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: 'unknown',
        cache: 'unknown',
        memory: 'unknown',
      },
    };

    // 数据库健康检查
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.checks.database = 'healthy';
    } catch (error) {
      checks.checks.database = 'unhealthy';
      checks.status = 'degraded';
    }

    // 缓存健康检查
    try {
      await cache.set('health-check', 'ok', 10);
      const result = await cache.get('health-check');
      checks.checks.cache = result === 'ok' ? 'healthy' : 'unhealthy';
    } catch (error) {
      checks.checks.cache = 'unhealthy';
      checks.status = 'degraded';
    }

    // 内存使用检查
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };

    // 检查内存使用是否过高 (> 500MB)
    if (memoryUsageMB.heapUsed > 500) {
      checks.checks.memory = 'warning';
      if (checks.status === 'healthy') {
        checks.status = 'degraded';
      }
    } else {
      checks.checks.memory = 'healthy';
    }

    const responseTime = Date.now() - startTime;

    const response = {
      ...checks,
      responseTime: `${responseTime}ms`,
      memory: memoryUsageMB,
    };

    // 根据健康状态返回适当的HTTP状态码
    const statusCode = checks.status === 'healthy' ? 200 : 
                      checks.status === 'degraded' ? 200 : 503;

    return NextResponse.json(response, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        responseTime: `${Date.now() - startTime}ms`,
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}

/**
 * HEAD /api/health
 * 简单的健康检查（仅返回状态码）
 */
export async function HEAD() {
  try {
    // 快速数据库检查
    await prisma.$queryRaw`SELECT 1`;
    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(null, { status: 503 });
  }
}
