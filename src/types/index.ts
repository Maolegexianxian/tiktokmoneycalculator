// 核心类型定义
export interface CalculatorInput {
  platform: 'tiktok' | 'instagram' | 'youtube';
  metrics: {
    // TikTok metrics
    followers?: number;
    avgViews?: number;
    avgLikes?: number;
    avgComments?: number;
    avgShares?: number;
    engagementRate?: number;

    // Instagram metrics
    avgStoryViews?: number;
    avgReelsViews?: number;

    // YouTube metrics
    subscribers?: number;
    avgWatchTime?: number;
    videoLength?: number;
    watchTimePercentage?: number;
  };
  profile: {
    contentNiche: string;
    audienceLocation: string;
    postFrequency?: number;
    uploadFrequency?: number;
    accountAge?: number;
    channelAge?: number;
    hasVerification?: boolean;
    monetizationEnabled?: boolean;
  };
}

// 兼容性类型定义（用于旧的计算器引擎）
export interface LegacyCalculatorInput {
  followers: number;
  engagementRate: number;
  niche: string;
  location: string;
  postFrequency: number;
  averageViews: number;
}

export interface CalculationResult {
  monthlyEarnings: number;
  yearlyEarnings: number;
  perPostEarnings: number;
  perThousandViewsEarnings: number;
  breakdown: EarningsBreakdown;
  factors: InfluencingFactors;
  tips: string[];
}

export interface EarningsBreakdown {
  creatorFund: number;
  liveGifts: number;
  brandPartnerships: number;
  affiliateMarketing: number;
  merchandise: number;
  other: number;
}

export interface InfluencingFactors {
  engagement: {
    score: number;
    impact: 'low' | 'medium' | 'high';
    description: string;
  };
  niche: {
    multiplier: number;
    impact: 'low' | 'medium' | 'high';
    description: string;
  };
  location: {
    multiplier: number;
    impact: 'low' | 'medium' | 'high';
    description: string;
  };
  consistency: {
    score: number;
    impact: 'low' | 'medium' | 'high';
    description: string;
  };
  quality: {
    score: number;
    impact: 'low' | 'medium' | 'high';
    description: string;
  };
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedCalculation {
  id: string;
  userId?: string;
  input: CalculatorInput;
  result: CalculationResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface HistoryRecord {
  id: string;
  userId?: string;
  platform: string;
  input: CalculatorInput;
  result: CalculationResult;
  createdAt: Date;
}

export interface PlatformConfig {
  id: string;
  platform: string;
  baseRate: number;
  minFollowers: number;
  maxFollowers: number;
  isActive: boolean;
  updatedAt: Date;
}

export interface NicheFactor {
  id: string;
  niche: string;
  multiplier: number;
  description: string;
  isActive: boolean;
}

export interface RegionFactor {
  id: string;
  region: string;
  multiplier: number;
  currency: string;
  isActive: boolean;
}

export interface IndustryBenchmark {
  id: string;
  metric: string;
  value: number;
  category: string;
  source: string;
  updatedAt: Date;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  updatedAt: Date;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 表单验证类型
export interface ValidationError {
  field: string;
  message: string;
}

// 国际化类型
export interface LocaleMessages {
  [key: string]: string | LocaleMessages;
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 语言类型
export type Locale = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de';

// 细分领域选项
export const NICHE_OPTIONS = [
  'lifestyle',
  'beauty',
  'fitness',
  'food',
  'travel',
  'tech',
  'gaming',
  'education',
  'comedy',
  'music',
  'business',
  'diy',
  'pets',
  'sports',
  'other'
] as const;

export type Niche = typeof NICHE_OPTIONS[number];

// 地理位置选项
export const LOCATION_OPTIONS = [
  'us',
  'uk',
  'ca',
  'au',
  'de',
  'fr',
  'es',
  'it',
  'nl',
  'se',
  'no',
  'dk',
  'fi',
  'jp',
  'kr',
  'cn',
  'in',
  'br',
  'mx',
  'ar',
  'other'
] as const;

export type Location = typeof LOCATION_OPTIONS[number];

// 计算器状态
export interface CalculatorState {
  input: Partial<CalculatorInput>;
  result: CalculationResult | null;
  isLoading: boolean;
  error: string | null;
  history: SavedCalculation[];
}

// 组件属性类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// 图表数据类型
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

// SEO元数据类型
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

// 分析事件类型
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

// 错误类型
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 环境变量类型
export interface EnvironmentVariables {
  DATABASE_URL: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  REDIS_URL?: string;
  SENTRY_DSN?: string;
  ANALYTICS_ID?: string;
}

// 配置类型
export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    url: string;
  };
  database: {
    url: string;
    maxConnections: number;
  };
  auth: {
    secret: string;
    sessionMaxAge: number;
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  features: {
    enableAnalytics: boolean;
    enableMonitoring: boolean;
    enableCaching: boolean;
  };
}

// 导出所有类型
// export * from './auth';
// export * from './calculator';
// export * from './database';