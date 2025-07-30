import { z } from 'zod';
import { NICHE_OPTIONS, LOCATION_OPTIONS, CALCULATOR_LIMITS } from './constants';

/**
 * 计算器输入验证模式
 */
export const calculatorInputSchema = z.object({
  platform: z.enum(['tiktok', 'instagram', 'youtube'], {
    required_error: 'Please select a platform',
    invalid_type_error: 'Invalid platform selection',
  }),

  metrics: z.object({
    // TikTok metrics
    followers: z
      .number({
        invalid_type_error: 'Followers must be a number',
      })
      .min(CALCULATOR_LIMITS.followers.min, {
        message: `Followers must be at least ${CALCULATOR_LIMITS.followers.min.toLocaleString()}`,
      })
      .max(CALCULATOR_LIMITS.followers.max, {
        message: `Followers cannot exceed ${CALCULATOR_LIMITS.followers.max.toLocaleString()}`,
      })
      .int('Followers must be a whole number')
      .optional(),

    avgViews: z
      .number({
        invalid_type_error: 'Average views must be a number',
      })
      .min(CALCULATOR_LIMITS.averageViews.min, {
        message: `Average views must be at least ${CALCULATOR_LIMITS.averageViews.min.toLocaleString()}`,
      })
      .max(CALCULATOR_LIMITS.averageViews.max, {
        message: `Average views cannot exceed ${CALCULATOR_LIMITS.averageViews.max.toLocaleString()}`,
      })
      .int('Average views must be a whole number')
      .optional(),

    avgLikes: z
      .number({
        invalid_type_error: 'Average likes must be a number',
      })
      .min(0, 'Average likes cannot be negative')
      .int('Average likes must be a whole number')
      .optional(),

    avgComments: z
      .number({
        invalid_type_error: 'Average comments must be a number',
      })
      .min(0, 'Average comments cannot be negative')
      .int('Average comments must be a whole number')
      .optional(),

    avgShares: z
      .number({
        invalid_type_error: 'Average shares must be a number',
      })
      .min(0, 'Average shares cannot be negative')
      .int('Average shares must be a whole number')
      .optional(),

    engagementRate: z
      .number({
        invalid_type_error: 'Engagement rate must be a number',
      })
      .min(CALCULATOR_LIMITS.engagementRate.min, {
        message: `Engagement rate must be at least ${CALCULATOR_LIMITS.engagementRate.min}%`,
      })
      .max(CALCULATOR_LIMITS.engagementRate.max, {
        message: `Engagement rate cannot exceed ${CALCULATOR_LIMITS.engagementRate.max}%`,
      })
      .optional(),

    // Instagram metrics
    avgStoryViews: z
      .number({
        invalid_type_error: 'Average story views must be a number',
      })
      .min(0, 'Average story views cannot be negative')
      .int('Average story views must be a whole number')
      .optional(),

    avgReelsViews: z
      .number({
        invalid_type_error: 'Average reels views must be a number',
      })
      .min(0, 'Average reels views cannot be negative')
      .int('Average reels views must be a whole number')
      .optional(),

    // YouTube metrics
    subscribers: z
      .number({
        invalid_type_error: 'Subscribers must be a number',
      })
      .min(CALCULATOR_LIMITS.followers.min, {
        message: `Subscribers must be at least ${CALCULATOR_LIMITS.followers.min.toLocaleString()}`,
      })
      .max(CALCULATOR_LIMITS.followers.max, {
        message: `Subscribers cannot exceed ${CALCULATOR_LIMITS.followers.max.toLocaleString()}`,
      })
      .int('Subscribers must be a whole number')
      .optional(),

    avgWatchTime: z
      .number({
        invalid_type_error: 'Average watch time must be a number',
      })
      .min(0, 'Average watch time cannot be negative')
      .optional(),

    videoLength: z
      .number({
        invalid_type_error: 'Video length must be a number',
      })
      .min(1, 'Video length must be at least 1 minute')
      .max(600, 'Video length cannot exceed 600 minutes')
      .optional(),

    watchTimePercentage: z
      .number({
        invalid_type_error: 'Watch time percentage must be a number',
      })
      .min(0, 'Watch time percentage cannot be negative')
      .max(100, 'Watch time percentage cannot exceed 100%')
      .optional(),
  }),

  profile: z.object({
    contentNiche: z
      .string({
        required_error: 'Please select a content niche',
        invalid_type_error: 'Invalid content niche',
      })
      .min(1, 'Please select a content niche'),

    audienceLocation: z
      .string({
        required_error: 'Please select audience location',
        invalid_type_error: 'Invalid audience location',
      })
      .min(1, 'Please select audience location'),

    postFrequency: z
      .number({
        invalid_type_error: 'Post frequency must be a number',
      })
      .min(CALCULATOR_LIMITS.postFrequency.min, {
        message: `Post frequency must be at least ${CALCULATOR_LIMITS.postFrequency.min} per week`,
      })
      .max(CALCULATOR_LIMITS.postFrequency.max, {
        message: `Post frequency cannot exceed ${CALCULATOR_LIMITS.postFrequency.max} per week`,
      })
      .int('Post frequency must be a whole number')
      .optional(),

    uploadFrequency: z
      .number({
        invalid_type_error: 'Upload frequency must be a number',
      })
      .min(CALCULATOR_LIMITS.postFrequency.min, {
        message: `Upload frequency must be at least ${CALCULATOR_LIMITS.postFrequency.min} per week`,
      })
      .max(CALCULATOR_LIMITS.postFrequency.max, {
        message: `Upload frequency cannot exceed ${CALCULATOR_LIMITS.postFrequency.max} per week`,
      })
      .int('Upload frequency must be a whole number')
      .optional(),

    accountAge: z
      .number({
        invalid_type_error: 'Account age must be a number',
      })
      .min(1, 'Account age must be at least 1 month')
      .max(120, 'Account age cannot exceed 120 months')
      .int('Account age must be a whole number')
      .optional(),

    channelAge: z
      .number({
        invalid_type_error: 'Channel age must be a number',
      })
      .min(1, 'Channel age must be at least 1 month')
      .max(120, 'Channel age cannot exceed 120 months')
      .int('Channel age must be a whole number')
      .optional(),

    hasVerification: z
      .boolean({
        invalid_type_error: 'Verification status must be a boolean',
      })
      .optional(),

    monetizationEnabled: z
      .boolean({
        invalid_type_error: 'Monetization status must be a boolean',
      })
      .optional(),
  }),
});

