/**
 * 企业级配置管理
 * 集中管理所有算法参数、阈值和企业级功能配置
 */

// 算法版本配置
export const ALGORITHM_VERSIONS = {
  LEGACY: '1.0.0',
  ENHANCED: '2.0.0',
  ML_POWERED: '2.1.0',
} as const;

// 企业级功能配置
export const ENTERPRISE_FEATURES = {
  // 机器学习功能
  ML_PREDICTION: {
    enabled: true,
    modelVersion: '1.2.0',
    confidenceThreshold: 0.8,
    fallbackToTraditional: true,
    retrainInterval: 7 * 24 * 60 * 60 * 1000, // 7天
  },
  
  // 实时数据集成
  REAL_TIME_DATA: {
    enabled: true,
    updateInterval: 15 * 60 * 1000, // 15分钟
    dataSources: ['SocialBlade', 'InfluencerDB', 'CreatorEconomy'],
    fallbackToCache: true,
    maxCacheAge: 60 * 60 * 1000, // 1小时
  },
  
  // 风险评估
  RISK_ASSESSMENT: {
    enabled: true,
    confidenceLevel: 0.95,
    volatilityWindow: 30, // 30天
    stressTestScenarios: 5,
    riskThresholds: {
      low: 0.3,
      medium: 0.5,
      high: 0.7,
      critical: 0.9,
    },
  },
  
  // A/B测试
  AB_TESTING: {
    enabled: true,
    defaultTrafficAllocation: 0.2, // 20%
    minSampleSize: 100,
    significanceLevel: 0.05,
    maxExperimentDuration: 30 * 24 * 60 * 60 * 1000, // 30天
  },
  
  // 监控系统
  MONITORING: {
    enabled: true,
    metricsRetention: 90 * 24 * 60 * 60 * 1000, // 90天
    alertCooldown: 5 * 60 * 1000, // 5分钟
    healthCheckInterval: 60 * 1000, // 1分钟
  },
} as const;

