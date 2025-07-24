import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { historyRepository } from '@/lib/db';
import { track } from '@/lib/analytics';
import { z } from 'zod';

// 导出请求验证schema
const exportSchema = z.object({
  userId: z.string(),
  format: z.enum(['csv', 'json', 'pdf']),
  filters: z.object({
    search: z.string().optional(),
    niche: z.string().optional(),
    location: z.string().optional(),
    platform: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }).optional(),
  options: z.object({
    includeInputData: z.boolean().default(true),
    includeResultData: z.boolean().default(true),
    includeMetadata: z.boolean().default(true),
    dateRange: z.enum(['all', 'last30', 'last90', 'custom']).default('all'),
  }).optional(),
});

/**
 * POST /api/history/export
 * 导出用户历史记录
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
    const validatedData = exportSchema.parse(body);

    // 验证用户权限
    if (validatedData.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Cannot export other user\'s data' },
        { status: 403 }
      );
    }

    // 构建查询选项
    const queryOptions: any = {};
    
    if (validatedData.filters) {
      Object.assign(queryOptions, validatedData.filters);
    }

    // 处理日期范围
    if (validatedData.options?.dateRange) {
      const now = new Date();
      switch (validatedData.options.dateRange) {
        case 'last30':
          queryOptions.dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last90':
          queryOptions.dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    // 获取所有匹配的历史记录
    const result = await historyRepository.getHistory(session.user.id, {
      ...queryOptions,
      limit: 10000, // 导出时不限制数量
    });

    // 根据格式生成文件
    let fileContent: string;
    let contentType: string;
    let filename: string;

    switch (validatedData.format) {
      case 'csv':
        fileContent = generateCSV(result.data, validatedData.options);
        contentType = 'text/csv';
        filename = `history-export-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      
      case 'json':
        fileContent = generateJSON(result.data, validatedData.options);
        contentType = 'application/json';
        filename = `history-export-${new Date().toISOString().split('T')[0]}.json`;
        break;
      
      case 'pdf':
        // PDF生成需要额外的库，这里先返回错误
        return NextResponse.json(
          { error: 'PDF export not implemented yet' },
          { status: 501 }
        );
      
      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        );
    }

    // 跟踪分析事件
    try {
      track.event('history_exported', 'user', validatedData.format, result.data.length);
    } catch (error) {
      console.error('Failed to track export:', error);
    }

    // 返回文件
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': Buffer.byteLength(fileContent, 'utf8').toString(),
      },
    });
    
  } catch (error) {
    console.error('Export history error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid export parameters',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'history-export');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while exporting history',
      },
      { status: 500 }
    );
  }
}

/**
 * 生成CSV格式的历史记录
 */
function generateCSV(records: any[], options: any = {}) {
  const headers = ['Date', 'Platform'];
  
  if (options?.includeInputData !== false) {
    headers.push('Followers', 'Engagement Rate', 'Content Niche', 'Audience Location');
  }
  
  if (options?.includeResultData !== false) {
    headers.push('Monthly Earnings', 'Yearly Earnings', 'CPM', 'Revenue Per Follower');
  }
  
  if (options?.includeMetadata !== false) {
    headers.push('Record ID', 'Created At');
  }

  const csvRows = [headers.join(',')];

  records.forEach(record => {
    const row = [
      new Date(record.createdAt).toLocaleDateString(),
      record.platform,
    ];

    if (options?.includeInputData !== false) {
      row.push(
        (record.input.metrics?.followers || record.input.metrics?.subscribers || 0).toString(),
        (record.input.metrics?.engagementRate || 0).toString(),
        record.input.profile?.contentNiche || '',
        record.input.profile?.audienceLocation || ''
      );
    }

    if (options?.includeResultData !== false) {
      row.push(
        (record.result.monthlyEarnings || 0).toString(),
        (record.result.yearlyEarnings || 0).toString(),
        (record.result.cpm || 0).toString(),
        (record.result.revenuePerFollower || 0).toString()
      );
    }

    if (options?.includeMetadata !== false) {
      row.push(
        record.id,
        new Date(record.createdAt).toISOString()
      );
    }

    csvRows.push(row.map(field => `"${field}"`).join(','));
  });

  return csvRows.join('\n');
}

/**
 * 生成JSON格式的历史记录
 */
function generateJSON(records: any[], options: any = {}) {
  const exportData = records.map(record => {
    const exportRecord: any = {
      id: record.id,
      platform: record.platform,
      createdAt: record.createdAt,
    };

    if (options?.includeInputData !== false) {
      exportRecord.input = record.input;
    }

    if (options?.includeResultData !== false) {
      exportRecord.result = record.result;
    }

    return exportRecord;
  });

  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    totalRecords: records.length,
    data: exportData,
  }, null, 2);
}
