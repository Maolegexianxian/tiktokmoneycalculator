import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/cache';

/**
 * POST /api/cron/analytics
 * 定期分析数据收集和聚合任务
 */
export async function POST(request: NextRequest) {
  try {
    // 验证请求来源
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const startTime = Date.now();
    const results = {
      timestamp: new Date().toISOString(),
      tasks: [] as Array<{ name: string; status: string; data?: any; error?: string }>,
    };

    // 1. 计算每日用户统计
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);

      // 新用户注册数
      const newUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: yesterday,
            lte: endOfYesterday,
          },
        },
      });

      // 活跃用户数（有计算记录的用户）
      const activeUsers = await prisma.historyRecord.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: yesterday,
            lte: endOfYesterday,
          },
        },
      });

      // 计算总数
      const totalCalculations = await prisma.historyRecord.count({
        where: {
          createdAt: {
            gte: yesterday,
            lte: endOfYesterday,
          },
        },
      });

      // 按平台分组的计算数
      const calculationsByPlatform = await prisma.historyRecord.groupBy({
        by: ['platform'],
        where: {
          createdAt: {
            gte: yesterday,
            lte: endOfYesterday,
          },
        },
        _count: {
          id: true,
        },
      });

      const dailyStats = {
        date: yesterday.toISOString().split('T')[0],
        newUsers,
        activeUsers: activeUsers.length,
        totalCalculations,
        calculationsByPlatform: calculationsByPlatform.reduce((acc, item) => {
          acc[item.platform] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
      };

      // 缓存统计数据
      await cache.set(
        `daily-stats:${dailyStats.date}`,
        JSON.stringify(dailyStats),
        60 * 60 * 24 * 30 // 30天
      );

      results.tasks.push({
        name: 'daily_user_stats',
        status: 'success',
        data: dailyStats,
      });
    } catch (error) {
      results.tasks.push({
        name: 'daily_user_stats',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // 2. 计算平台使用趋势
    try {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const platformTrends = await prisma.historyRecord.groupBy({
        by: ['platform'],
        where: {
          createdAt: {
            gte: last30Days,
          },
        },
        _count: {
          id: true,
        },
      });

      await cache.set(
        'platform-trends-30d',
        JSON.stringify(platformTrends),
        60 * 60 * 24 // 24小时
      );

      results.tasks.push({
        name: 'platform_trends',
        status: 'success',
        data: platformTrends,
      });
    } catch (error) {
      results.tasks.push({
        name: 'platform_trends',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // 3. 计算用户留存率
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      // 7天前注册的用户
      const usersWeekAgo = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: fourteenDaysAgo,
            lt: sevenDaysAgo,
          },
        },
        select: {
          id: true,
        },
      });

      // 这些用户中在过去7天内有活动的
      const activeUsersFromWeekAgo = await prisma.historyRecord.groupBy({
        by: ['userId'],
        where: {
          userId: {
            in: usersWeekAgo.map(u => u.id),
          },
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      });

      const retentionRate = usersWeekAgo.length > 0 
        ? (activeUsersFromWeekAgo.length / usersWeekAgo.length) * 100 
        : 0;

      const retentionData = {
        cohortSize: usersWeekAgo.length,
        activeUsers: activeUsersFromWeekAgo.length,
        retentionRate: Math.round(retentionRate * 100) / 100,
        period: '7-day',
      };

      await cache.set(
        'user-retention-7d',
        JSON.stringify(retentionData),
        60 * 60 * 24 // 24小时
      );

      results.tasks.push({
        name: 'user_retention',
        status: 'success',
        data: retentionData,
      });
    } catch (error) {
      results.tasks.push({
        name: 'user_retention',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // 4. 生成系统健康报告
    try {
      const totalUsers = await prisma.user.count();
      const totalCalculations = await prisma.historyRecord.count();
      const totalSavedCalculations = await prisma.savedCalculation.count();

      const systemHealth = {
        totalUsers,
        totalCalculations,
        totalSavedCalculations,
        timestamp: new Date().toISOString(),
      };

      await cache.set(
        'system-health',
        JSON.stringify(systemHealth),
        60 * 60 * 6 // 6小时
      );

      results.tasks.push({
        name: 'system_health',
        status: 'success',
        data: systemHealth,
      });
    } catch (error) {
      results.tasks.push({
        name: 'system_health',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    const duration = Date.now() - startTime;
    const successCount = results.tasks.filter(task => task.status === 'success').length;
    const errorCount = results.tasks.filter(task => task.status === 'error').length;

    console.log(`Analytics cron completed in ${duration}ms: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json({
      ...results,
      duration: `${duration}ms`,
      summary: {
        total: results.tasks.length,
        success: successCount,
        errors: errorCount,
      },
    });

  } catch (error) {
    console.error('Analytics cron job failed:', error);
    
    return NextResponse.json(
      {
        error: 'Analytics cron failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/analytics
 * 获取分析任务状态
 */
export async function GET() {
  return NextResponse.json({
    message: 'Analytics cron job endpoint',
    schedule: 'Daily at 1:00 AM UTC',
    tasks: [
      'daily_user_stats',
      'platform_trends',
      'user_retention',
      'system_health',
    ],
  });
}