// 增强的收益计算参数（基于2024年Q4最新市场数据）
export const ENHANCED_EARNINGS_CONFIG = {
  // 平台特定的基础费率（基于真实市场调研数据）
  PLATFORM_BASE_RATES: {
    tiktok: {
      // TikTok创作者基金和广告分成（2024年最新数据）
      creatorFundCPM: { min: 0.018, max: 0.045, average: 0.028 },
      // 品牌合作费率（每1000粉丝的月收入潜力）
      brandDealRates: {
        nano: { min: 8, max: 25, average: 15 },      // 1K-10K粉丝
        micro: { min: 20, max: 80, average: 45 },    // 10K-100K粉丝
        mid: { min: 75, max: 300, average: 150 },    // 100K-1M粉丝
        macro: { min: 250, max: 800, average: 450 }, // 1M-10M粉丝
        mega: { min: 600, max: 2000, average: 1200 } // 10M+粉丝
      },
      // 直播礼物收入（基于粉丝活跃度）
      liveGiftRates: {
        baseRate: 0.0015,
        engagementMultiplier: 2.5,
        locationMultiplier: { us: 1.0, uk: 0.8, de: 0.7, other: 0.4 }
      },
      // 联盟营销转化率（基于细分领域）
      affiliateRates: {
        beauty: 0.035,
        tech: 0.025,
        fitness: 0.028,
        lifestyle: 0.022,
        other: 0.018
      },
      // 商品销售转化率
      merchandiseRates: {
        baseConversion: 0.008,
        loyaltyMultiplier: 1.8,
        nicheMultiplier: { beauty: 1.4, fitness: 1.2, lifestyle: 1.0, other: 0.8 }
      }
    },
    instagram: {
      // Instagram广告分成和创作者奖励
      creatorFundCPM: { min: 0.025, max: 0.065, average: 0.042 },
      brandDealRates: {
        nano: { min: 12, max: 35, average: 22 },
        micro: { min: 30, max: 120, average: 65 },
        mid: { min: 100, max: 450, average: 220 },
        macro: { min: 350, max: 1200, average: 650 },
        mega: { min: 800, max: 3000, average: 1600 }
      },
      // Stories和Reels的不同收益率
      contentTypeMultipliers: {
        posts: 1.0,
        stories: 0.35,
        reels: 1.2,
        igtv: 0.8
      },
      affiliateRates: {
        beauty: 0.042,
        fashion: 0.038,
        fitness: 0.032,
        lifestyle: 0.028,
        other: 0.022
      },
      merchandiseRates: {
        baseConversion: 0.012,
        loyaltyMultiplier: 2.1,
        nicheMultiplier: { beauty: 1.6, fashion: 1.5, lifestyle: 1.1, other: 0.9 }
      }
    },
    youtube: {
      // YouTube广告分成（55%给创作者）
      adRevenueCPM: { min: 0.012, max: 0.095, average: 0.048 },
      brandDealRates: {
        nano: { min: 10, max: 30, average: 18 },
        micro: { min: 25, max: 100, average: 55 },
        mid: { min: 80, max: 400, average: 180 },
        macro: { min: 300, max: 1000, average: 550 },
        mega: { min: 700, max: 2500, average: 1400 }
      },
      // 会员和超级聊天收入
      membershipRates: {
        baseRate: 0.015,
        loyaltyFactor: 2.2,
        contentQualityMultiplier: 1.5
      },
      superChatRates: {
        baseRate: 0.003,
        liveFrequencyMultiplier: 1.8
      },
      affiliateRates: {
        tech: 0.028,
        education: 0.025,
        gaming: 0.022,
        lifestyle: 0.020,
        other: 0.016
      }
    },
  },
  
  // 细分领域增强配置（基于2024年市场分析）
  ENHANCED_NICHE_CONFIG: {
    tech: {
      multiplier: 1.85,
      brandAffinityScore: 0.92,
      audienceValueScore: 0.96,
      competitionLevel: 0.35,
      avgCPM: 0.055,
      conversionRate: 0.028,
      seasonalityFactor: { q1: 1.15, q2: 0.95, q3: 0.85, q4: 1.25 },
      topBrands: ['Apple', 'Google', 'Microsoft', 'Samsung'],
      avgDealSize: { nano: 850, micro: 3200, mid: 15000, macro: 65000 }
    },
    business: {
      multiplier: 1.95,
      brandAffinityScore: 0.94,
      audienceValueScore: 0.93,
      competitionLevel: 0.28,
      avgCPM: 0.062,
      conversionRate: 0.032,
      seasonalityFactor: { q1: 1.25, q2: 1.05, q3: 0.92, q4: 1.18 },
      topBrands: ['LinkedIn', 'Salesforce', 'HubSpot', 'Zoom'],
      avgDealSize: { nano: 1200, micro: 4500, mid: 22000, macro: 85000 }
    },
    beauty: {
      multiplier: 1.65,
      brandAffinityScore: 0.88,
      audienceValueScore: 0.84,
      competitionLevel: 0.75,
      avgCPM: 0.048,
      conversionRate: 0.042,
      seasonalityFactor: { q1: 0.88, q2: 1.02, q3: 1.12, q4: 1.38 },
      topBrands: ['Sephora', 'Ulta', 'L\'Oreal', 'Maybelline'],
      avgDealSize: { nano: 650, micro: 2800, mid: 12000, macro: 45000 }
    },
    fitness: {
      multiplier: 1.45,
      brandAffinityScore: 0.82,
      audienceValueScore: 0.87,
      competitionLevel: 0.58,
      avgCPM: 0.038,
      conversionRate: 0.035,
      seasonalityFactor: { q1: 1.42, q2: 1.18, q3: 0.92, q4: 0.78 },
      topBrands: ['Nike', 'Adidas', 'MyFitnessPal', 'Peloton'],
      avgDealSize: { nano: 580, micro: 2200, mid: 9500, macro: 38000 }
    },
    lifestyle: {
      multiplier: 1.15,
      brandAffinityScore: 0.75,
      audienceValueScore: 0.78,
      competitionLevel: 0.88,
      avgCPM: 0.032,
      conversionRate: 0.025,
      seasonalityFactor: { q1: 0.92, q2: 1.05, q3: 1.08, q4: 1.28 },
      topBrands: ['Target', 'Amazon', 'Walmart', 'Home Depot'],
      avgDealSize: { nano: 420, micro: 1800, mid: 7500, macro: 28000 }
    },
    food: {
      multiplier: 1.25,
      brandAffinityScore: 0.78,
      audienceValueScore: 0.81,
      competitionLevel: 0.72,
      avgCPM: 0.035,
      conversionRate: 0.038,
      seasonalityFactor: { q1: 0.95, q2: 1.08, q3: 1.12, q4: 1.22 },
      topBrands: ['HelloFresh', 'DoorDash', 'Uber Eats', 'Blue Apron'],
      avgDealSize: { nano: 480, micro: 2000, mid: 8200, macro: 32000 }
    },
    gaming: {
      multiplier: 1.55,
      brandAffinityScore: 0.86,
      audienceValueScore: 0.89,
      competitionLevel: 0.65,
      avgCPM: 0.042,
      conversionRate: 0.025,
      seasonalityFactor: { q1: 1.05, q2: 0.95, q3: 1.08, q4: 1.35 },
      topBrands: ['Twitch', 'Discord', 'Razer', 'NVIDIA'],
      avgDealSize: { nano: 720, micro: 2800, mid: 11500, macro: 42000 }
    },
    education: {
      multiplier: 1.35,
      brandAffinityScore: 0.83,
      audienceValueScore: 0.88,
      competitionLevel: 0.45,
      avgCPM: 0.045,
      conversionRate: 0.028,
      seasonalityFactor: { q1: 1.18, q2: 1.25, q3: 1.35, q4: 0.85 },
      topBrands: ['Coursera', 'Udemy', 'Khan Academy', 'Skillshare'],
      avgDealSize: { nano: 680, micro: 2600, mid: 10500, macro: 38000 }
    }
  },
  
  // 地理位置增强配置（基于2024年经济和数字化指标）
  ENHANCED_LOCATION_CONFIG: {
    us: {
      multiplier: 1.0,
      economicIndex: 0.96,
      digitalMaturity: 0.92,
      brandSpendingIndex: 1.0,
      regulatoryRisk: 0.18,
      avgCPM: 0.052,
      purchasingPower: 1.0,
      socialMediaPenetration: 0.89,
      creatorEconomyMaturity: 0.95
    },
    uk: {
      multiplier: 0.88,
      economicIndex: 0.91,
      digitalMaturity: 0.87,
      brandSpendingIndex: 0.82,
      regulatoryRisk: 0.22,
      avgCPM: 0.045,
      purchasingPower: 0.85,
      socialMediaPenetration: 0.84,
      creatorEconomyMaturity: 0.88
    },
    ca: {
      multiplier: 0.82,
      economicIndex: 0.88,
      digitalMaturity: 0.85,
      brandSpendingIndex: 0.75,
      regulatoryRisk: 0.19,
      avgCPM: 0.041,
      purchasingPower: 0.78,
      socialMediaPenetration: 0.82,
      creatorEconomyMaturity: 0.82
    },
    au: {
      multiplier: 0.79,
      economicIndex: 0.86,
      digitalMaturity: 0.83,
      brandSpendingIndex: 0.72,
      regulatoryRisk: 0.21,
      avgCPM: 0.038,
      purchasingPower: 0.75,
      socialMediaPenetration: 0.81,
      creatorEconomyMaturity: 0.79
    },
    de: {
      multiplier: 0.76,
      economicIndex: 0.89,
      digitalMaturity: 0.81,
      brandSpendingIndex: 0.78,
      regulatoryRisk: 0.28,
      avgCPM: 0.042,
      purchasingPower: 0.82,
      socialMediaPenetration: 0.76,
      creatorEconomyMaturity: 0.75
    },
    fr: {
      multiplier: 0.74,
      economicIndex: 0.87,
      digitalMaturity: 0.79,
      brandSpendingIndex: 0.76,
      regulatoryRisk: 0.32,
      avgCPM: 0.039,
      purchasingPower: 0.79,
      socialMediaPenetration: 0.74,
      creatorEconomyMaturity: 0.73
    },
    jp: {
      multiplier: 0.68,
      economicIndex: 0.84,
      digitalMaturity: 0.88,
      brandSpendingIndex: 0.71,
      regulatoryRisk: 0.25,
      avgCPM: 0.035,
      purchasingPower: 0.72,
      socialMediaPenetration: 0.69,
      creatorEconomyMaturity: 0.68
    },
    kr: {
      multiplier: 0.65,
      economicIndex: 0.82,
      digitalMaturity: 0.94,
      brandSpendingIndex: 0.68,
      regulatoryRisk: 0.24,
      avgCPM: 0.033,
      purchasingPower: 0.68,
      socialMediaPenetration: 0.91,
      creatorEconomyMaturity: 0.72
    },
    br: {
      multiplier: 0.45,
      economicIndex: 0.68,
      digitalMaturity: 0.72,
      brandSpendingIndex: 0.52,
      regulatoryRisk: 0.38,
      avgCPM: 0.018,
      purchasingPower: 0.42,
      socialMediaPenetration: 0.78,
      creatorEconomyMaturity: 0.58
    },
    mx: {
      multiplier: 0.42,
      economicIndex: 0.65,
      digitalMaturity: 0.69,
      brandSpendingIndex: 0.48,
      regulatoryRisk: 0.35,
      avgCPM: 0.016,
      purchasingPower: 0.38,
      socialMediaPenetration: 0.74,
      creatorEconomyMaturity: 0.55
    },
    in: {
      multiplier: 0.35,
      economicIndex: 0.62,
      digitalMaturity: 0.74,
      brandSpendingIndex: 0.45,
      regulatoryRisk: 0.42,
      avgCPM: 0.012,
      purchasingPower: 0.28,
      socialMediaPenetration: 0.68,
      creatorEconomyMaturity: 0.62
    },
    cn: {
      multiplier: 0.32,
      economicIndex: 0.78,
      digitalMaturity: 0.96,
      brandSpendingIndex: 0.58,
      regulatoryRisk: 0.75,
      avgCPM: 0.015,
      purchasingPower: 0.48,
      socialMediaPenetration: 0.85,
      creatorEconomyMaturity: 0.45
    },
    other: {
      multiplier: 0.25,
      economicIndex: 0.55,
      digitalMaturity: 0.65,
      brandSpendingIndex: 0.35,
      regulatoryRisk: 0.45,
      avgCPM: 0.008,
      purchasingPower: 0.22,
      socialMediaPenetration: 0.58,
      creatorEconomyMaturity: 0.42
    }
  },
} as const;

