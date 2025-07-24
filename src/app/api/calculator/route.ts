import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCalculator } from '@/lib/calculator';
import { calculatorInputSchema } from '@/lib/validations';
import { historyRepository } from '@/lib/db';
import { track } from '@/lib/analytics';
import { CalculatorInput, CalculationResult } from '@/types';

/**
 * POST /api/calculator
 * 计算TikTok创作者收益
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
    
    // 确保必需字段存在
    const validatedData = validation.data;
    if (!validatedData.metrics.followers && validatedData.metrics.followers !== 0) {
      return NextResponse.json(
        { error: 'Followers count is required' },
        { status: 400 }
      );
    }

    // 构建清理后的metrics对象
    const cleanMetrics: CalculatorInput['metrics'] = {};

    // 只添加有值的字段
    if (validatedData.metrics.followers !== undefined) {
      cleanMetrics.followers = validatedData.metrics.followers;
    }
    if (validatedData.metrics.subscribers !== undefined) {
      cleanMetrics.subscribers = validatedData.metrics.subscribers;
    }
    if (validatedData.metrics.avgViews !== undefined) {
      cleanMetrics.avgViews = validatedData.metrics.avgViews;
    }
    if (validatedData.metrics.avgLikes !== undefined) {
      cleanMetrics.avgLikes = validatedData.metrics.avgLikes;
    }
    if (validatedData.metrics.avgComments !== undefined) {
      cleanMetrics.avgComments = validatedData.metrics.avgComments;
    }
    if (validatedData.metrics.avgShares !== undefined) {
      cleanMetrics.avgShares = validatedData.metrics.avgShares;
    }
    if (validatedData.metrics.engagementRate !== undefined) {
      cleanMetrics.engagementRate = validatedData.metrics.engagementRate;
    }
    if (validatedData.metrics.avgStoryViews !== undefined) {
      cleanMetrics.avgStoryViews = validatedData.metrics.avgStoryViews;
    }
    if (validatedData.metrics.avgReelsViews !== undefined) {
      cleanMetrics.avgReelsViews = validatedData.metrics.avgReelsViews;
    }
    if (validatedData.metrics.avgWatchTime !== undefined) {
      cleanMetrics.avgWatchTime = validatedData.metrics.avgWatchTime;
    }
    if (validatedData.metrics.videoLength !== undefined) {
      cleanMetrics.videoLength = validatedData.metrics.videoLength;
    }
    if (validatedData.metrics.watchTimePercentage !== undefined) {
      cleanMetrics.watchTimePercentage = validatedData.metrics.watchTimePercentage;
    }

    // 构建清理后的profile对象
    const cleanProfile: CalculatorInput['profile'] = {
      contentNiche: validatedData.profile.contentNiche,
      audienceLocation: validatedData.profile.audienceLocation,
    };

    // 只添加有值的可选字段
    if (validatedData.profile.postFrequency !== undefined) {
      cleanProfile.postFrequency = validatedData.profile.postFrequency;
    }
    if (validatedData.profile.uploadFrequency !== undefined) {
      cleanProfile.uploadFrequency = validatedData.profile.uploadFrequency;
    }
    if (validatedData.profile.accountAge !== undefined) {
      cleanProfile.accountAge = validatedData.profile.accountAge;
    }
    if (validatedData.profile.channelAge !== undefined) {
      cleanProfile.channelAge = validatedData.profile.channelAge;
    }
    if (validatedData.profile.hasVerification !== undefined) {
      cleanProfile.hasVerification = validatedData.profile.hasVerification;
    }
    if (validatedData.profile.monetizationEnabled !== undefined) {
      cleanProfile.monetizationEnabled = validatedData.profile.monetizationEnabled;
    }

    const input: CalculatorInput = {
      platform: validatedData.platform,
      metrics: cleanMetrics,
      profile: cleanProfile
    };

    // 执行计算
    const result: CalculationResult = createCalculator(input);
    
    // 获取用户会话（如果已登录）
    const session = await getServerSession(authOptions);
    
    // 保存计算历史（如果用户已登录）
    if (session?.user?.id) {
      try {
        await historyRepository.create({
          userId: session.user.id,
          platform: input.platform,
          input,
          result,
        });
      } catch (error) {
        console.error('Failed to save calculation history:', error);
        // 不影响主要功能，继续执行
      }
    }
    
    // 跟踪分析事件
    try {
      track.calculatorUsage(input, result);
    } catch (error) {
      console.error('Failed to track calculator usage:', error);
      // 不影响主要功能，继续执行
    }
    
    // 返回计算结果
    return NextResponse.json({
      success: true,
      data: {
        input,
        result,
        timestamp: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Calculator API error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'calculator-api');
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
 * GET /api/calculator
 * 获取计算器配置和元数据
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    switch (type) {
      case 'config':
        // 返回计算器配置
        return NextResponse.json({
          success: true,
          data: {
            limits: {
              followers: { min: 1000, max: 100000000 },
              engagementRate: { min: 0.1, max: 20 },
              postFrequency: { min: 1, max: 21 },
              averageViews: { min: 100, max: 1000000000 },
            },
            options: {
              niches: [
                'lifestyle',
                'beauty',
                'fashion',
                'food',
                'travel',
                'fitness',
                'gaming',
                'tech',
                'education',
                'entertainment',
                'music',
                'dance',
                'comedy',
                'pets',
                'diy',
                'business',
                'finance',
                'health',
                'sports',
                'art',
                'photography',
                'automotive',
                'parenting',
                'other',
              ],
              locations: [
                'us',
                'uk',
                'ca',
                'au',
                'de',
                'fr',
                'it',
                'es',
                'nl',
                'se',
                'no',
                'dk',
                'fi',
                'jp',
                'kr',
                'cn',
                'in',
                'br',
                'mx',
                'ar',
                'other',
              ],
            },
            defaults: {
              followers: 10000,
              engagementRate: 3.5,
              niche: 'lifestyle',
              location: 'us',
              postFrequency: 7,
              averageViews: 50000,
            },
          },
        });
        
      case 'benchmarks':
        // 返回行业基准数据
        return NextResponse.json({
          success: true,
          data: {
            averageEngagementRates: {
              'lifestyle': 4.2,
              'beauty': 3.8,
              'fashion': 3.5,
              'food': 4.1,
              'travel': 3.9,
              'fitness': 4.0,
              'gaming': 5.2,
              'tech': 2.8,
              'education': 3.2,
              'entertainment': 4.5,
              'music': 5.8,
              'dance': 6.1,
              'comedy': 5.5,
              'pets': 4.8,
              'diy': 3.6,
              'business': 2.5,
              'finance': 2.3,
              'health': 3.4,
              'sports': 4.3,
              'art': 3.7,
              'photography': 3.3,
              'automotive': 3.1,
              'parenting': 4.0,
              'other': 3.5,
            },
            averageEarningsPerFollower: {
              '1000-10000': 0.02,
              '10000-100000': 0.05,
              '100000-1000000': 0.08,
              '1000000+': 0.12,
            },
            topPerformingNiches: [
              'gaming',
              'music',
              'dance',
              'comedy',
              'pets',
            ],
          },
        });
        
      default:
        // 返回基本信息
        return NextResponse.json({
          success: true,
          data: {
            version: '1.0.0',
            description: 'TikTok Creator Earnings Calculator API',
            endpoints: {
              calculate: 'POST /api/calculator',
              config: 'GET /api/calculator?type=config',
              benchmarks: 'GET /api/calculator?type=benchmarks',
            },
            supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'],
            lastUpdated: new Date().toISOString(),
          },
        });
    }
    
  } catch (error) {
    console.error('Calculator API GET error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while fetching calculator data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
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