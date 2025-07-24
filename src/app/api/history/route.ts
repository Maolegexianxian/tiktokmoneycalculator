import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { historyRepository } from '@/lib/db';
import { paginationSchema } from '@/lib/validations';
import { track } from '@/lib/analytics';

/**
 * GET /api/history
 * 获取用户计算历史记录
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

    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'calculatedAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search') || '';
    const niche = searchParams.get('niche') || '';
    const location = searchParams.get('location') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // 验证分页参数
    const paginationValidation = paginationSchema.safeParse({
      page,
      limit,
      sort,
      order,
    });

    if (!paginationValidation.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid pagination parameters',
          details: paginationValidation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // 构建过滤条件
    const filters: any = {
      userId: session.user.id,
    };

    if (niche) {
      filters['input.niche'] = niche;
    }

    if (location) {
      filters['input.location'] = location;
    }

    if (dateFrom || dateTo) {
      filters.calculatedAt = {};
      if (dateFrom) {
        filters.calculatedAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filters.calculatedAt.$lte = new Date(dateTo);
      }
    }

    // 搜索条件（如果提供）
    if (search) {
      filters.$or = [
        { 'input.niche': { $regex: search, $options: 'i' } },
        { 'input.location': { $regex: search, $options: 'i' } },
      ];
    }

    // 构建查询选项
    const queryOptions: any = {
      page,
      limit,
      sortBy: sort,
      sortOrder: order as 'asc' | 'desc',
      search,
      niche,
      location,
    };

    // 只添加有值的日期字段
    if (dateFrom) {
      queryOptions.dateFrom = new Date(dateFrom);
    }
    if (dateTo) {
      queryOptions.dateTo = new Date(dateTo);
    }

    // 获取历史记录
    const result = await historyRepository.getHistory(session.user.id, queryOptions);

    // 跟踪分析事件
    try {
      track.event('history_viewed', 'user', 'history');
    } catch (error) {
      console.error('Failed to track history view:', error);
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,

      },
    });
    
  } catch (error) {
    console.error('Get history error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'history-get');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while fetching history',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/history
 * 删除用户的所有历史记录或指定记录
 */
export async function DELETE(request: NextRequest) {
  try {
    // 验证用户认证
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { ids, deleteAll } = body;

    let deletedCount = 0;

    if (deleteAll) {
      // 删除所有历史记录
      const result = await historyRepository.clearByUserId(session.user.id);
      deletedCount = result.count;
    } else if (ids && Array.isArray(ids)) {
      // 删除指定的历史记录
      for (const id of ids) {
        try {
          await historyRepository.delete(id);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete record ${id}:`, error);
        }
      }
    } else {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Either provide ids array or set deleteAll to true',
        },
        { status: 400 }
      );
    }

    // 跟踪分析事件
    try {
      track.event('history_deleted', 'user', 'history', deletedCount);
    } catch (error) {
      console.error('Failed to track history deletion:', error);
    }

    return NextResponse.json({
      success: true,
      message: `${deletedCount} history record(s) deleted successfully`,
      deletedCount,
    });
    
  } catch (error) {
    console.error('Delete history error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'history-delete');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while deleting history',
      },
      { status: 500 }
    );
  }
}