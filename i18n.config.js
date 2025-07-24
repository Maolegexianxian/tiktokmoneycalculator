/**
 * 企业级国际化配置文件
 * 统一管理所有 i18n 相关设置
 * 支持多语言、多地区、多环境配置
 */

// 语言和地区配置
const LOCALES = {
  // 英语系
  'en': {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    region: 'US',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
    fallback: null,
    priority: 1, // 主要语言
    status: 'production' // production | beta | development
  },
  'en-GB': {
    name: 'English (UK)',
    nativeName: 'English (UK)',
    direction: 'ltr',
    region: 'GB',
    currency: 'GBP',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'en-GB',
    fallback: 'en',
    priority: 2,
    status: 'production'
  },

  // 中文系
  'zh': {
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr',
    region: 'CN',
    currency: 'CNY',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: 'zh-CN',
    fallback: 'en',
    priority: 1,
    status: 'production'
  },
  'zh-TW': {
    name: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    direction: 'ltr',
    region: 'TW',
    currency: 'TWD',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: 'zh-TW',
    fallback: 'zh',
    priority: 2,
    status: 'beta'
  },
  'zh-HK': {
    name: 'Chinese (Hong Kong)',
    nativeName: '繁體中文 (香港)',
    direction: 'ltr',
    region: 'HK',
    currency: 'HKD',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'zh-HK',
    fallback: 'zh-TW',
    priority: 3,
    status: 'development'
  },

  // 日语
  'ja': {
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    region: 'JP',
    currency: 'JPY',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: 'ja-JP',
    fallback: 'en',
    priority: 2,
    status: 'beta'
  },

  // 韩语
  'ko': {
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    region: 'KR',
    currency: 'KRW',
    dateFormat: 'yyyy. MM. dd.',
    numberFormat: 'ko-KR',
    fallback: 'en',
    priority: 2,
    status: 'beta'
  },

  // 西班牙语
  'es': {
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    region: 'ES',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'es-ES',
    fallback: 'en',
    priority: 2,
    status: 'development'
  },
  'es-MX': {
    name: 'Spanish (Mexico)',
    nativeName: 'Español (México)',
    direction: 'ltr',
    region: 'MX',
    currency: 'MXN',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'es-MX',
    fallback: 'es',
    priority: 3,
    status: 'development'
  },

  // 法语
  'fr': {
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    region: 'FR',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'fr-FR',
    fallback: 'en',
    priority: 2,
    status: 'development'
  },

  // 德语
  'de': {
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    region: 'DE',
    currency: 'EUR',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: 'de-DE',
    fallback: 'en',
    priority: 2,
    status: 'development'
  },

  // 阿拉伯语
  'ar': {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    region: 'SA',
    currency: 'SAR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'ar-SA',
    fallback: 'en',
    priority: 3,
    status: 'development'
  }
};

// 根据环境和状态过滤语言
const getActiveLocales = () => {
  const env = process.env.NODE_ENV || 'development';
  const enabledStatuses = {
    'production': ['production'],
    'staging': ['production', 'beta'],
    'development': ['production', 'beta', 'development']
  };

  const allowedStatuses = enabledStatuses[env] || enabledStatuses.development;

  return Object.entries(LOCALES)
    .filter(([_, config]) => allowedStatuses.includes(config.status))
    .map(([locale, _]) => locale)
    .sort((a, b) => LOCALES[a].priority - LOCALES[b].priority);
};

