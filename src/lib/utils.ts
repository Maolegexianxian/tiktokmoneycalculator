import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { zhCN, enUS, ja, ko, es, fr, de } from 'date-fns/locale';
import type { Locale } from '@/types';

/**
 * 合并Tailwind CSS类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化数字为货币格式
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    // 检查并处理无效值
    if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
      return `${currency} 0`;
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // 回退到基本格式
    const safeAmount = (typeof amount === 'number' && !isNaN(amount) && isFinite(amount)) ? amount : 0;
    return `${currency} ${safeAmount.toLocaleString()}`;
  }
}

/**
 * 格式化数字为标准格式
 */
export function formatNumber(
  num: number,
  locale: string = 'en-US'
): string {
  try {
    // 检查并处理无效值
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      return '0';
    }

    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    const safeNum = (typeof num === 'number' && !isNaN(num) && isFinite(num)) ? num : 0;
    return safeNum.toLocaleString();
  }
}

/**
 * 数值约束函数
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 计算数组平均值
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}



/**
 * 格式化数字为紧凑格式（如1.2K, 1.5M）
 */
export function formatCompactNumber(
  num: number,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num);
  } catch (error) {
    // 手动实现紧凑格式
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}

/**
 * 格式化百分比
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string,
  formatStr: string = 'PPP',
  locale: Locale = 'en'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }

  const localeMap = {
    en: enUS,
    zh: zhCN,
    ja: ja,
    ko: ko,
    es: es,
    fr: fr,
    de: de,
  };

  return format(dateObj, formatStr, {
    locale: localeMap[locale] || enUS,
  });
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(
  date: Date | string,
  locale: Locale = 'en'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }

  const localeMap = {
    en: enUS,
    zh: zhCN,
    ja: ja,
    ko: ko,
    es: es,
    fr: fr,
    de: de,
  };

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: localeMap[locale] || enUS,
  });
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证URL格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 生成随机ID
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 将字符串转换为slug格式
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

/**
 * 截断文本
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * 计算数组中位数
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return ((sorted[middle - 1] || 0) + (sorted[middle] || 0)) / 2;
  }

  return sorted[middle] || 0;
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * 将数值映射到新的范围
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * 检查对象是否为空
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  return Object.keys(obj).length === 0;
}

/**
 * 获取嵌套对象属性值
 */
export function get(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * 设置嵌套对象属性值
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key && (!(key in current) || typeof current[key] !== 'object')) {
      current[key] = {};
    }
    if (key) {
      current = current[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey) {
    current[lastKey] = value;
  }
}

/**
 * 合并多个对象
 */
export function merge<T extends Record<string, any>>(...objects: T[]): T {
  const result = {} as T;
  
  for (const obj of objects) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          typeof obj[key] === 'object' &&
          obj[key] !== null &&
          !Array.isArray(obj[key]) &&
          typeof result[key] === 'object' &&
          result[key] !== null &&
          !Array.isArray(result[key])
        ) {
          result[key] = merge(result[key], obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }
  }
  
  return result;
}

/**
 * 从数组中移除重复项
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * 按属性对对象数组进行分组
 */
export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * 异步延迟函数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试异步函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delay * attempt); // 指数退避
      }
    }
  }
  
  throw lastError!;
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 回退方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * 获取设备类型
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * 检查是否为移动设备
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 获取浏览器信息
 */
export function getBrowserInfo(): {
  name: string;
  version: string;
  os: string;
} {
  if (typeof window === 'undefined') {
    return { name: 'unknown', version: 'unknown', os: 'unknown' };
  }

  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  let browserVersion = 'unknown';
  let osName = 'unknown';

  // 检测浏览器
  if (userAgent.includes('Chrome')) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.includes('Safari')) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.includes('Edge')) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/Edge\/(\d+\.\d+)/)?.[1] || 'unknown';
  }

  // 检测操作系统
  if (userAgent.includes('Windows')) {
    osName = 'Windows';
  } else if (userAgent.includes('Mac')) {
    osName = 'macOS';
  } else if (userAgent.includes('Linux')) {
    osName = 'Linux';
  } else if (userAgent.includes('Android')) {
    osName = 'Android';
  } else if (userAgent.includes('iOS')) {
    osName = 'iOS';
  }

  return {
    name: browserName,
    version: browserVersion,
    os: osName,
  };
}

/**
 * 环境检测
 */
export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
};