import { AnalyticsEvent } from '@/types';
import { ANALYTICS_EVENTS } from './constants';
import { env } from './utils';

interface PageView {
  page: string;
  title: string;
  referrer?: string;
}

/**
 * Google Analytics 配置
 */
interface GAConfig {
  trackingId: string;
  debug?: boolean;
  anonymizeIp?: boolean;
  sampleRate?: number;
}

/**
 * 自定义事件参数
 */
interface CustomEventParams {
  [key: string]: string | number | boolean;
}

/**
 * 分析服务类
 */
class AnalyticsService {
  private gaConfig: GAConfig | null = null;
  private isInitialized = false;
  private eventQueue: AnalyticsEvent[] = [];
  private pageViewQueue: PageView[] = [];

  /**
   * 初始化分析服务
   */
  async initialize(config: GAConfig): Promise<void> {
    if (!env.isClient || this.isInitialized) {
      return;
    }

    this.gaConfig = config;

    try {
      // 加载 Google Analytics
      await this.loadGoogleAnalytics();
      
      // 配置 GA
      this.configureGA();
      
      // 处理队列中的事件
      this.processEventQueue();
      this.processPageViewQueue();
      
      this.isInitialized = true;
      
      if (env.isDevelopment) {
        console.log('Analytics initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * 加载 Google Analytics 脚本
   */
  private async loadGoogleAnalytics(): Promise<void> {
    if (!this.gaConfig) return;

    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (typeof window.gtag === 'function') {
        resolve();
        return;
      }

      // 创建脚本标签
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaConfig?.trackingId}`;
      
      script.onload = () => {
        // 初始化 gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        
        window.gtag('js', new Date());
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Analytics'));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * 配置 Google Analytics
   */
  private configureGA(): void {
    if (!this.gaConfig || typeof window.gtag !== 'function') return;

    window.gtag('config', this.gaConfig.trackingId, {
      debug_mode: this.gaConfig.debug || env.isDevelopment,
      anonymize_ip: this.gaConfig.anonymizeIp || true,
      sample_rate: this.gaConfig.sampleRate || 100,
      send_page_view: false, // 手动控制页面浏览
    });
  }

  /**
   * 跟踪页面浏览
   */
  trackPageView(pageView: PageView): void {
    if (!this.isInitialized) {
      this.pageViewQueue.push(pageView);
      return;
    }

    if (typeof window.gtag !== 'function') {
      if (env.isDevelopment) {
        console.warn('Google Analytics not loaded');
      }
      return;
    }

    try {
      window.gtag('event', 'page_view', {
        page_title: pageView.title,
        page_location: pageView.page,
        page_referrer: pageView.referrer,
      });

      if (env.isDevelopment) {
        console.log('Page view tracked:', pageView);
      }
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  /**
   * 跟踪自定义事件
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      this.eventQueue.push(event);
      return;
    }

    if (typeof window.gtag !== 'function') {
      if (env.isDevelopment) {
        console.warn('Google Analytics not loaded');
      }
      return;
    }

    try {
      const eventParams: CustomEventParams = {
        event_category: event.category,
        event_label: event.label || '',
        value: event.value || 0,
        ...event.customParameters,
      };

      window.gtag('event', event.action, eventParams);

      if (env.isDevelopment) {
        console.log('Event tracked:', event);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * 跟踪计算器使用
   */
  trackCalculatorUsage(input: any, result: any): void {
    this.trackEvent({
      action: ANALYTICS_EVENTS.CALCULATION_COMPLETED,
      category: 'calculator',
      label: `${input.niche}_${input.location}`,
      value: Math.round(result.monthlyEarnings),
      customParameters: {
        followers: input.followers,
        engagement_rate: input.engagementRate,
        niche: input.niche,
        location: input.location,
        post_frequency: input.postFrequency,
        average_views: input.averageViews,
      },
    });
  }

  /**
   * 跟踪结果保存
   */
  trackResultSaved(calculationId: string): void {
    this.trackEvent({
      action: ANALYTICS_EVENTS.CALCULATION_SAVED,
      category: 'engagement',
      label: calculationId,
    });
  }

  /**
   * 跟踪结果分享
   */
  trackResultShared(platform: string): void {
    this.trackEvent({
      action: ANALYTICS_EVENTS.CALCULATION_SHARED,
      category: 'engagement',
      label: platform,
    });
  }

  /**
   * 跟踪用户注册
   */
  trackUserRegistration(method: string): void {
    this.trackEvent({
      action: ANALYTICS_EVENTS.FORM_SUBMIT,
      category: 'user',
      label: method,
    });
  }

  /**
   * 跟踪用户登录
   */
  trackUserLogin(method: string): void {
    this.trackEvent({
      action: ANALYTICS_EVENTS.FORM_SUBMIT,
      category: 'user',
      label: method,
    });
  }

  /**
   * 跟踪错误
   */
  trackError(error: Error, context?: string): void {
    this.trackEvent({
      action: 'error',
      category: 'error',
      label: `${context || 'unknown'}: ${error.message}`,
      customParameters: {
        error_name: error.name,
        error_stack: error.stack?.substring(0, 500) || '',
      },
    });
  }

  /**
   * 跟踪性能指标
   */
  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.trackEvent({
      action: 'performance',
      category: 'performance',
      label: `${metric}_${unit}`,
      value: Math.round(value),
    });
  }

  /**
   * 处理事件队列
   */
  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.trackEvent(event);
      }
    }
  }

  /**
   * 处理页面浏览队列
   */
  private processPageViewQueue(): void {
    while (this.pageViewQueue.length > 0) {
      const pageView = this.pageViewQueue.shift();
      if (pageView) {
        this.trackPageView(pageView);
      }
    }
  }

  /**
   * 设置用户属性
   */
  setUserProperties(properties: Record<string, string | number | boolean>): void {
    if (typeof window.gtag !== 'function') return;

    try {
      window.gtag('config', this.gaConfig?.trackingId || '', {
        custom_map: properties,
      });

      if (env.isDevelopment) {
        console.log('User properties set:', properties);
      }
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  }

  /**
   * 获取客户端ID
   */
  getClientId(): Promise<string | null> {
    return new Promise((resolve) => {
      if (typeof window.gtag !== 'function') {
        resolve(null);
        return;
      }

      try {
        window.gtag('get', this.gaConfig?.trackingId || '', 'client_id', (clientId: string) => {
          resolve(clientId);
        });
      } catch (error) {
        console.error('Failed to get client ID:', error);
        resolve(null);
      }
    });
  }
}

/**
 * 性能监控类
 */
class PerformanceMonitor {
  private observer: PerformanceObserver | null = null;
  private metrics: Map<string, number> = new Map();

  /**
   * 初始化性能监控
   */
  initialize(): void {
    if (!env.isClient || !window.PerformanceObserver) {
      return;
    }

    try {
      // 监控 Web Vitals
      this.observeWebVitals();
      
      // 监控导航时间
      this.observeNavigationTiming();
      
      // 监控资源加载时间
      this.observeResourceTiming();
      
      if (env.isDevelopment) {
        console.log('Performance monitoring initialized');
      }
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  /**
   * 监控 Web Vitals
   */
  private observeWebVitals(): void {
    if (!window.PerformanceObserver) return;

    // LCP (Largest Contentful Paint)
    this.createObserver('largest-contentful-paint', (entries) => {
      const lcp = entries[entries.length - 1];
      if (lcp) {
        this.recordMetric('LCP', lcp.startTime);
        analytics.trackPerformance('LCP', lcp.startTime);
      }
    });

    // FID (First Input Delay)
    this.createObserver('first-input', (entries) => {
      const fid = entries[0];
      if (fid) {
        const delay = (fid as any).processingStart - fid.startTime;
        this.recordMetric('FID', delay);
        analytics.trackPerformance('FID', delay);
      }
    });

    // CLS (Cumulative Layout Shift)
    this.createObserver('layout-shift', (entries) => {
      let cls = 0;
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value;
        }
      });
      this.recordMetric('CLS', cls);
      analytics.trackPerformance('CLS', cls, 'score');
    });
  }

  /**
   * 监控导航时间
   */
  private observeNavigationTiming(): void {
    if (!window.PerformanceObserver) return;

    this.createObserver('navigation', (entries) => {
      entries.forEach((entry) => {
        const navigation = entry as PerformanceNavigationTiming;
        
        // DNS 查询时间
        const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart;
        this.recordMetric('DNS', dnsTime);
        analytics.trackPerformance('DNS', dnsTime);
        
        // TCP 连接时间
        const tcpTime = navigation.connectEnd - navigation.connectStart;
        this.recordMetric('TCP', tcpTime);
        analytics.trackPerformance('TCP', tcpTime);
        
        // 请求响应时间
        const requestTime = navigation.responseEnd - navigation.requestStart;
        this.recordMetric('Request', requestTime);
        analytics.trackPerformance('Request', requestTime);
        
        // DOM 解析时间
        const domParseTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        this.recordMetric('DOMParse', domParseTime);
        analytics.trackPerformance('DOMParse', domParseTime);
        
        // 页面加载时间
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        this.recordMetric('Load', loadTime);
        analytics.trackPerformance('Load', loadTime);
      });
    });
  }

  /**
   * 监控资源加载时间
   */
  private observeResourceTiming(): void {
    if (!window.PerformanceObserver) return;

    this.createObserver('resource', (entries) => {
      entries.forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        const duration = resource.responseEnd - resource.startTime;
        
        // 按资源类型分类
        const resourceType = this.getResourceType(resource.name);
        this.recordMetric(`Resource_${resourceType}`, duration);
        
        // 只跟踪较慢的资源
        if (duration > 1000) {
          analytics.trackPerformance(`Resource_${resourceType}`, duration);
        }
      });
    });
  }

  /**
   * 创建性能观察器
   */
  private createObserver(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ type, buffered: true });
    } catch (error) {
      console.error(`Failed to create observer for ${type}:`, error);
    }
  }

  /**
   * 记录指标
   */
  private recordMetric(name: string, value: number): void {
    this.metrics.set(name, value);
    
    if (env.isDevelopment) {
      console.log(`Performance metric - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  /**
   * 获取资源类型
   */
  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'JavaScript';
    if (url.includes('.css')) return 'CSS';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'Image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'Font';
    if (url.includes('api/')) return 'API';
    return 'Other';
  }

  /**
   * 获取所有指标
   */
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * 清除指标
   */
  clearMetrics(): void {
    this.metrics.clear();
  }
}

/**
 * 错误监控类
 */
class ErrorMonitor {
  private errorCount = 0;
  private maxErrors = 50; // 最大错误数量

  /**
   * 初始化错误监控
   */
  initialize(): void {
    if (!env.isClient) return;

    // 监控 JavaScript 错误
    window.addEventListener('error', this.handleError.bind(this));
    
    // 监控 Promise 拒绝
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    
    if (env.isDevelopment) {
      console.log('Error monitoring initialized');
    }
  }

  /**
   * 处理 JavaScript 错误
   */
  private handleError(event: ErrorEvent): void {
    if (this.errorCount >= this.maxErrors) return;
    
    this.errorCount++;
    
    const error = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    };
    
    analytics.trackError(new Error(error.message), 'JavaScript');
    
    if (env.isDevelopment) {
      console.error('JavaScript error:', error);
    }
  }

  /**
   * 处理 Promise 拒绝
   */
  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    if (this.errorCount >= this.maxErrors) return;
    
    this.errorCount++;
    
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    analytics.trackError(error, 'Promise');
    
    if (env.isDevelopment) {
      console.error('Unhandled promise rejection:', error);
    }
  }

  /**
   * 手动报告错误
   */
  reportError(error: Error, context?: string): void {
    if (this.errorCount >= this.maxErrors) return;
    
    this.errorCount++;
    analytics.trackError(error, context);
  }

  /**
   * 重置错误计数
   */
  resetErrorCount(): void {
    this.errorCount = 0;
  }
}

// 创建全局实例
export const analytics = new AnalyticsService();
export const performanceMonitor = new PerformanceMonitor();
export const errorMonitor = new ErrorMonitor();

/**
 * 初始化所有监控服务
 */
export const initializeMonitoring = async (): Promise<void> => {
  if (!env.isClient) return;

  try {
    // 初始化分析服务
    const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
    if (trackingId) {
      await analytics.initialize({
        trackingId,
        debug: env.isDevelopment,
        anonymizeIp: true,
        sampleRate: env.isDevelopment ? 100 : 10,
      });
    }

    // 初始化性能监控
    performanceMonitor.initialize();
    
    // 初始化错误监控
    errorMonitor.initialize();
    
    if (env.isDevelopment) {
      console.log('All monitoring services initialized');
    }
  } catch (error) {
    console.error('Failed to initialize monitoring:', error);
  }
};

/**
 * 便捷的跟踪函数
 */
export const track = {
  pageView: (page: string, title: string, referrer?: string) => {
    analytics.trackPageView({ page, title, ...(referrer && { referrer }) });
  },
  
  event: (action: string, category: string, label?: string, value?: number) => {
    analytics.trackEvent({
      action,
      category,
      ...(label && { label }),
      ...(value !== undefined && { value })
    });
  },
  
  calculatorUsage: (input: any, result: any) => {
    analytics.trackCalculatorUsage(input, result);
  },
  
  resultSaved: (calculationId: string) => {
    analytics.trackResultSaved(calculationId);
  },
  
  resultShared: (platform: string) => {
    analytics.trackResultShared(platform);
  },
  
  userRegistration: (method: string) => {
    analytics.trackUserRegistration(method);
  },
  
  userLogin: (method: string) => {
    analytics.trackUserLogin(method);
  },
  
  error: (error: Error, context?: string) => {
    analytics.trackError(error, context);
  },
  
  performance: (metric: string, value: number, unit?: string) => {
    analytics.trackPerformance(metric, value, unit);
  },
};

// 扩展 Window 接口
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}