module.exports = {
  // 基础配置
  messagesDir: 'messages',
  defaultLocale: 'en',
  supportedLocales: getActiveLocales(),
  srcDir: 'src',

  // 语言配置
  locales: LOCALES,
  
  // 类型生成配置
  generateTypes: true,
  outputTypesPath: 'src/types/i18n-generated.ts',
  
  // 企业级验证配置
  validation: {
    failOnMissing: true,
    failOnExtra: false,
    validateSchema: true,
    checkUnusedKeys: true,
    checkTranslationQuality: true,

    // 语言特定验证
    localeSpecific: {
      // RTL 语言验证
      rtl: {
        checkDirection: true,
        validateLayout: true
      },

      // 亚洲语言验证
      cjk: {
        checkCharacterEncoding: true,
        validateFontSupport: true,
        checkLineBreaking: true
      },

      // 欧洲语言验证
      european: {
        checkAccents: true,
        validateCurrency: true,
        checkDateFormats: true
      }
    },

    // 内容验证规则
    content: {
      maxLength: {
        'button': 20,
        'title': 60,
        'description': 200,
        'paragraph': 500
      },

      // 禁用词汇检查
      forbiddenWords: [],

      // 必需占位符检查
      requiredPlaceholders: true,

      // HTML 标签验证
      allowedHtmlTags: ['strong', 'em', 'br', 'a', 'span'],

      // 链接验证
      validateUrls: true
    }
  },
  
  // 注意：ESLint 和 Webpack 插件配置已移除
  // 现在使用 i18n-smart.js 脚本进行统一的国际化管理
  
  // 翻译质量检查
  quality: {
    checkEmptyValues: true,
    checkPlaceholders: true,
    checkHtmlTags: true,
    checkLength: {
      enabled: true,
      maxDifference: 0.5 // 翻译长度差异不超过 50%
    },
    checkSpecialCharacters: true
  },
  
  // 翻译工作流配置
  workflow: {
    // 翻译服务集成
    translationServices: {
      // Google Translate API
      google: {
        enabled: process.env.GOOGLE_TRANSLATE_API_KEY ? true : false,
        apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        autoTranslate: false, // 仅用于建议，不自动应用
        supportedLanguages: ['zh', 'ja', 'ko', 'es', 'fr', 'de', 'ar']
      },

      // DeepL API (更高质量)
      deepl: {
        enabled: process.env.DEEPL_API_KEY ? true : false,
        apiKey: process.env.DEEPL_API_KEY,
        autoTranslate: false,
        supportedLanguages: ['zh', 'ja', 'es', 'fr', 'de']
      },

      // 人工翻译平台集成
      crowdin: {
        enabled: process.env.CROWDIN_API_TOKEN ? true : false,
        projectId: process.env.CROWDIN_PROJECT_ID,
        apiToken: process.env.CROWDIN_API_TOKEN,
        autoSync: false
      }
    },

    // 翻译审核流程
    review: {
      enabled: true,

      // 审核级别
      levels: {
        'machine': 0,    // 机器翻译
        'community': 1,  // 社区翻译
        'professional': 2, // 专业翻译
        'native': 3      // 母语者审核
      },

      // 不同语言的审核要求
      requirements: {
        'en': { minLevel: 'native' },
        'zh': { minLevel: 'professional' },
        'ja': { minLevel: 'professional' },
        'ko': { minLevel: 'professional' },
        'es': { minLevel: 'community' },
        'fr': { minLevel: 'community' },
        'de': { minLevel: 'community' },
        'ar': { minLevel: 'professional' }
      }
    }
  },

  // 自动化配置
  automation: {
    // Git hooks
    preCommit: {
      enabled: true,
      commands: ['extract', 'sync', 'types', 'validate'],

      // 仅检查变更的文件
      onlyChanged: true,

      // 跳过某些分支
      skipBranches: ['main', 'master', 'release/*']
    },

    // CI/CD 集成
    ci: {
      enabled: true,
      failOnWarnings: false,
      generateReport: true,
      reportPath: 'i18n-report.json',

      // 不同环境的配置
      environments: {
        'development': {
          failOnMissing: false,
          generateTypes: true,
          runTests: false
        },
        'staging': {
          failOnMissing: true,
          generateTypes: true,
          runTests: true,
          coverageThreshold: 80
        },
        'production': {
          failOnMissing: true,
          generateTypes: true,
          runTests: true,
          coverageThreshold: 95,
          requireReview: true
        }
      }
    },

    // 定期任务
    scheduled: {
      // 每日同步检查
      dailySync: {
        enabled: true,
        time: '02:00',
        timezone: 'UTC',
        actions: ['check', 'report']
      },

      // 每周完整验证
      weeklyValidation: {
        enabled: true,
        day: 'sunday',
        time: '03:00',
        timezone: 'UTC',
        actions: ['validate', 'quality-check', 'report']
      }
    }
  },
  
  // 开发工具配置
  devTools: {
    // 开发环境下显示翻译键
    showKeys: process.env.NODE_ENV === 'development',
    
    // 高亮未翻译的内容
    highlightMissing: true,
    
    // 翻译覆盖率报告
    coverage: {
      enabled: true,
      threshold: 90 // 翻译覆盖率阈值
    }
  },
  
  // 性能优化
  performance: {
    // 懒加载翻译文件
    lazyLoading: true,
    
    // 缓存翻译结果
    caching: true,
    
    // 压缩翻译文件
    compression: true
  },
  
  // 扩展配置
  extensions: {
    // 自定义翻译函数名
    translationFunctions: ['t', 'translate', '$t'],
    
    // 自定义钩子名
    translationHooks: ['useTranslations', 'useTypedTranslations'],
    
    // 支持的文件扩展名
    fileExtensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
    
    // 自定义提取规则
    extractionRules: [
      {
        pattern: /t\(['"`]([^'"`)]+)['"`]/g,
        keyIndex: 1
      },
      {
        pattern: /useTranslations\(['"`]([^'"`)]+)['"`]/g,
        keyIndex: 1,
        isNamespace: true
      }
    ]
  }
};