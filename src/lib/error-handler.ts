/**
 * 企业级错误处理系统
 * 提供统一的错误处理、日志记录和监控
 */

import { NextRequest, NextResponse } from 'next/server';

// 错误类型定义
export enum ErrorCode {
  // 验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_JSON = 'INVALID_JSON',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // 计算错误
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  UNSUPPORTED_PLATFORM = 'UNSUPPORTED_PLATFORM',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  
  // 系统错误
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  
  // 网络错误
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  
  // 认证错误
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
}

// 错误严重程度
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// 企业级错误接口
export interface EnterpriseError {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  timestamp: string;
  requestId: string;
  userId?: string;
  details?: any;
  stack?: string;
  context?: {
    platform?: string;
    operation?: string;
    input?: any;
  };
}

// 错误响应接口
export interface ErrorResponse {
  success: false;
  error: EnterpriseError;
  metadata?: {
    version: string;
    environment: string;
    supportContact?: string;
  };
}

/**
 * 企业级错误处理类
 */
export class EnterpriseErrorHandler {
  private static instance: EnterpriseErrorHandler;
  
  static getInstance(): EnterpriseErrorHandler {
    if (!EnterpriseErrorHandler.instance) {
      EnterpriseErrorHandler.instance = new EnterpriseErrorHandler();
    }
    return EnterpriseErrorHandler.instance;
  }

  /**
   * 创建企业级错误
   */
  createError(
    code: ErrorCode,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: any,
    context?: any
  ): EnterpriseError {
    return {
      code,
      message,
      severity,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      details,
      context,
    };
  }

  /**
   * 处理和记录错误
   */
  handleError(
    error: Error | EnterpriseError,
    requestId: string,
    userId?: string,
    context?: any
  ): EnterpriseError {
    let enterpriseError: EnterpriseError;

    if (this.isEnterpriseError(error)) {
      enterpriseError = error;
      enterpriseError.requestId = requestId;
      if (userId) enterpriseError.userId = userId;
    } else {
      // 转换标准错误为企业级错误
      enterpriseError = {
        code: this.mapErrorToCode(error),
        message: error.message || 'Unknown error occurred',
        severity: this.determineSeverity(error),
        timestamp: new Date().toISOString(),
        requestId,
        userId,
        stack: error.stack,
        context,
      };
    }

    // 记录错误
    this.logError(enterpriseError);

    // 发送监控告警（如果是高严重程度）
    if (enterpriseError.severity === ErrorSeverity.HIGH || 
        enterpriseError.severity === ErrorSeverity.CRITICAL) {
      this.sendAlert(enterpriseError);
    }

    return enterpriseError;
  }

  /**
   * 创建错误响应
   */
  createErrorResponse(
    error: Error | EnterpriseError,
    statusCode: number,
    requestId: string,
    userId?: string,
    context?: any
  ): NextResponse {
    const enterpriseError = this.handleError(error, requestId, userId, context);
    
    const response: ErrorResponse = {
      success: false,
      error: enterpriseError,
      metadata: {
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        supportContact: 'support@tiktokmoneycalculator.com',
      },
    };

    // 在生产环境中隐藏敏感信息
    if (process.env.NODE_ENV === 'production') {
      delete response.error.stack;
      if (response.error.severity === ErrorSeverity.LOW) {
        delete response.error.details;
      }
    }

    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * 记录错误日志
   */
  private logError(error: EnterpriseError): void {
    const logLevel = this.getLogLevel(error.severity);
    const logMessage = `[${error.requestId}] ${error.code}: ${error.message}`;
    
    const logData = {
      ...error,
      environment: process.env.NODE_ENV,
      timestamp: error.timestamp,
    };

    switch (logLevel) {
      case 'error':
        console.error(logMessage, logData);
        break;
      case 'warn':
        console.warn(logMessage, logData);
        break;
      default:
        console.log(logMessage, logData);
    }

    // 在生产环境中，这里可以集成外部日志服务
    // 如 Sentry, LogRocket, DataDog 等
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogging(error);
    }
  }

  /**
   * 发送告警
   */
  private sendAlert(error: EnterpriseError): void {
    // 在生产环境中，这里可以集成告警系统
    // 如 PagerDuty, Slack, Email 等
    console.error(`🚨 ALERT: ${error.severity.toUpperCase()} ERROR`, {
      code: error.code,
      message: error.message,
      requestId: error.requestId,
      userId: error.userId,
      timestamp: error.timestamp,
    });
  }

  /**
   * 发送到外部日志服务
   */
  private sendToExternalLogging(error: EnterpriseError): void {
    // 集成外部日志服务
    // 例如：Sentry.captureException(error);
  }

  /**
   * 判断是否为企业级错误
   */
  private isEnterpriseError(error: any): error is EnterpriseError {
    return error && typeof error === 'object' && 'code' in error && 'severity' in error;
  }

  /**
   * 映射错误到错误代码
   */
  private mapErrorToCode(error: Error): ErrorCode {
    const message = error.message.toLowerCase();
    
    if (message.includes('validation')) return ErrorCode.VALIDATION_ERROR;
    if (message.includes('json')) return ErrorCode.INVALID_JSON;
    if (message.includes('timeout')) return ErrorCode.TIMEOUT_ERROR;
    if (message.includes('rate limit')) return ErrorCode.RATE_LIMIT_ERROR;
    if (message.includes('database')) return ErrorCode.DATABASE_ERROR;
    if (message.includes('calculation')) return ErrorCode.CALCULATION_ERROR;
    if (message.includes('platform')) return ErrorCode.UNSUPPORTED_PLATFORM;
    if (message.includes('auth')) return ErrorCode.AUTHENTICATION_ERROR;
    
    return ErrorCode.INTERNAL_ERROR;
  }

  /**
   * 确定错误严重程度
   */
  private determineSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) {
      return ErrorSeverity.CRITICAL;
    }
    if (message.includes('database') || message.includes('timeout')) {
      return ErrorSeverity.HIGH;
    }
    if (message.includes('validation') || message.includes('calculation')) {
      return ErrorSeverity.MEDIUM;
    }
    
    return ErrorSeverity.LOW;
  }

  /**
   * 获取日志级别
   */
  private getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      default:
        return 'info';
    }
  }

  /**
   * 生成请求ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出单例实例
export const errorHandler = EnterpriseErrorHandler.getInstance();

// 导出便捷函数
export function createErrorResponse(
  error: Error | EnterpriseError,
  statusCode: number = 500,
  requestId: string,
  userId?: string,
  context?: any
): NextResponse {
  return errorHandler.createErrorResponse(error, statusCode, requestId, userId, context);
}

export function handleError(
  error: Error | EnterpriseError,
  requestId: string,
  userId?: string,
  context?: any
): EnterpriseError {
  return errorHandler.handleError(error, requestId, userId, context);
}
