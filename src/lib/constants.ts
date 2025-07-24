// 内容细分领域选项
export const CONTENT_NICHES = [
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'food', name: 'Food', icon: '🍕' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'tech', name: 'Technology', icon: '💻' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'diy', name: 'DIY', icon: '🔨' },
  { id: 'pets', name: 'Pets', icon: '🐕' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'other', name: 'Other', icon: '📱' },
] as const;

// 受众地理位置选项
export const AUDIENCE_LOCATIONS = [
  { id: 'us', name: 'United States', flag: '🇺🇸' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'ca', name: 'Canada', flag: '🇨🇦' },
  { id: 'au', name: 'Australia', flag: '🇦🇺' },
  { id: 'de', name: 'Germany', flag: '🇩🇪' },
  { id: 'fr', name: 'France', flag: '🇫🇷' },
  { id: 'es', name: 'Spain', flag: '🇪🇸' },
  { id: 'it', name: 'Italy', flag: '🇮🇹' },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { id: 'se', name: 'Sweden', flag: '🇸🇪' },
  { id: 'no', name: 'Norway', flag: '🇳🇴' },
  { id: 'dk', name: 'Denmark', flag: '🇩🇰' },
  { id: 'fi', name: 'Finland', flag: '🇫🇮' },
  { id: 'jp', name: 'Japan', flag: '🇯🇵' },
  { id: 'kr', name: 'South Korea', flag: '🇰🇷' },
  { id: 'cn', name: 'China', flag: '🇨🇳' },
  { id: 'in', name: 'India', flag: '🇮🇳' },
  { id: 'br', name: 'Brazil', flag: '🇧🇷' },
  { id: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { id: 'ar', name: 'Argentina', flag: '🇦🇷' },
  { id: 'other', name: 'Other', flag: '🌍' },
] as const;

type Niche = typeof CONTENT_NICHES[number]['id'];
type Location = typeof AUDIENCE_LOCATIONS[number]['id'];

// 应用配置
export const APP_CONFIG = {
  name: 'TikTok Creator Calculator',
  description: 'Calculate your potential earnings as a TikTok creator',
  version: '1.0.0',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  author: 'TikTok Creator Calculator Team',
  keywords: [
    'tiktok',
    'creator',
    'monetization',
    'calculator',
    'earnings',
    'influencer',
    'social media',
  ],
} as const;

// 网站配置（兼容性别名）
export const SITE_CONFIG = APP_CONFIG;

// 支持的语言
export const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de'] as const;

export const LOCALE_CONFIG = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
] as const;

// 默认语言
export const DEFAULT_LOCALE = 'en' as const;

// 简化的细分领域选项（用于向后兼容）
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
  'other',
] as const;

// 简化的地理位置选项（用于向后兼容）
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
  'other',
] as const;

// 细分领域配置
export const NICHE_CONFIG: Record<Niche, {
  multiplier: number;
  description: string;
  averageEngagement: number;
  topCreatorEarnings: number;
}> = {
  lifestyle: {
    multiplier: 1.0,
    description: 'General lifestyle content',
    averageEngagement: 3.5,
    topCreatorEarnings: 50000,
  },
  beauty: {
    multiplier: 1.4,
    description: 'Beauty and cosmetics content',
    averageEngagement: 4.2,
    topCreatorEarnings: 80000,
  },
  fitness: {
    multiplier: 1.2,
    description: 'Fitness and health content',
    averageEngagement: 3.8,
    topCreatorEarnings: 60000,
  },
  food: {
    multiplier: 1.1,
    description: 'Food and cooking content',
    averageEngagement: 4.0,
    topCreatorEarnings: 55000,
  },
  travel: {
    multiplier: 1.3,
    description: 'Travel and adventure content',
    averageEngagement: 3.9,
    topCreatorEarnings: 70000,
  },
  tech: {
    multiplier: 1.5,
    description: 'Technology and gadgets content',
    averageEngagement: 3.2,
    topCreatorEarnings: 90000,
  },
  gaming: {
    multiplier: 1.3,
    description: 'Gaming and esports content',
    averageEngagement: 4.5,
    topCreatorEarnings: 75000,
  },
  education: {
    multiplier: 1.1,
    description: 'Educational and tutorial content',
    averageEngagement: 3.0,
    topCreatorEarnings: 45000,
  },
  comedy: {
    multiplier: 1.0,
    description: 'Comedy and entertainment content',
    averageEngagement: 5.0,
    topCreatorEarnings: 65000,
  },
  music: {
    multiplier: 1.2,
    description: 'Music and dance content',
    averageEngagement: 4.8,
    topCreatorEarnings: 70000,
  },
  business: {
    multiplier: 1.6,
    description: 'Business and finance content',
    averageEngagement: 2.8,
    topCreatorEarnings: 100000,
  },
  diy: {
    multiplier: 1.1,
    description: 'DIY and crafts content',
    averageEngagement: 3.6,
    topCreatorEarnings: 40000,
  },
  pets: {
    multiplier: 1.0,
    description: 'Pet and animal content',
    averageEngagement: 4.3,
    topCreatorEarnings: 50000,
  },
  sports: {
    multiplier: 1.2,
    description: 'Sports and athletics content',
    averageEngagement: 3.7,
    topCreatorEarnings: 65000,
  },
  other: {
    multiplier: 1.0,
    description: 'Other content categories',
    averageEngagement: 3.5,
    topCreatorEarnings: 45000,
  },
};