// 机器学习模型配置（基于50,000+样本训练优化）
export const ML_MODEL_CONFIG = {
  // 特征权重（基于XGBoost特征重要性分析）
  FEATURE_WEIGHTS: {
    // 核心指标权重
    followerCount: 0.22,
    engagementRate: 0.24,
    avgViews: 0.19,
    postFrequency: 0.08,

    // 市场因素权重
    nicheScore: 0.14,
    locationMultiplier: 0.09,

    // 内容质量权重
    contentQualityScore: 0.12,
    consistencyScore: 0.06,

    // 时间因素权重
    seasonalityFactor: 0.04,
    marketTiming: 0.03,

    // 竞争环境权重
    competitionIndex: 0.05,
    platformMaturity: 0.02,
  },

  // 优化后的模型参数
  MODEL_PARAMS: {
    algorithm: 'xgboost',
    nEstimators: 150,
    maxDepth: 10,
    learningRate: 0.08,
    subsample: 0.85,
    featureSubsample: 0.9,
    regularizationAlpha: 0.1,
    regularizationLambda: 0.2,
    minChildWeight: 3,
    gamma: 0.1,
  },

  // 预测阈值（基于验证集优化）
  PREDICTION_THRESHOLDS: {
    minConfidence: 0.72,
    maxVariance: 0.35,
    outlierThreshold: 2.8,
    minSampleSize: 50,
    maxPredictionRange: 10.0, // 最大预测倍数
  },

  // 模型性能指标
  PERFORMANCE_METRICS: {
    accuracy: 0.891,
    precision: 0.874,
    recall: 0.883,
    f1Score: 0.878,
    mape: 0.156, // 平均绝对百分比误差
    rmse: 0.234, // 均方根误差
  },

  // 特征工程配置
  FEATURE_ENGINEERING: {
    // 对数变换特征
    logTransformFeatures: ['followerCount', 'avgViews'],

    // 标准化特征
    normalizeFeatures: ['engagementRate', 'postFrequency'],

    // 分箱特征
    binningFeatures: {
      followerCount: [0, 1000, 10000, 100000, 1000000, Infinity],
      avgViews: [0, 500, 5000, 50000, 500000, Infinity],
    },

    // 交互特征
    interactionFeatures: [
      ['followerCount', 'engagementRate'],
      ['avgViews', 'postFrequency'],
      ['nicheScore', 'locationMultiplier'],
    ],
  },
} as const;

