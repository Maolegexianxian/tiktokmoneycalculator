import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { track } from '@/lib/analytics';

// Error report schema
const errorReportSchema = z.object({
  message: z.string().min(1, 'Error message is required'),
  stack: z.string().optional(),
  componentStack: z.string().optional(),
  errorId: z.string().optional(),
  timestamp: z.string(),
  userAgent: z.string(),
  url: z.string(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  context: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  tags: z.array(z.string()).optional(),
  additionalData: z.record(z.any()).optional(),
});

type ErrorReport = z.infer<typeof errorReportSchema>;

/**
 * POST /api/errors
 * Log client-side errors for monitoring and debugging
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate error report data
    const validation = errorReportSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid error report data',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const errorReport: ErrorReport = validation.data;

    // Get user session if available
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || errorReport.userId || 'anonymous';

    // Enhance error report with server-side data
    const enhancedReport = {
      ...errorReport,
      userId,
      serverTimestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      ip: getClientIP(request),
      headers: {
        'user-agent': request.headers.get('user-agent'),
        'referer': request.headers.get('referer'),
        'accept-language': request.headers.get('accept-language'),
      },
    };

    // Determine error severity based on message and stack
    const severity = determineSeverity(errorReport);
    enhancedReport.severity = severity;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error Report:', enhancedReport);
    }

    // Send to external error tracking service (e.g., Sentry, LogRocket)
    await sendToErrorTrackingService(enhancedReport);

    // Store in database for analysis
    await storeErrorReport(enhancedReport);

    // Send to analytics
    try {
      track.error(new Error(errorReport.message), 'client-error');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }

    // Send alerts for critical errors
    if (severity === 'critical') {
      await sendCriticalErrorAlert(enhancedReport);
    }

    return NextResponse.json({
      success: true,
      message: 'Error report received',
      errorId: errorReport.errorId,
    });

  } catch (error) {
    console.error('Error handling error report:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to process error report',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/errors
 * Retrieve error reports (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin access required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const severity = searchParams.get('severity');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');

    // Build filters
    const filters: any = {};
    
    if (severity) {
      filters.severity = severity;
    }
    
    if (dateFrom || dateTo) {
      filters.timestamp = {};
      if (dateFrom) {
        filters.timestamp.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filters.timestamp.$lte = new Date(dateTo);
      }
    }
    
    if (search) {
      filters.$or = [
        { message: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
        { errorId: { $regex: search, $options: 'i' } },
      ];
    }

    // Retrieve error reports from database
    const errorReports = await getErrorReports({
      filters,
      page,
      limit,
      sort: { timestamp: -1 },
    });

    return NextResponse.json({
      success: true,
      data: errorReports.data,
      pagination: {
        page: errorReports.page,
        limit: errorReports.limit,
        total: errorReports.total,
        totalPages: errorReports.totalPages,
      },
    });

  } catch (error) {
    console.error('Error retrieving error reports:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to retrieve error reports',
      },
      { status: 500 }
    );
  }
}

// Helper functions

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function determineSeverity(errorReport: ErrorReport): 'low' | 'medium' | 'high' | 'critical' {
  const { message, stack, url } = errorReport;
  
  // Critical errors
  if (
    message.includes('ChunkLoadError') ||
    message.includes('Network Error') ||
    message.includes('Failed to fetch') ||
    url.includes('/api/calculator')
  ) {
    return 'critical';
  }
  
  // High severity errors
  if (
    message.includes('TypeError') ||
    message.includes('ReferenceError') ||
    message.includes('SyntaxError') ||
    stack?.includes('at Calculator')
  ) {
    return 'high';
  }
  
  // Medium severity (default)
  return 'medium';
}

async function sendToErrorTrackingService(errorReport: any): Promise<void> {
  try {
    // Example: Send to Sentry
    if (process.env.SENTRY_DSN) {
      // Sentry integration would go here
      console.log('Would send to Sentry:', errorReport.errorId);
    }
    
    // Example: Send to LogRocket
    if (process.env.LOGROCKET_APP_ID) {
      // LogRocket integration would go here
      console.log('Would send to LogRocket:', errorReport.errorId);
    }
    
    // Example: Send to custom monitoring service
    if (process.env.MONITORING_WEBHOOK_URL) {
      await fetch(process.env.MONITORING_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    }
  } catch (error) {
    console.error('Failed to send to error tracking service:', error);
  }
}

async function storeErrorReport(errorReport: any): Promise<void> {
  try {
    // Store in database (implement based on your database choice)
    // This is a placeholder - implement actual database storage
    console.log('Would store error report in database:', errorReport.errorId);
  } catch (error) {
    console.error('Failed to store error report:', error);
  }
}

async function sendCriticalErrorAlert(errorReport: any): Promise<void> {
  try {
    // Send alert to team (email, Slack, etc.)
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `🚨 Critical Error Alert`,
          attachments: [
            {
              color: 'danger',
              fields: [
                {
                  title: 'Error ID',
                  value: errorReport.errorId,
                  short: true,
                },
                {
                  title: 'Message',
                  value: errorReport.message,
                  short: false,
                },
                {
                  title: 'URL',
                  value: errorReport.url,
                  short: true,
                },
                {
                  title: 'User ID',
                  value: errorReport.userId,
                  short: true,
                },
              ],
            },
          ],
        }),
      });
    }
  } catch (error) {
    console.error('Failed to send critical error alert:', error);
  }
}

function isAdmin(user: any): boolean {
  // Implement admin check based on your user model
  return user.role === 'admin' || user.email?.endsWith('@tiktokmoneycalculator.com');
}

async function getErrorReports(options: any): Promise<any> {
  // Implement database query based on your database choice
  // This is a placeholder
  return {
    data: [],
    page: options.page,
    limit: options.limit,
    total: 0,
    totalPages: 0,
  };
}
