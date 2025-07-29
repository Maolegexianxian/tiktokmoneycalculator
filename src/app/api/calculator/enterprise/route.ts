/**
 * 企业级计算器API端点
 * 提供高级功能如ML预测、风险评估、A/B测试等
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { enterpriseCalculatorService } from '@/lib/enterprise-calculator-service';
import { calculatorInputSchema } from '@/lib/validations';
import { historyRepository } from '@/lib/db';
import { track } from '@/lib/analytics';
import { isFeatureEnabled } from '@/lib/enterprise-config';
import { CalculatorInput } from '@/types';

/**
 * POST /api/calculator/enterprise
 * 企业级收益计算
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 验证输入数据
    const validation = calculatorInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid input data',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    
    // 构建输入对象
    const input: CalculatorInput = {
      platform: validation.data.platform,
      metrics: validation.data.metrics as CalculatorInput['metrics'],
      profile: validation.data.profile as CalculatorInput['profile'],
    };

    // 获取用户会话
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // 获取请求选项
    const options = {
      userId,
      sessionId: request.headers.get('x-session-id') || undefined,
      includeRiskAssessment: body.options?.includeRiskAssessment ?? true,
      includeMarketComparison: body.options?.includeMarketComparison ?? true,
      includeGrowthProjections: body.options?.includeGrowthProjections ?? true,
      useMLPrediction: body.options?.useMLPrediction ?? isFeatureEnabled('ML_PREDICTION'),
      enableABTesting: body.options?.enableABTesting ?? (isFeatureEnabled('AB_TESTING') && !!userId),
      enableMonitoring: body.options?.enableMonitoring ?? isFeatureEnabled('MONITORING'),
    };

    // 执行企业级计算
    const result = await enterpriseCalculatorService.calculateEarnings(input, options);
    
    // 保存计算历史（如果用户已登录）
    if (userId) {
      try {
        await historyRepository.create({
          userId,
          platform: input.platform,
          input,
          result: {
            monthlyEarnings: result.monthlyEarnings,
            yearlyEarnings: result.yearlyEarnings,
            perPostEarnings: result.perPostEarnings,
            perThousandViewsEarnings: result.perThousandViewsEarnings,
            breakdown: result.breakdown,
            factors: result.factors,
            tips: result.tips,
          },
        });
      } catch (error) {
        console.error('Failed to save calculation history:', error);
      }
    }
    
    // 跟踪分析事件
    try {
      track.calculatorUsage(input, result);
      
      // 额外的企业级分析
      track.event('enterprise_calculation_completed', 'calculator', 'enterprise', Math.round(result.monthlyEarnings || 0));
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
    
    // 返回结果
    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        features: {
          mlPrediction: options.useMLPrediction,
          riskAssessment: options.includeRiskAssessment,
          marketComparison: options.includeMarketComparison,
          abTesting: options.enableABTesting,
        },
      },
    });
    
  } catch (error) {
    console.error('Enterprise calculator API error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'enterprise-calculator-api');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while calculating earnings',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/calculator/enterprise/feedback
 * 记录用户反馈
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { calculationId, feedback } = body;
    
    if (!calculationId || !feedback) {
      return NextResponse.json(
        { error: 'Missing calculationId or feedback' },
        { status: 400 }
      );
    }

    // 验证反馈数据
    if (
      typeof feedback.accuracy !== 'number' ||
      typeof feedback.usefulness !== 'number' ||
      typeof feedback.satisfaction !== 'number' ||
      feedback.accuracy < 1 || feedback.accuracy > 5 ||
      feedback.usefulness < 1 || feedback.usefulness > 5 ||
      feedback.satisfaction < 1 || feedback.satisfaction > 5
    ) {
      return NextResponse.json(
        { error: 'Invalid feedback data. Ratings must be between 1 and 5.' },
        { status: 400 }
      );
    }

    // 获取用户会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 记录反馈
    await enterpriseCalculatorService.recordUserFeedback(
      calculationId,
      session.user.id,
      feedback
    );

    return NextResponse.json({
      success: true,
      message: 'Feedback recorded successfully',
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to record feedback',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/calculator/enterprise
 * 获取企业级功能状态和配置
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    switch (type) {
      case 'health':
        // 返回系统健康状态
        const health = enterpriseCalculatorService.getSystemHealth();
        return NextResponse.json({
          success: true,
          data: health,
        });
        
      case 'metrics':
        // 返回性能指标
        const timeRange = {
          start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24小时前
          end: new Date(),
        };
        const metrics = enterpriseCalculatorService.getPerformanceMetrics(timeRange);
        return NextResponse.json({
          success: true,
          data: metrics,
        });
        
      case 'features':
        // 返回功能开关状态
        return NextResponse.json({
          success: true,
          data: {
            mlPrediction: isFeatureEnabled('ML_PREDICTION'),
            realTimeData: isFeatureEnabled('REAL_TIME_DATA'),
            riskAssessment: isFeatureEnabled('RISK_ASSESSMENT'),
            abTesting: isFeatureEnabled('AB_TESTING'),
            monitoring: isFeatureEnabled('MONITORING'),
          },
        });
        
      default:
        // 返回企业级API信息
        return NextResponse.json({
          success: true,
          data: {
            version: '2.0.0',
            description: 'Enterprise TikTok Creator Earnings Calculator API',
            features: [
              'Machine Learning Predictions',
              'Real-time Market Data',
              'Risk Assessment',
              'A/B Testing',
              'Advanced Monitoring',
              'Growth Projections',
              'Market Comparison',
            ],
            endpoints: {
              calculate: 'POST /api/calculator/enterprise',
              feedback: 'PUT /api/calculator/enterprise',
              health: 'GET /api/calculator/enterprise?type=health',
              metrics: 'GET /api/calculator/enterprise?type=metrics',
              features: 'GET /api/calculator/enterprise?type=features',
            },
            lastUpdated: new Date().toISOString(),
          },
        });
    }
    
  } catch (error) {
    console.error('Enterprise calculator GET API error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while fetching data',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/calculator/enterprise
 * 处理CORS预检请求
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-ID',
      'Access-Control-Max-Age': '86400',
    },
  });
}