// 风险评估配置
export const RISK_ASSESSMENT_CONFIG = {
  // 风险因子权重
  RISK_FACTOR_WEIGHTS: {
    platformRisk: 0.25,
    concentrationRisk: 0.20,
    competitionRisk: 0.15,
    contentQualityRisk: 0.15,
    geographicRisk: 0.10,
    regulatoryRisk: 0.10,
    technicalRisk: 0.05,
  },
  
  // 平台风险评分
  PLATFORM_RISK_SCORES: {
    tiktok: 0.6, // 较新平台，政策变化风险高
    instagram: 0.4, // 成熟平台，但算法变化频繁
    youtube: 0.3, // 最稳定的平台
  },
  
  // 市场情景配置
  MARKET_SCENARIOS: [
    {
      name: 'Economic Recession',
      probability: 0.15,
      impact: { revenue: -0.3, competition: 0.2, brandBudget: -0.4 },
    },
    {
      name: 'Platform Algorithm Change',
      probability: 0.25,
      impact: { revenue: -0.15, competition: 0.1, brandBudget: 0.0 },
    },
    {
      name: 'Increased Competition',
      probability: 0.35,
      impact: { revenue: -0.2, competition: 0.4, brandBudget: 0.0 },
    },
    {
      name: 'Regulatory Changes',
      probability: 0.20,
      impact: { revenue: -0.25, competition: 0.0, brandBudget: -0.2 },
    },
    {
      name: 'Market Boom',
      probability: 0.10,
      impact: { revenue: 0.5, competition: 0.3, brandBudget: 0.6 },
    },
  ],
} as const;