/**
 * 用户注册验证模式
 */
export const userRegistrationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please enter a valid email address')
    .max(100, 'Email cannot exceed 100 characters'),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),

  confirmPassword: z.string({
    required_error: 'Please confirm your password',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * 用户登录验证模式
 */
export const userLoginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please enter a valid email address'),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(1, 'Password is required'),

  rememberMe: z.boolean().optional(),
});

/**
 * 密码重置请求验证模式
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please enter a valid email address'),
});

/**
 * 密码重置验证模式
 */
export const passwordResetSchema = z.object({
  token: z
    .string({
      required_error: 'Reset token is required',
    })
    .min(1, 'Invalid reset token'),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),

  confirmPassword: z.string({
    required_error: 'Please confirm your password',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * 密码更改验证模式
 */
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string({
      required_error: 'Current password is required',
    })
    .min(1, 'Current password is required'),

  newPassword: z
    .string({
      required_error: 'New password is required',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),

  confirmNewPassword: z.string({
    required_error: 'Please confirm your new password',
  }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'New passwords do not match',
  path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

/**
 * 用户资料更新验证模式
 */
export const userProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email cannot exceed 100 characters')
    .optional(),

  image: z
    .string()
    .url('Please enter a valid image URL')
    .optional(),
});

/**
 * 反馈表单验证模式
 */
export const feedbackSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),

  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please enter a valid email address')
    .max(100, 'Email cannot exceed 100 characters'),

  subject: z
    .string({
      required_error: 'Subject is required',
    })
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject cannot exceed 100 characters'),

  message: z
    .string({
      required_error: 'Message is required',
    })
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),

  category: z
    .enum(['general', 'bug', 'feature', 'support'], {
      required_error: 'Please select a category',
    })
    .optional(),
});

/**
 * 计算结果保存验证模式
 */
export const saveCalculationSchema = z.object({
  input: calculatorInputSchema,
  result: z.object({
    monthlyEarnings: z.number(),
    yearlyEarnings: z.number(),
    perPostEarnings: z.number(),
    perThousandViewsEarnings: z.number(),
    breakdown: z.object({
      creatorFund: z.number(),
      liveGifts: z.number(),
      brandPartnerships: z.number(),
      affiliateMarketing: z.number(),
      merchandise: z.number(),
      other: z.number(),
    }),
    factors: z.any(),
    tips: z.array(z.string()),
  }),
  name: z
    .string()
    .min(1, 'Calculation name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
});

/**
 * 分析事件验证模式
 */
export const analyticsEventSchema = z.object({
  action: z
    .string({
      required_error: 'Action is required',
    })
    .min(1, 'Action cannot be empty')
    .max(50, 'Action cannot exceed 50 characters'),

  category: z
    .string({
      required_error: 'Category is required',
    })
    .min(1, 'Category cannot be empty')
    .max(50, 'Category cannot exceed 50 characters'),

  label: z
    .string()
    .max(100, 'Label cannot exceed 100 characters')
    .optional(),

  value: z
    .number()
    .min(0, 'Value must be non-negative')
    .optional(),

  customParameters: z
    .record(z.any())
    .optional(),
});

/**
 * 页面浏览验证模式
 */
export const pageViewSchema = z.object({
  page: z
    .string({
      required_error: 'Page is required',
    })
    .min(1, 'Page cannot be empty'),

  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, 'Title cannot be empty'),

  referrer: z
    .string()
    .optional(),
});

