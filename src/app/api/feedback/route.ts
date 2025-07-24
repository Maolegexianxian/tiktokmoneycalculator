import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { feedbackSchema } from '@/lib/validations';
import { sendEmail } from '@/lib/email';
import { track } from '@/lib/analytics';
import { generateId } from '@/lib/utils';

/**
 * POST /api/feedback
 * 提交用户反馈
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 验证输入数据
    const validation = feedbackSchema.safeParse(body);
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

    const { name, email, subject, message, category } = validation.data;

    // 获取用户会话（如果已登录）
    const session = await getServerSession(authOptions);
    
    // 生成工单ID
    const ticketId = generateId();
    
    // 准备反馈数据
    const feedbackData = {
      id: ticketId,
      name,
      email,
      subject,
      message,
      category: category || 'general',
      userId: session?.user?.id || null,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 
          request.headers.get('x-real-ip') || 
          request.ip || 
          'unknown',
      submittedAt: new Date(),
    };

    try {
      // 发送确认邮件给用户
      await sendEmail.feedbackConfirmation(email, {
        name,
        subject,
        message,
        ticketId,
      });

      // 发送通知邮件给管理员
      await sendEmail.adminNotification({
        type: 'feedback',
        subject: `New Feedback: ${subject}`,
        content: `
          New feedback received from ${name} (${email}):
          
          Category: ${category || 'general'}
          Subject: ${subject}
          
          Message:
          ${message}
          
          User ID: ${session?.user?.id || 'Anonymous'}
          IP Address: ${feedbackData.ip}
          User Agent: ${feedbackData.userAgent}
        `,
        metadata: feedbackData,
      });
    } catch (emailError) {
      console.error('Failed to send feedback emails:', emailError);
      // 不阻止反馈提交，只记录错误
    }

    // 跟踪分析事件
    try {
      track.event('feedback_submitted', 'engagement', category || 'general');
    } catch (error) {
      console.error('Failed to track feedback submission:', error);
    }

    return NextResponse.json({
      success: true,
      data: {
        ticketId,
        message: 'Feedback submitted successfully',
        estimatedResponseTime: '24-48 hours',
      },
    });
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'feedback-submission');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while submitting feedback',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * 获取反馈类别和配置信息
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    switch (type) {
      case 'categories':
        return NextResponse.json({
          success: true,
          data: {
            categories: [
              {
                value: 'general',
                label: 'General Inquiry',
                description: 'General questions or comments',
              },
              {
                value: 'bug',
                label: 'Bug Report',
                description: 'Report a technical issue or bug',
              },
              {
                value: 'feature',
                label: 'Feature Request',
                description: 'Suggest a new feature or improvement',
              },
              {
                value: 'support',
                label: 'Technical Support',
                description: 'Get help with using the calculator',
              },
            ],
          },
        });
        
      case 'config':
        return NextResponse.json({
          success: true,
          data: {
            maxMessageLength: 1000,
            maxSubjectLength: 100,
            estimatedResponseTime: '24-48 hours',
            supportEmail: process.env.SUPPORT_EMAIL || 'support@tiktokcalculator.com',
            businessHours: {
              timezone: 'UTC',
              days: 'Monday - Friday',
              hours: '9:00 AM - 6:00 PM',
            },
          },
        });
        
      default:
        return NextResponse.json({
          success: true,
          data: {
            version: '1.0.0',
            description: 'TikTok Creator Calculator Feedback API',
            endpoints: {
              submit: 'POST /api/feedback',
              categories: 'GET /api/feedback?type=categories',
              config: 'GET /api/feedback?type=config',
            },
            supportedCategories: ['general', 'bug', 'feature', 'support'],
          },
        });
    }
    
  } catch (error) {
    console.error('Feedback API GET error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while fetching feedback data',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/feedback
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