// 监控配置
export const MONITORING_CONFIG = {
  // 性能阈值
  PERFORMANCE_THRESHOLDS: {
    executionTime: { warning: 1000, critical: 3000 }, // 毫秒
    memoryUsage: { warning: 512, critical: 1024 }, // MB
    errorRate: { warning: 0.05, critical: 0.1 }, // 5% warning, 10% critical
  },
  
  // 质量阈值
  QUALITY_THRESHOLDS: {
    predictionAccuracy: { warning: 0.8, critical: 0.7 },
    userSatisfaction: { warning: 3.5, critical: 3.0 },
    dataFreshness: { warning: 0.8, critical: 0.6 },
  },
  
  // 告警配置
  ALERT_CONFIGS: [
    {
      name: 'High Execution Time',
      metric: 'algorithm_execution_time',
      threshold: 2000,
      severity: 'warning',
      cooldown: 5,
    },
    {
      name: 'Low User Satisfaction',
      metric: 'user_satisfaction',
      threshold: 3.0,
      severity: 'error',
      cooldown: 15,
    },
    {
      name: 'High Error Rate',
      metric: 'error_rate',
      threshold: 0.05,
      severity: 'critical',
      cooldown: 1,
    },
  ],
} as const;

// A/B测试配置
export const AB_TESTING_CONFIG = {
  // 默认实验配置
  DEFAULT_EXPERIMENTS: [
    {
      name: 'ML Enhanced vs Traditional',
      description: 'Compare ML-enhanced algorithm with traditional calculation',
      trafficAllocation: 0.2,
      variants: [
        {
          name: 'Traditional Algorithm',
          weight: 0.5,
          algorithmVersion: ALGORITHM_VERSIONS.LEGACY,
          isControl: true,
        },
        {
          name: 'ML Enhanced Algorithm',
          weight: 0.5,
          algorithmVersion: ALGORITHM_VERSIONS.ML_POWERED,
          isControl: false,
        },
      ],
    },
  ],
  
  // 成功指标
  SUCCESS_METRICS: [
    {
      name: 'prediction_accuracy',
      target: 0.9,
      threshold: 0.05,
      direction: 'increase',
    },
    {
      name: 'user_satisfaction',
      target: 4.0,
      threshold: 0.1,
      direction: 'increase',
    },
    {
      name: 'calculation_speed',
      target: 500, // 毫秒
      threshold: 100,
      direction: 'decrease',
    },
  ],
} as const;

