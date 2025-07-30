import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { env } from './utils';

/**
 * API客户端配置
 */
const API_CONFIG = {
  baseURL: env.isClient ? '' : process.env.NEXTAUTH_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 创建Axios实例
 */
class ApiClient {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    this.instance = axios.create({
      ...API_CONFIG,
      ...config,
    });

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加认证头
        if (env.isClient && typeof window !== 'undefined') {
          const token = localStorage.getItem('auth-token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // 添加请求ID用于追踪
        config.headers['X-Request-ID'] = this.generateRequestId();

        // 开发环境日志
        if (env.isDevelopment) {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 开发环境日志
        if (env.isDevelopment) {
          console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }

        return response;
      },
      (error) => {
        // 统一错误处理
        const errorMessage = this.handleError(error);
        
        console.error('❌ API Error:', {
          message: errorMessage,
          status: error.response?.status,
          url: error.config?.url,
          data: error.response?.data,
        });

        return Promise.reject({
          message: errorMessage,
          status: error.response?.status || 500,
          data: error.response?.data,
        });
      }
    );
  }

  /**
   * 生成请求ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 错误处理
   */
  private handleError(error: any): string {
    if (error.response) {
      // 服务器响应错误
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return data?.message || 'Bad Request';
        case 401:
          return 'Unauthorized - Please login again';
        case 403:
          return 'Forbidden - You do not have permission';
        case 404:
          return 'Not Found';
        case 422:
          return data?.message || 'Validation Error';
        case 429:
          return 'Too Many Requests - Please try again later';
        case 500:
          return 'Internal Server Error';
        default:
          return data?.message || `HTTP Error ${status}`;
      }
    } else if (error.request) {
      // 网络错误
      return 'Network Error - Please check your connection';
    } else {
      // 其他错误
      return error.message || 'An unexpected error occurred';
    }
  }

  /**
   * GET请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT请求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PATCH请求
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 上传文件
   */
  async upload<T = any>(url: string, file: any, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.instance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 下载文件
   */
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.instance.get(url, {
        responseType: 'blob',
      });

      // 创建下载链接
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 取消请求
   */
  createCancelToken() {
    return axios.CancelToken.source();
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient();

/**
 * 计算器API服务
 */
export class CalculatorApiService {
  /**
   * 计算收益
   */
  static async calculate(input: any) {
    return apiClient.post('/api/calculate', input);
  }

  /**
   * 保存计算结果
   */
  static async saveCalculation(data: any) {
    return apiClient.post('/api/calculations/save', data);
  }

  /**
   * 获取计算历史
   */
  static async getHistory(limit?: number) {
    return apiClient.get(`/api/calculations/history${limit ? `?limit=${limit}` : ''}`);
  }

  /**
   * 删除计算记录
   */
  static async deleteCalculation(id: string) {
    return apiClient.delete(`/api/calculations/${id}`);
  }

  /**
   * 分享计算结果
   */
  static async shareCalculation(id: string) {
    return apiClient.post(`/api/calculations/${id}/share`);
  }

  /**
   * 获取行业基准数据
   */
  static async getBenchmarks(niche?: string, location?: string) {
    const params = new URLSearchParams();
    if (niche) params.append('niche', niche);
    if (location) params.append('location', location);
    
    return apiClient.get(`/api/benchmarks?${params.toString()}`);
  }
}

/**
 * 用户API服务
 */
export class UserApiService {
  /**
   * 获取用户资料
   */
  static async getProfile() {
    return apiClient.get('/api/user/profile');
  }

  /**
   * 更新用户资料
   */
  static async updateProfile(data: any) {
    return apiClient.patch('/api/user/profile', data);
  }

  /**
   * 更改密码
   */
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    return apiClient.post('/api/user/change-password', data);
  }

  /**
   * 删除账户
   */
  static async deleteAccount() {
    return apiClient.delete('/api/user/account');
  }

  /**
   * 获取用户统计
   */
  static async getStats() {
    return apiClient.get('/api/user/stats');
  }
}

/**
 * 反馈API服务
 */
export class FeedbackApiService {
  /**
   * 发送反馈
   */
  static async sendFeedback(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return apiClient.post('/api/feedback', data);
  }

  /**
   * 报告错误
   */
  static async reportError(data: {
    error: string;
    context: any;
    userAgent: string;
  }) {
    return apiClient.post('/api/feedback/error', data);
  }
}

/**
 * 分析API服务
 */
export class AnalyticsApiService {
  /**
   * 追踪事件
   */
  static async trackEvent(data: {
    action: string;
    category: string;
    label?: string;
    value?: number;
    customParameters?: Record<string, any>;
  }) {
    return apiClient.post('/api/analytics/event', data);
  }

  /**
   * 追踪页面浏览
   */
  static async trackPageView(data: {
    page: string;
    title: string;
    referrer?: string;
  }) {
    return apiClient.post('/api/analytics/pageview', data);
  }
}

/**
 * 通用API工具函数
 */
export const apiUtils = {
  /**
   * 构建查询参数
   */
  buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    return searchParams.toString();
  },

  /**
   * 处理API错误
   */
  handleApiError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.data?.message) {
      return error.data.message;
    }
    
    return 'An unexpected error occurred';
  },

  /**
   * 重试API请求
   */
  async retry<T>(
    apiCall: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  },

  /**
   * 批量API请求
   */
  async batch<T>(
    requests: Array<() => Promise<T>>,
    concurrency: number = 5
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchResults = await Promise.all(batch.map(request => request()));
      results.push(...batchResults);
    }
    
    return results;
  },

  /**
   * 检查网络状态
   */
  isOnline(): boolean {
    return env.isClient ? navigator.onLine : true;
  },

  /**
   * 等待网络恢复
   */
  async waitForOnline(): Promise<void> {
    if (!env.isClient) return;
    
    return new Promise((resolve) => {
      if (navigator.onLine) {
        resolve();
        return;
      }
      
      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };
      
      window.addEventListener('online', handleOnline);
    });
  },
};

/**
 * 创建自定义API客户端
 */
export function createApiClient(config?: AxiosRequestConfig): ApiClient {
  return new ApiClient(config);
}

/**
 * 导出类型
 */
export type { AxiosRequestConfig, AxiosResponse };
export { ApiClient };