/**
 * 文件上传验证模式 - 服务器端安全版本
 */
export const fileUploadSchema = z.object({
  file: z.any().refine((file) => {
    // 在服务器端，我们只检查基本属性
    if (typeof window === 'undefined') {
      // 服务器端：检查FormData文件对象
      return file &&
             typeof file === 'object' &&
             'size' in file &&
             'type' in file;
    } else {
      // 客户端：检查File对象
      return file &&
             typeof file === 'object' &&
             'size' in file &&
             'type' in file &&
             'arrayBuffer' in file;
    }
  }, {
    message: 'Please select a valid file',
  }).refine((file) => {
    return file && file.size <= 5 * 1024 * 1024;
  }, {
    message: 'File size must be less than 5MB',
  }).refine((file) => {
    return file && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
  }, {
    message: 'Only JPEG, PNG, GIF, and WebP images are allowed',
  }),
});

/**
 * 搜索查询验证模式
 */
export const searchQuerySchema = z.object({
  query: z
    .string({
      required_error: 'Search query is required',
    })
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query cannot exceed 100 characters'),

  filters: z
    .object({
      niche: z.enum(NICHE_OPTIONS).optional(),
      location: z.enum(LOCATION_OPTIONS).optional(),
      minFollowers: z.number().min(0).optional(),
      maxFollowers: z.number().min(0).optional(),
    })
    .optional(),

  sort: z
    .enum(['relevance', 'date', 'popularity'])
    .default('relevance'),

  limit: z
    .number()
    .min(1)
    .max(100)
    .default(20),

  offset: z
    .number()
    .min(0)
    .default(0),
});

/**
 * 通用ID验证模式
 */
export const idSchema = z
  .string({
    required_error: 'ID is required',
  })
  .min(1, 'ID cannot be empty')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid ID format');

/**
 * UUID验证模式
 */
export const uuidSchema = z
  .string({
    required_error: 'UUID is required',
  })
  .uuid('Invalid UUID format');

/**
 * 分页参数验证模式
 */
export const paginationSchema = z.object({
  page: z
    .number()
    .min(1, 'Page must be at least 1')
    .default(1),

  limit: z
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),

  sort: z
    .string()
    .optional(),

  order: z
    .enum(['asc', 'desc'])
    .default('desc'),
});

/**
 * 验证工具函数
 */
export const validationUtils = {
  /**
   * 验证数据并返回结果
   */
  validate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors?: string[];
  } {
    try {
      const result = schema.parse(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => err.message),
        };
      }
      return {
        success: false,
        errors: ['Validation failed'],
      };
    }
  },

  /**
   * 安全验证数据（不抛出异常）
   */
  safeParse<T>(schema: z.ZodSchema<T>, data: unknown): z.SafeParseReturnType<unknown, T> {
    return schema.safeParse(data);
  },

  /**
   * 获取验证错误消息
   */
  getErrorMessages(error: z.ZodError): Record<string, string> {
    const errors: Record<string, string> = {};
    
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      errors[path] = err.message;
    });
    
    return errors;
  },

  /**
   * 格式化验证错误
   */
  formatErrors(error: z.ZodError): string[] {
    return error.errors.map(err => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    });
  },

  /**
   * 检查是否为有效的邮箱
   */
  isValidEmail(email: string): boolean {
    return z.string().email().safeParse(email).success;
  },

  /**
   * 检查是否为有效的URL
   */
  isValidUrl(url: string): boolean {
    return z.string().url().safeParse(url).success;
  },

  /**
   * 检查是否为有效的UUID
   */
  isValidUuid(uuid: string): boolean {
    return uuidSchema.safeParse(uuid).success;
  },

  /**
   * 清理和验证字符串
   */
  sanitizeString(value: unknown, maxLength: number = 255): string {
    if (typeof value !== 'string') {
      return '';
    }
    
    return value.trim().slice(0, maxLength);
  },

  /**
   * 清理和验证数字
   */
  sanitizeNumber(value: unknown, min?: number, max?: number): number | null {
    const num = Number(value);
    
    if (isNaN(num)) {
      return null;
    }
    
    if (min !== undefined && num < min) {
      return min;
    }
    
    if (max !== undefined && num > max) {
      return max;
    }
    
    return num;
  },
};

// 导出类型
export type CalculatorInput = z.infer<typeof calculatorInputSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type PasswordChange = z.infer<typeof passwordChangeSchema>;
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;
export type Feedback = z.infer<typeof feedbackSchema>;
export type SaveCalculation = z.infer<typeof saveCalculationSchema>;
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
export type PageView = z.infer<typeof pageViewSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type Pagination = z.infer<typeof paginationSchema>;