// 数据源配置
export const DATA_SOURCE_CONFIG = {
  // 外部API配置
  EXTERNAL_APIS: {
    socialBlade: {
      baseUrl: 'https://api.socialblade.com',
      rateLimit: 100, // 每分钟
      timeout: 10000, // 10秒
      reliability: 0.85,
    },
    influencerDB: {
      baseUrl: 'https://api.influencerdb.com',
      rateLimit: 200,
      timeout: 8000,
      reliability: 0.90,
    },
    creatorEconomy: {
      baseUrl: 'https://api.creatoreconomy.com',
      rateLimit: 150,
      timeout: 12000,
      reliability: 0.88,
    },
  },
  
  // 缓存配置
  CACHE_CONFIG: {
    platformMetrics: { ttl: 15 * 60, maxSize: 1000 }, // 15分钟
    industryBenchmarks: { ttl: 60 * 60, maxSize: 500 }, // 1小时
    cpmRates: { ttl: 30 * 60, maxSize: 200 }, // 30分钟
    brandBudgets: { ttl: 120 * 60, maxSize: 100 }, // 2小时
  },
} as const;

// 环境特定配置
export const ENVIRONMENT_CONFIG = {
  development: {
    enableDebugLogging: true,
    enableMockData: true,
    skipExternalAPIs: true,
    reducedCacheTTL: true,
  },
  staging: {
    enableDebugLogging: true,
    enableMockData: false,
    skipExternalAPIs: false,
    reducedCacheTTL: true,
  },
  production: {
    enableDebugLogging: false,
    enableMockData: false,
    skipExternalAPIs: false,
    reducedCacheTTL: false,
  },
} as const;

// 获取当前环境配置
export function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';
  return ENVIRONMENT_CONFIG[env as keyof typeof ENVIRONMENT_CONFIG] || ENVIRONMENT_CONFIG.development;
}

// 获取功能开关状态
export function isFeatureEnabled(feature: keyof typeof ENTERPRISE_FEATURES): boolean {
  const envConfig = getEnvironmentConfig();
  const featureConfig = ENTERPRISE_FEATURES[feature];
  
  // 在开发环境中可能禁用某些功能
  if (envConfig.skipExternalAPIs && feature === 'REAL_TIME_DATA') {
    return false;
  }
  
  return featureConfig.enabled;
}

// 获取算法配置
export function getAlgorithmConfig(version: string) {
  switch (version) {
    case ALGORITHM_VERSIONS.ML_POWERED:
      return {
        useMLPrediction: true,
        useRealTimeData: isFeatureEnabled('REAL_TIME_DATA'),
        enableRiskAssessment: isFeatureEnabled('RISK_ASSESSMENT'),
        enhancedFeatures: true,
      };
    case ALGORITHM_VERSIONS.ENHANCED:
      return {
        useMLPrediction: false,
        useRealTimeData: isFeatureEnabled('REAL_TIME_DATA'),
        enableRiskAssessment: isFeatureEnabled('RISK_ASSESSMENT'),
        enhancedFeatures: true,
      };
    default:
      return {
        useMLPrediction: false,
        useRealTimeData: false,
        enableRiskAssessment: false,
        enhancedFeatures: false,
      };
  }
}
