import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { calculateEarnings } from '@/lib/calculator';
import { calculatorInputSchema } from '@/lib/validations';
import { historyRepository } from '@/lib/db';
import { track } from '@/lib/analytics';
import { CalculatorInput, CalculationResult } from '@/types';
import {
  errorHandler,
  createErrorResponse,
  ErrorCode,
  ErrorSeverity
} from '@/lib/error-handler';

// 生成请求ID用于追踪
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 企业级成功响应
function createSuccessResponse(data: any, requestId: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    metadata: {
      requestId,
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
  });
}

// 性能监控
interface PerformanceMetrics {
  requestId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  operation: string;
  success: boolean;
  errorCode?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];

  startOperation(requestId: string, operation: string): PerformanceMetrics {
    const metric: PerformanceMetrics = {
      requestId,
      startTime: Date.now(),
      operation,
      success: false,
    };

    this.metrics.push(metric);
    return metric;
  }

  endOperation(metric: PerformanceMetrics, success: boolean, errorCode?: string): void {
    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = success;
    metric.errorCode = errorCode;

    // 记录性能日志
    console.log(`[${metric.requestId}] Performance: ${metric.operation} completed in ${metric.duration}ms`, {
      success: metric.success,
      errorCode: metric.errorCode,
    });

    // 如果操作时间过长，记录警告
    if (metric.duration > 5000) { // 5秒
      console.warn(`[${metric.requestId}] Slow operation detected: ${metric.operation} took ${metric.duration}ms`);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
}

const performanceMonitor = new PerformanceMonitor();

/**
 * POST /api/calculator
 * 企业级创作者收益计算API
 * 支持多平台、高精度预测和完整的错误处理
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const performanceMetric = performanceMonitor.startOperation(requestId, 'calculator_api_request');

  try {
    // 记录请求开始
    console.log(`[${requestId}] Calculator API request started`);

    // 获取用户会话（用于错误追踪）
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (sessionError) {
      console.warn(`[${requestId}] Failed to get session:`, sessionError);
    }

    // 解析请求体
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      performanceMonitor.endOperation(performanceMetric, false, ErrorCode.INVALID_JSON);
      return createErrorResponse(
        errorHandler.createError(
          ErrorCode.INVALID_JSON,
          'Invalid JSON in request body',
          ErrorSeverity.MEDIUM,
          { parseError: parseError instanceof Error ? parseError.message : String(parseError) }
        ),
        400,
        requestId,
        session?.user?.id
      );
    }

    // 验证输入数据
    const validation = calculatorInputSchema.safeParse(body);
    if (!validation.success) {
      const validationErrors = validation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      console.warn(`[${requestId}] Validation failed:`, validationErrors);
      performanceMonitor.endOperation(performanceMetric, false, ErrorCode.VALIDATION_ERROR);

      return createErrorResponse(
        errorHandler.createError(
          ErrorCode.VALIDATION_ERROR,
          'Invalid input data',
          ErrorSeverity.MEDIUM,
          { validationErrors },
          { operation: 'input_validation', input: body }
        ),
        400,
        requestId,
        session?.user?.id
      );
    }

    // 获取验证后的数据
    const validatedData = validation.data;

    // 企业级数据验证和清理
    const cleanMetrics: CalculatorInput['metrics'] = {};

    // 验证必需字段
    const hasFollowers = validatedData.metrics.followers !== undefined && validatedData.metrics.followers !== null;
    const hasSubscribers = validatedData.metrics.subscribers !== undefined && validatedData.metrics.subscribers !== null;

    if (!hasFollowers && !hasSubscribers) {
      performanceMonitor.endOperation(performanceMetric, false, ErrorCode.MISSING_REQUIRED_FIELD);
      return createErrorResponse(
        errorHandler.createError(
          ErrorCode.MISSING_REQUIRED_FIELD,
          'Either followers or subscribers count is required',
          ErrorSeverity.MEDIUM,
          { hasFollowers, hasSubscribers },
          { operation: 'field_validation', platform: validatedData.platform }
        ),
        400,
        requestId,
        session?.user?.id
      );
    }

    // 安全地构建metrics对象，确保数据类型正确
    const metricsFields = [
      'followers', 'subscribers', 'avgViews', 'avgLikes', 'avgComments',
      'avgShares', 'engagementRate', 'avgStoryViews', 'avgReelsViews',
      'avgWatchTime', 'videoLength', 'watchTimePercentage'
    ] as const;

    for (const field of metricsFields) {
      const value = validatedData.metrics[field];
      if (value !== undefined && value !== null) {
        // 确保数值类型正确
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
          cleanMetrics[field] = Math.max(0, value); // 确保非负数
        } else if (typeof value === 'string' && !isNaN(Number(value))) {
          cleanMetrics[field] = Math.max(0, Number(value));
        }
      }
    }

    // 如果没有提供互动率，尝试计算
    if (!cleanMetrics.engagementRate && cleanMetrics.avgLikes && cleanMetrics.avgComments && cleanMetrics.avgViews) {
      const totalEngagements = (cleanMetrics.avgLikes || 0) + (cleanMetrics.avgComments || 0) + (cleanMetrics.avgShares || 0);
      cleanMetrics.engagementRate = (totalEngagements / cleanMetrics.avgViews) * 100;
    }

    // 安全地构建profile对象
    const cleanProfile: CalculatorInput['profile'] = {
      contentNiche: validatedData.profile.contentNiche,
      audienceLocation: validatedData.profile.audienceLocation,
    };

    // 安全地添加可选字段
    const profileFields = [
      'postFrequency', 'uploadFrequency', 'accountAge', 'channelAge',
      'hasVerification', 'monetizationEnabled'
    ] as const;

    for (const field of profileFields) {
      const value = validatedData.profile[field];
      if (value !== undefined && value !== null) {
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
          (cleanProfile as any)[field] = Math.max(0, value);
        } else if (typeof value === 'boolean') {
          (cleanProfile as any)[field] = value;
        } else if (typeof value === 'string' && !isNaN(Number(value))) {
          (cleanProfile as any)[field] = Math.max(0, Number(value));
        }
      }
    }

    // 构建最终输入对象
    const input: CalculatorInput = {
      platform: validatedData.platform,
      metrics: cleanMetrics,
      profile: cleanProfile
    };

    console.log(`[${requestId}] Executing calculation for platform: ${input.platform}`);

    // 执行计算 - 使用正确的函数名
    let result: CalculationResult;
    const calculationStartTime = Date.now();

    try {
      result = calculateEarnings(input);
      const calculationTime = Date.now() - calculationStartTime;
      console.log(`[${requestId}] Calculation completed in ${calculationTime}ms`);

      // 验证计算结果
      if (!result || typeof result.monthlyEarnings !== 'number' || isNaN(result.monthlyEarnings)) {
        throw new Error('Invalid calculation result');
      }

    } catch (calculationError) {
      const calculationTime = Date.now() - calculationStartTime;
      console.error(`[${requestId}] Calculation failed after ${calculationTime}ms:`, calculationError);
      performanceMonitor.endOperation(performanceMetric, false, ErrorCode.CALCULATION_ERROR);

      return createErrorResponse(
        errorHandler.createError(
          ErrorCode.CALCULATION_ERROR,
          calculationError instanceof Error ? calculationError.message : 'Calculation failed',
          ErrorSeverity.HIGH,
          { calculationTime, originalError: calculationError },
          { operation: 'earnings_calculation', platform: input.platform, input }
        ),
        500,
        requestId,
        session?.user?.id
      );
    }

    const totalTime = Date.now() - performanceMetric.startTime;
    console.log(`[${requestId}] Total request processing time: ${totalTime}ms`);

    // 保存计算历史（如果用户已登录）
    if (session?.user?.id) {
      try {
        await historyRepository.create({
          userId: session.user.id,
          platform: input.platform,
          input,
          result,
        });
        console.log(`[${requestId}] Calculation history saved for user: ${session.user.id}`);
      } catch (historyError) {
        console.error(`[${requestId}] Failed to save calculation history:`, historyError);
        // 记录错误但不影响主要功能
        errorHandler.handleError(
          historyError instanceof Error ? historyError : new Error(String(historyError)),
          requestId,
          session.user.id,
          { operation: 'save_history', platform: input.platform }
        );
      }
    }

    // 跟踪分析事件
    try {
      track.calculatorUsage(input, result);
      console.log(`[${requestId}] Analytics event tracked`);
    } catch (trackingError) {
      console.error(`[${requestId}] Failed to track calculator usage:`, trackingError);
      // 记录错误但不影响主要功能
      errorHandler.handleError(
        trackingError instanceof Error ? trackingError : new Error(String(trackingError)),
        requestId,
        session?.user?.id,
        { operation: 'track_analytics', platform: input.platform }
      );
    }

    // 返回成功响应 - 直接返回result，保持向后兼容
    performanceMonitor.endOperation(performanceMetric, true);
    console.log(`[${requestId}] Request completed successfully in ${totalTime}ms`);
    return createSuccessResponse(result, requestId);
    
  } catch (error) {
    const totalTime = Date.now() - performanceMetric.startTime;
    console.error(`[${requestId}] Calculator API error after ${totalTime}ms:`, error);

    // 结束性能监控
    performanceMonitor.endOperation(performanceMetric, false, ErrorCode.INTERNAL_ERROR);

    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'calculator-api');
    } catch (trackingError) {
      console.error(`[${requestId}] Failed to track error:`, trackingError);
    }

    // 根据错误类型确定状态码
    let statusCode = 500;
    let errorCode = ErrorCode.INTERNAL_ERROR;
    let severity = ErrorSeverity.HIGH;

    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('validation')) {
        errorCode = ErrorCode.VALIDATION_ERROR;
        statusCode = 400;
        severity = ErrorSeverity.MEDIUM;
      } else if (message.includes('timeout')) {
        errorCode = ErrorCode.TIMEOUT_ERROR;
        statusCode = 408;
        severity = ErrorSeverity.HIGH;
      } else if (message.includes('rate limit')) {
        errorCode = ErrorCode.RATE_LIMIT_ERROR;
        statusCode = 429;
        severity = ErrorSeverity.MEDIUM;
      } else if (message.includes('calculation')) {
        errorCode = ErrorCode.CALCULATION_ERROR;
        statusCode = 500;
        severity = ErrorSeverity.HIGH;
      }
    }

    return createErrorResponse(
      errorHandler.createError(
        errorCode,
        error instanceof Error ? error.message : String(error),
        severity,
        { totalTime, stack: error instanceof Error ? error.stack : undefined },
        { operation: 'calculator_api_request', requestId }
      ),
      statusCode,
      requestId,
      undefined, // userId not available in catch block
      { operation: 'calculator_api_request', totalTime }
    );
  }
}

/**
 * GET /api/calculator
 * 获取计算器API信息和健康状态
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'health') {
      // 健康检查
      return createSuccessResponse({
        status: 'healthy',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      }, requestId);
    }

    // 默认API信息
    return createSuccessResponse({
      name: 'TikTok Money Calculator API',
      version: '2.0.0',
      description: 'Enterprise-grade creator earnings calculator',
      endpoints: {
        calculate: 'POST /api/calculator',
        health: 'GET /api/calculator?type=health',
        enterprise: 'POST /api/calculator/enterprise',
      },
      supportedPlatforms: ['tiktok', 'instagram', 'youtube'],
      features: [
        'Multi-platform support',
        'Real-time market data',
        'ML-enhanced predictions',
        'Risk assessment',
        'Performance monitoring',
      ],
    }, requestId);

  } catch (error) {
    return createErrorResponse(
      error instanceof Error ? error : new Error(String(error)),
      500,
      'INTERNAL_ERROR',
      requestId
    );
  }
}

/**
 * OPTIONS /api/calculator
 * 处理CORS预检请求
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

