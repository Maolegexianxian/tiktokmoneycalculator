import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface SystemMetrics {
  apiResponseTime: number;
  calculationTime: number;
  errorRate: number;
  uptime: number;
  activeUsers: number;
  totalCalculations: number;
  cacheHitRate: number;
  memoryUsage: number;
  cpuUsage: number;
  databaseConnections: number;
}

// In-memory metrics storage (in production, use Redis or similar)
let metricsStore: {
  apiResponseTimes: number[];
  calculationTimes: number[];
  errors: number;
  requests: number;
  startTime: number;
  activeUsers: Set<string>;
  totalCalculations: number;
  cacheHits: number;
  cacheMisses: number;
} = {
  apiResponseTimes: [],
  calculationTimes: [],
  errors: 0,
  requests: 0,
  startTime: Date.now(),
  activeUsers: new Set(),
  totalCalculations: 0,
  cacheHits: 0,
  cacheMisses: 0,
};

/**
 * GET /api/metrics
 * Get system performance metrics
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin or if this is an internal request
    const session = await getServerSession(authOptions);
    const isInternal = request.headers.get('x-internal-request') === 'true';
    
    if (!isInternal && (!session?.user || !isAdmin(session.user))) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin access required' },
        { status: 401 }
      );
    }

    const metrics = await calculateMetrics();

    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error retrieving metrics:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to retrieve metrics',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/metrics
 * Record performance metrics from client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value, userId, metadata } = body;

    // Record metric based on type
    switch (type) {
      case 'api_response_time':
        recordApiResponseTime(value);
        break;
      case 'calculation_time':
        recordCalculationTime(value);
        break;
      case 'error':
        recordError();
        break;
      case 'user_activity':
        recordUserActivity(userId);
        break;
      case 'calculation_completed':
        recordCalculationCompleted();
        break;
      case 'cache_hit':
        recordCacheHit();
        break;
      case 'cache_miss':
        recordCacheMiss();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid metric type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Metric recorded',
    });

  } catch (error) {
    console.error('Error recording metric:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to record metric',
      },
      { status: 500 }
    );
  }
}

// Helper functions

async function calculateMetrics(): Promise<SystemMetrics> {
  const now = Date.now();
  const uptimeMs = now - metricsStore.startTime;
  const uptimeHours = uptimeMs / (1000 * 60 * 60);

  // Calculate average API response time
  const avgApiResponseTime = metricsStore.apiResponseTimes.length > 0
    ? metricsStore.apiResponseTimes.reduce((a, b) => a + b, 0) / metricsStore.apiResponseTimes.length
    : 0;

  // Calculate average calculation time
  const avgCalculationTime = metricsStore.calculationTimes.length > 0
    ? metricsStore.calculationTimes.reduce((a, b) => a + b, 0) / metricsStore.calculationTimes.length
    : 0;

  // Calculate error rate
  const errorRate = metricsStore.requests > 0
    ? (metricsStore.errors / metricsStore.requests) * 100
    : 0;

  // Calculate uptime percentage (assume 99.9% for demo)
  const uptime = Math.min(99.9, (uptimeHours / (uptimeHours + 0.1)) * 100);

  // Calculate cache hit rate
  const totalCacheRequests = metricsStore.cacheHits + metricsStore.cacheMisses;
  const cacheHitRate = totalCacheRequests > 0
    ? (metricsStore.cacheHits / totalCacheRequests) * 100
    : 95; // Default to 95%

  // Get system metrics (in production, use actual system monitoring)
  const systemMetrics = await getSystemMetrics();

  return {
    apiResponseTime: Math.round(avgApiResponseTime),
    calculationTime: Math.round(avgCalculationTime),
    errorRate: Math.round(errorRate * 100) / 100,
    uptime: Math.round(uptime * 10) / 10,
    activeUsers: metricsStore.activeUsers.size,
    totalCalculations: metricsStore.totalCalculations,
    cacheHitRate: Math.round(cacheHitRate * 10) / 10,
    memoryUsage: systemMetrics.memoryUsage,
    cpuUsage: systemMetrics.cpuUsage,
    databaseConnections: systemMetrics.databaseConnections,
  };
}

async function getSystemMetrics(): Promise<{
  memoryUsage: number;
  cpuUsage: number;
  databaseConnections: number;
}> {
  try {
    // In production, get actual system metrics
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      const memoryUsage = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
      
      return {
        memoryUsage,
        cpuUsage: Math.random() * 20 + 10, // Mock CPU usage
        databaseConnections: 5, // Mock DB connections
      };
    }
  } catch (error) {
    console.error('Error getting system metrics:', error);
  }

  // Fallback values
  return {
    memoryUsage: 45,
    cpuUsage: 15,
    databaseConnections: 5,
  };
}

function recordApiResponseTime(time: number) {
  metricsStore.apiResponseTimes.push(time);
  metricsStore.requests++;
  
  // Keep only last 1000 measurements
  if (metricsStore.apiResponseTimes.length > 1000) {
    metricsStore.apiResponseTimes = metricsStore.apiResponseTimes.slice(-1000);
  }
}

function recordCalculationTime(time: number) {
  metricsStore.calculationTimes.push(time);
  
  // Keep only last 1000 measurements
  if (metricsStore.calculationTimes.length > 1000) {
    metricsStore.calculationTimes = metricsStore.calculationTimes.slice(-1000);
  }
}

function recordError() {
  metricsStore.errors++;
  metricsStore.requests++;
}

function recordUserActivity(userId: string) {
  if (userId && userId !== 'anonymous') {
    metricsStore.activeUsers.add(userId);
    
    // Remove user after 30 minutes of inactivity
    setTimeout(() => {
      metricsStore.activeUsers.delete(userId);
    }, 30 * 60 * 1000);
  }
}

function recordCalculationCompleted() {
  metricsStore.totalCalculations++;
}

function recordCacheHit() {
  metricsStore.cacheHits++;
}

function recordCacheMiss() {
  metricsStore.cacheMisses++;
}

function isAdmin(user: any): boolean {
  return user.role === 'admin' || user.email?.endsWith('@tiktokmoneycalculator.com');
}

// Middleware to automatically record API response times
export function recordApiMetrics(startTime: number, hasError: boolean = false) {
  const responseTime = Date.now() - startTime;
  recordApiResponseTime(responseTime);
  
  if (hasError) {
    recordError();
  }
}

// Clean up old metrics periodically
setInterval(() => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  // Reset counters if they're getting too large
  if (metricsStore.requests > 100000) {
    metricsStore.requests = Math.floor(metricsStore.requests / 2);
    metricsStore.errors = Math.floor(metricsStore.errors / 2);
  }
  
  // Clear old active users (this is handled by setTimeout above, but just in case)
  if (metricsStore.activeUsers.size > 10000) {
    metricsStore.activeUsers.clear();
  }
}, 60 * 60 * 1000); // Run every hour