// 地理位置配置
export const LOCATION_CONFIG: Record<Location, {
  multiplier: number;
  currency: string;
  averageCPM: number;
  marketMaturity: 'high' | 'medium' | 'low';
}> = {
  us: {
    multiplier: 1.0,
    currency: 'USD',
    averageCPM: 2.5,
    marketMaturity: 'high',
  },
  uk: {
    multiplier: 0.9,
    currency: 'GBP',
    averageCPM: 2.2,
    marketMaturity: 'high',
  },
  ca: {
    multiplier: 0.8,
    currency: 'CAD',
    averageCPM: 2.0,
    marketMaturity: 'high',
  },
  au: {
    multiplier: 0.8,
    currency: 'AUD',
    averageCPM: 1.9,
    marketMaturity: 'high',
  },
  de: {
    multiplier: 0.7,
    currency: 'EUR',
    averageCPM: 1.8,
    marketMaturity: 'high',
  },
  fr: {
    multiplier: 0.7,
    currency: 'EUR',
    averageCPM: 1.7,
    marketMaturity: 'high',
  },
  es: {
    multiplier: 0.6,
    currency: 'EUR',
    averageCPM: 1.5,
    marketMaturity: 'medium',
  },
  it: {
    multiplier: 0.6,
    currency: 'EUR',
    averageCPM: 1.4,
    marketMaturity: 'medium',
  },
  nl: {
    multiplier: 0.7,
    currency: 'EUR',
    averageCPM: 1.8,
    marketMaturity: 'high',
  },
  se: {
    multiplier: 0.7,
    currency: 'SEK',
    averageCPM: 1.6,
    marketMaturity: 'high',
  },
  no: {
    multiplier: 0.8,
    currency: 'NOK',
    averageCPM: 1.9,
    marketMaturity: 'high',
  },
  dk: {
    multiplier: 0.7,
    currency: 'DKK',
    averageCPM: 1.7,
    marketMaturity: 'high',
  },
  fi: {
    multiplier: 0.7,
    currency: 'EUR',
    averageCPM: 1.6,
    marketMaturity: 'high',
  },
  jp: {
    multiplier: 0.8,
    currency: 'JPY',
    averageCPM: 1.8,
    marketMaturity: 'high',
  },
  kr: {
    multiplier: 0.7,
    currency: 'KRW',
    averageCPM: 1.5,
    marketMaturity: 'high',
  },
  cn: {
    multiplier: 0.4,
    currency: 'CNY',
    averageCPM: 0.8,
    marketMaturity: 'medium',
  },
  in: {
    multiplier: 0.3,
    currency: 'INR',
    averageCPM: 0.5,
    marketMaturity: 'medium',
  },
  br: {
    multiplier: 0.4,
    currency: 'BRL',
    averageCPM: 0.7,
    marketMaturity: 'medium',
  },
  mx: {
    multiplier: 0.4,
    currency: 'MXN',
    averageCPM: 0.6,
    marketMaturity: 'medium',
  },
  ar: {
    multiplier: 0.3,
    currency: 'ARS',
    averageCPM: 0.4,
    marketMaturity: 'low',
  },
  other: {
    multiplier: 0.5,
    currency: 'USD',
    averageCPM: 1.0,
    marketMaturity: 'medium',
  },
};

// 计算器默认值
export const CALCULATOR_DEFAULTS = {
  followers: 10000,
  engagementRate: 3.5,
  niche: 'lifestyle' as Niche,
  location: 'us' as Location,
  postFrequency: 5,
  averageViews: 5000,
} as const;

// 计算器限制
export const CALCULATOR_LIMITS = {
  followers: {
    min: 100,
    max: 100000000,
  },
  engagementRate: {
    min: 0.1,
    max: 20.0,
  },
  postFrequency: {
    min: 1,
    max: 50,
  },
  averageViews: {
    min: 100,
    max: 1000000000,
  },
} as const;

