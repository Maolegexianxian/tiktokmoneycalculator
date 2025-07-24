import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { savedCalculationRepository } from '@/lib/db';
import { saveCalculationSchema, paginationSchema } from '@/lib/validations';
import { track } from '@/lib/analytics';


/**
 * GET /api/saved
 * 获取用户保存的计算结果
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
    const sort = searchParams.get('sort') || 'savedAt';
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
      filters.savedAt = {};
      if (dateFrom) {
        filters.savedAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filters.savedAt.$lte = new Date(dateTo);
      }
    }

    // 搜索条件（如果提供）
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'input.niche': { $regex: search, $options: 'i' } },
        { 'input.location': { $regex: search, $options: 'i' } },
      ];
    }

    // 获取保存的计算结果
    const result = await savedCalculationRepository.findByUserId(
      session.user.id,
      limit
    );

    // 跟踪分析事件
    try {
      track.event('saved_calculations_viewed', 'user', 'saved');
    } catch (error) {
      console.error('Failed to track saved calculations view:', error);
    }

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total: result.length,
        totalPages: Math.ceil(result.length / limit),
        hasNext: page * limit < result.length,
        hasPrev: page > 1,
      },
    });
    
  } catch (error) {
    console.error('Get saved calculations error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'saved-get');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while fetching saved calculations',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/saved
 * 保存计算结果
 */
export async function POST(request: NextRequest) {
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
    
    // 验证输入数据
    const validation = saveCalculationSchema.safeParse(body);
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

    const { input, result, name } = validation.data;

    // 检查用户保存的计算结果数量限制
    const userSavedCalculations = await savedCalculationRepository.findByUserId(session.user.id, 1000);
    const userSavedCount = userSavedCalculations.length;
    const maxSavedCalculations = 50; // 每个用户最多保存50个计算结果

    if (userSavedCount >= maxSavedCalculations) {
      return NextResponse.json(
        {
          error: 'Limit Exceeded',
          message: `You can only save up to ${maxSavedCalculations} calculations. Please delete some old ones first.`,
        },
        { status: 429 }
      );
    }

    // 生成默认名称（如果未提供）
    const calculationName = name || `Calculation ${new Date().toLocaleDateString()}`;

    // 保存计算结果
    const savedCalculation = await savedCalculationRepository.create({
      userId: session.user.id,
      name: calculationName,
      input,
      result,
      platform: input.platform,
    });

    // 跟踪分析事件
    try {
      track.resultSaved(savedCalculation.id);
    } catch (error) {
      console.error('Failed to track result saved:', error);
    }

    return NextResponse.json({
      success: true,
      data: savedCalculation,
      message: 'Calculation saved successfully',
    });
    
  } catch (error) {
    console.error('Save calculation error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'saved-post');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while saving calculation',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/saved
 * 删除保存的计算结果
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
      // 删除所有保存的计算结果
      const userCalculations = await savedCalculationRepository.findByUserId(session.user.id, 1000);
      for (const calc of userCalculations) {
        await savedCalculationRepository.delete(calc.id, session.user.id);
      }
      deletedCount = userCalculations.length;
    } else if (ids && Array.isArray(ids)) {
      // 删除指定的保存计算结果
      for (const id of ids) {
        const deleted = await savedCalculationRepository.delete(id, session.user.id);
        if (deleted) {
          deletedCount++;
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
      track.event('saved_calculations_deleted', 'user', 'saved', deletedCount);
    } catch (error) {
      console.error('Failed to track saved calculations deletion:', error);
    }

    return NextResponse.json({
      success: true,
      message: `${deletedCount} saved calculation(s) deleted successfully`,
      deletedCount,
    });
    
  } catch (error) {
    console.error('Delete saved calculations error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'saved-delete');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while deleting saved calculations',
      },
      { status: 500 }
    );
  }
}