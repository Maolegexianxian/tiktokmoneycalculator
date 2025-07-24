import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { historyRepository } from '@/lib/db';
import { track } from '@/lib/analytics';

/**
 * GET /api/history/stats
 * 获取用户历史记录统计信息
 */
export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // 解析查询参数（可选的过滤条件）
    const { searchParams } = new URL(request.url);
    const filters: any = {};
    
    const niche = searchParams.get('niche');
    const location = searchParams.get('location');
    const platform = searchParams.get('platform');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (niche) filters.niche = niche;
    if (location) filters.location = location;
    if (platform) filters.platform = platform;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    // 获取统计数据
    const stats = await historyRepository.getHistoryStats(session.user.id, filters);

    // 跟踪分析事件
    try {
      track.event('history_stats_viewed', 'user', 'history');
    } catch (error) {
      console.error('Failed to track stats view:', error);
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
    
  } catch (error) {
    console.error('Get history stats error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'history-stats');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while fetching history statistics',
      },
      { status: 500 }
    );
  }
}