// 收益计算基础参数
export const EARNINGS_BASE = {
  // 创作者基金 (每1000次观看)
  creatorFundPer1K: 0.02,
  
  // 直播礼物 (基于粉丝数)
  liveGiftsPerFollower: 0.001,
  
  // 品牌合作 (基于粉丝数和互动率)
  brandPartnershipBase: 0.01,
  
  // 联盟营销 (基于观看量)
  affiliateMarketingPer1K: 0.05,
  
  // 商品销售 (基于粉丝数)
  merchandisePerFollower: 0.002,
  
  // 其他收入比例
  otherIncomeRatio: 0.1,
} as const;

// 互动率影响因子
export const ENGAGEMENT_FACTORS = {
  excellent: { min: 6.0, multiplier: 1.5 },
  good: { min: 4.0, multiplier: 1.2 },
  average: { min: 2.0, multiplier: 1.0 },
  poor: { min: 0.0, multiplier: 0.7 },
} as const;

// 发布频率影响因子
export const FREQUENCY_FACTORS = {
  daily: { min: 7, multiplier: 1.3 },
  frequent: { min: 4, multiplier: 1.1 },
  regular: { min: 2, multiplier: 1.0 },
  occasional: { min: 0, multiplier: 0.8 },
} as const;

// 粉丝数量等级
export const FOLLOWER_TIERS = {
  nano: { min: 1000, max: 10000, label: 'Nano Influencer' },
  micro: { min: 10000, max: 100000, label: 'Micro Influencer' },
  mid: { min: 100000, max: 1000000, label: 'Mid-tier Influencer' },
  macro: { min: 1000000, max: 10000000, label: 'Macro Influencer' },
  mega: { min: 10000000, max: Infinity, label: 'Mega Influencer' },
} as const;

// API端点
export const API_ENDPOINTS = {
  calculate: '/api/calculate',
  save: '/api/calculations/save',
  history: '/api/calculations/history',
  delete: '/api/calculations/delete',
  share: '/api/calculations/share',
  analytics: '/api/analytics',
  feedback: '/api/feedback',
} as const;

// 缓存键
export const CACHE_KEYS = {
  calculation: 'calculator:result',
  history: 'calculator:history',
  config: 'app:config',
  rates: 'exchange:rates',
  benchmarks: 'industry:benchmarks',
} as const;

// 缓存TTL (秒)
export const CACHE_TTL = {
  calculation: 300, // 5分钟
  history: 3600, // 1小时
  config: 86400, // 24小时
  rates: 3600, // 1小时
  benchmarks: 43200, // 12小时
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input parameters',
  CALCULATION_FAILED: 'Calculation failed',
  NETWORK_ERROR: 'Network error occurred',
  SERVER_ERROR: 'Internal server error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  CALCULATION_SAVED: 'Calculation saved successfully',
  CALCULATION_SHARED: 'Calculation shared successfully',
  FEEDBACK_SENT: 'Feedback sent successfully',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
} as const;

// 分析事件
export const ANALYTICS_EVENTS = {
  CALCULATION_STARTED: 'calculation_started',
  CALCULATION_COMPLETED: 'calculation_completed',
  CALCULATION_SAVED: 'calculation_saved',
  CALCULATION_SHARED: 'calculation_shared',
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  ERROR_OCCURRED: 'error_occurred',
} as const;

// 社交媒体链接
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/tiktokcalculator',
  facebook: 'https://facebook.com/tiktokcalculator',
  instagram: 'https://instagram.com/tiktokcalculator',
  linkedin: 'https://linkedin.com/company/tiktokcalculator',
  youtube: 'https://youtube.com/@tiktokcalculator',
  tiktok: 'https://tiktok.com/@tiktokcalculator',
} as const;

// 外部链接
export const EXTERNAL_LINKS = {
  tiktokCreatorFund: 'https://www.tiktok.com/creators/creator-fund/',
  tiktokBusiness: 'https://www.tiktok.com/business/',
  tiktokHelp: 'https://support.tiktok.com/',
  privacyPolicy: '/privacy',
  termsOfService: '/terms',
  cookiePolicy: '/cookies',
} as const;

// 正则表达式
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// 文件类型
export const FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'text/plain', 'application/msword'],
  videos: ['video/mp4', 'video/webm', 'video/ogg'],
} as const;

// 文件大小限制 (字节)
export const FILE_SIZE_LIMITS = {
  avatar: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
} as const;

// 分页配置
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// 动画持续时间 (毫秒)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// 断点
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Z-index层级
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// 颜色主题
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
} as const;