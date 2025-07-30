import { NextRequest, NextResponse } from 'next/server';
import { calculateEarnings } from '@/lib/calculator';
import { CalculatorInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    console.log('Test calculator API called');
    
    // 创建一个简单的测试输入
    const testInput: CalculatorInput = {
      platform: 'tiktok',
      metrics: {
        followers: 10000,
        avgViews: 5000,
        avgLikes: 500,
        avgComments: 50,
        avgShares: 25,
        engagementRate: 5.75,
      },
      profile: {
        contentNiche: 'lifestyle',
        audienceLocation: 'us',
        postFrequency: 7,
        accountAge: 12,
      },
    };

    console.log('Test input:', testInput);

    // 执行计算
    const result = calculateEarnings(testInput);
    console.log('Test result:', result);

    // 验证结果
    if (!result || typeof result.monthlyEarnings !== 'number') {
      throw new Error('Invalid calculation result');
    }

    return NextResponse.json({
      success: true,
      input: testInput,
      result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Test calculator error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test calculator endpoint is working',
    timestamp: new Date().toISOString(),
  });
}
