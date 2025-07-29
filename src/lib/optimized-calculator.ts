/**
 * 优化的传统计算器
 * 使用2024年最新市场数据，保持向后兼容性
 */

import type {
  CalculatorInput,
  LegacyCalculatorInput,
  CalculationResult,
  EarningsBreakdown,
  InfluencingFactors,
} from '@/types';
import { ENHANCED_EARNINGS_CONFIG } from './enterprise-config';
import { clamp, average } from './utils';

// 企业级错误处理
class CalculationError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'CalculationError';
  }
}

// 企业级日志记录
class CalculationLogger {
  private static instance: CalculationLogger;

  static getInstance(): CalculationLogger {
    if (!CalculationLogger.instance) {
      CalculationLogger.instance = new CalculationLogger();
    }
    return CalculationLogger.instance;
  }

  log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
    };

    if (level === 'error') {
      console.error(`[${timestamp}] CALCULATION ERROR:`, message, data);
    } else if (level === 'warn') {
      console.warn(`[${timestamp}] CALCULATION WARNING:`, message, data);
    } else {
      console.log(`[${timestamp}] CALCULATION INFO:`, message, data);
    }
  }
}

const logger = CalculationLogger.getInstance();

/**
 * 转换新格式输入为传统格式
 */
function convertToLegacyInput(input: CalculatorInput): LegacyCalculatorInput {
  return {
    followers: input.metrics.followers || input.metrics.subscribers || 0,
    engagementRate: input.metrics.engagementRate || 3.5,
    niche: input.profile.contentNiche,
    location: input.profile.audienceLocation,
    postFrequency: input.profile.postFrequency || input.profile.uploadFrequency || 5,
    averageViews: input.metrics.avgViews || 0,
  };
}

/**
 * 优化的计算器类
 */
export class OptimizedCalculator {
  private input: LegacyCalculatorInput;
  private platform: string;

  constructor(input: CalculatorInput | LegacyCalculatorInput, platform: string = 'tiktok') {
    this.platform = platform;
    this.input = 'platform' in input ? convertToLegacyInput(input) : input;
    this.input = this.validateInput(this.input);
  }

  /**
   * 企业级输入验证
   */
  private validateInput(input: LegacyCalculatorInput): LegacyCalculatorInput {
    try {
      // 验证必需字段
      if (typeof input.followers !== 'number' || isNaN(input.followers)) {
        throw new CalculationError('Invalid followers count', 'INVALID_FOLLOWERS');
      }

      if (typeof input.engagementRate !== 'number' || isNaN(input.engagementRate)) {
        throw new CalculationError('Invalid engagement rate', 'INVALID_ENGAGEMENT_RATE');
      }

      if (!input.niche || typeof input.niche !== 'string') {
        throw new CalculationError('Invalid content niche', 'INVALID_NICHE');
      }

      if (!input.location || typeof input.location !== 'string') {
        throw new CalculationError('Invalid audience location', 'INVALID_LOCATION');
      }

      // 安全地约束数值
      const validated = {
        followers: clamp(Math.floor(input.followers), 100, 100000000),
        engagementRate: clamp(Number(input.engagementRate), 0.1, 20.0),
        niche: input.niche.toLowerCase().trim(),
        location: input.location.toLowerCase().trim(),
        postFrequency: clamp(Math.floor(input.postFrequency || 5), 1, 50),
        averageViews: clamp(Math.floor(input.averageViews || 0), 0, 1000000000),
      };

      logger.log('info', 'Input validation successful', {
        platform: this.platform,
        followers: validated.followers,
        niche: validated.niche,
        location: validated.location,
      });

      return validated;

    } catch (error) {
      logger.log('error', 'Input validation failed', { input, error: error.message });
      throw error;
    }
  }

  /**
   * 获取粉丝等级
   */
  private getFollowerTier(): 'nano' | 'micro' | 'mid' | 'macro' | 'mega' {
    const { followers } = this.input;
    if (followers < 10000) return 'nano';
    if (followers < 100000) return 'micro';
    if (followers < 1000000) return 'mid';
    if (followers < 10000000) return 'macro';
    return 'mega';
  }

  /**
   * 企业级收益计算
   */
  calculate(): CalculationResult {
    const startTime = Date.now();

    try {
      const { followers, engagementRate, niche, location, postFrequency, averageViews } = this.input;

      logger.log('info', 'Starting calculation', {
        platform: this.platform,
        followers,
        niche,
        location,
      });

      // 获取优化配置
      const platformRates = ENHANCED_EARNINGS_CONFIG.PLATFORM_BASE_RATES[this.platform as keyof typeof ENHANCED_EARNINGS_CONFIG.PLATFORM_BASE_RATES];
      if (!platformRates) {
        throw new CalculationError(`Unsupported platform: ${this.platform}`, 'UNSUPPORTED_PLATFORM');
      }

      const nicheConfig = ENHANCED_EARNINGS_CONFIG.ENHANCED_NICHE_CONFIG[niche as keyof typeof ENHANCED_EARNINGS_CONFIG.ENHANCED_NICHE_CONFIG] ||
                         ENHANCED_EARNINGS_CONFIG.ENHANCED_NICHE_CONFIG.lifestyle;
      const locationConfig = ENHANCED_EARNINGS_CONFIG.ENHANCED_LOCATION_CONFIG[location as keyof typeof ENHANCED_EARNINGS_CONFIG.ENHANCED_LOCATION_CONFIG] ||
                            ENHANCED_EARNINGS_CONFIG.ENHANCED_LOCATION_CONFIG.other;

      if (!nicheConfig) {
        logger.log('warn', `Unknown niche: ${niche}, using lifestyle defaults`);
      }

      if (!locationConfig) {
        logger.log('warn', `Unknown location: ${location}, using other defaults`);
      }

      // 计算收益明细
      const breakdown = this.calculateEarningsBreakdown(platformRates, nicheConfig, locationConfig);

      // 验证收益明细
      const breakdownValues = Object.values(breakdown);
      if (breakdownValues.some(value => typeof value !== 'number' || isNaN(value) || value < 0)) {
        throw new CalculationError('Invalid earnings breakdown calculated', 'INVALID_BREAKDOWN');
      }

      // 计算总收益
      const monthlyEarnings = breakdownValues.reduce((sum, value) => sum + value, 0);
      const yearlyEarnings = monthlyEarnings * 12;

      // 计算每帖收益和每千次观看收益
      const postsPerMonth = postFrequency * 4.33;
      const perPostEarnings = postsPerMonth > 0 ? monthlyEarnings / postsPerMonth : 0;
      const perThousandViewsEarnings = averageViews > 0 ? (perPostEarnings / averageViews) * 1000 : 0;

      // 分析影响因素
      const factors = this.analyzeInfluencingFactors(nicheConfig, locationConfig);

      // 生成建议
      const tips = this.generateTips();

      const calculationTime = Date.now() - startTime;
      logger.log('info', 'Calculation completed successfully', {
        platform: this.platform,
        monthlyEarnings,
        calculationTime,
      });

      return {
        monthlyEarnings: Math.round(monthlyEarnings * 100) / 100,
        yearlyEarnings: Math.round(yearlyEarnings * 100) / 100,
        perPostEarnings: Math.round(perPostEarnings * 100) / 100,
        perThousandViewsEarnings: Math.round(perThousandViewsEarnings * 100) / 100,
        breakdown,
        factors,
        tips,
      };

    } catch (error) {
      const calculationTime = Date.now() - startTime;
      logger.log('error', 'Calculation failed', {
        platform: this.platform,
        error: error.message,
        calculationTime,
      });

      if (error instanceof CalculationError) {
        throw error;
      }

      throw new CalculationError(
        `Calculation failed: ${error.message}`,
        'CALCULATION_FAILED',
        { originalError: error }
      );
    }
  }

  /**
   * 企业级收益明细计算
   */
  private calculateEarningsBreakdown(platformRates: any, nicheConfig: any, locationConfig: any): EarningsBreakdown {
    try {
      const { followers, engagementRate, postFrequency, averageViews } = this.input;
      const followerTier = this.getFollowerTier();
      const monthlyViews = averageViews * postFrequency * 4.33;

      // 验证计算参数
      if (!platformRates || !nicheConfig || !locationConfig) {
        throw new CalculationError('Missing configuration data', 'MISSING_CONFIG');
      }

      if (monthlyViews < 0 || !isFinite(monthlyViews)) {
        throw new CalculationError('Invalid monthly views calculation', 'INVALID_VIEWS');
      }

      if (this.platform === 'tiktok') {
        // TikTok收益计算 - 企业级精确算法
        try {
          // 验证TikTok特定配置
          if (!platformRates.creatorFundCPM || !platformRates.brandDealRates || !platformRates.liveGiftRates) {
            throw new CalculationError('Missing TikTok platform configuration', 'MISSING_TIKTOK_CONFIG');
          }

          // 创作者基金
          const creatorFundCPM = platformRates.creatorFundCPM.average || 0.028;
          const creatorFund = (monthlyViews / 1000) * creatorFundCPM *
                             locationConfig.multiplier * nicheConfig.multiplier;

          // 品牌合作
          const brandDealRate = platformRates.brandDealRates[followerTier]?.average || 0;
          const brandAffinityScore = nicheConfig.brandAffinityScore || 0.7;
          const brandSpendingIndex = locationConfig.brandSpendingIndex || 0.5;
          const engagementBonus = Math.min(2.0, Math.max(0.1, engagementRate / 3.5));
          const brandPartnerships = (followers / 1000) * brandDealRate *
                                   brandAffinityScore * brandSpendingIndex * engagementBonus;

          // 直播礼物
          const baseGiftRate = platformRates.liveGiftRates.baseRate || 0.0015;
          const engagementMultiplier = platformRates.liveGiftRates.engagementMultiplier || 2.5;
          const locationMultiplier = platformRates.liveGiftRates.locationMultiplier?.[this.input.location] ||
                                    platformRates.liveGiftRates.locationMultiplier?.other || 0.4;
          const liveGifts = followers * baseGiftRate *
                           Math.pow(Math.max(0.1, engagementRate / 3.5), engagementMultiplier) *
                           locationMultiplier;

          // 联盟营销
          const affiliateRate = platformRates.affiliateRates?.[this.input.niche] ||
                                platformRates.affiliateRates?.other || 0.018;
          const clickThroughRate = 0.015; // 1.5%点击率
          const purchasingPower = locationConfig.purchasingPower || 0.5;
          const affiliateMarketing = monthlyViews * clickThroughRate * affiliateRate * purchasingPower;

          // 商品销售
          const baseConversion = platformRates.merchandiseRates?.baseConversion || 0.008;
          const loyaltyMultiplier = platformRates.merchandiseRates?.loyaltyMultiplier || 1.8;
          const nicheMultiplier = platformRates.merchandiseRates?.nicheMultiplier?.[this.input.niche] ||
                                 platformRates.merchandiseRates?.nicheMultiplier?.other || 0.8;
          const loyaltyScore = Math.min(2.0, Math.max(0.1, engagementRate / 2.5));
          const merchandise = followers * baseConversion * loyaltyScore * loyaltyMultiplier *
                             nicheMultiplier * purchasingPower * 30;

          // 其他收入
          const totalPrimaryIncome = creatorFund + brandPartnerships + liveGifts + affiliateMarketing + merchandise;
          const other = totalPrimaryIncome * 0.08;

          // 验证计算结果
          const results = {
            creatorFund: Math.max(0, Math.round(creatorFund * 100) / 100),
            brandPartnerships: Math.max(0, Math.round(brandPartnerships * 100) / 100),
            liveGifts: Math.max(0, Math.round(liveGifts * 100) / 100),
            affiliateMarketing: Math.max(0, Math.round(affiliateMarketing * 100) / 100),
            merchandise: Math.max(0, Math.round(merchandise * 100) / 100),
            other: Math.max(0, Math.round(other * 100) / 100),
          };

          // 验证所有值都是有效数字
          for (const [key, value] of Object.entries(results)) {
            if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
              throw new CalculationError(`Invalid ${key} calculation result`, 'INVALID_CALCULATION_RESULT');
            }
          }

          return results;

        } catch (error) {
          logger.log('error', 'TikTok calculation failed', { error: error.message });
          throw error;
        }
    } else if (this.platform === 'instagram') {
      // Instagram收益计算
      const creatorFund = (monthlyViews / 1000) * platformRates.creatorFundCPM.average * 
                         locationConfig.multiplier * nicheConfig.multiplier;
      
      const brandPartnerships = (followers / 1000) * platformRates.brandDealRates[followerTier].average * 
                               nicheConfig.brandAffinityScore * locationConfig.brandSpendingIndex * 
                               Math.min(2.2, engagementRate / 3.0);
      
      const affiliateMarketing = monthlyViews * 0.022 * 
                                (platformRates.affiliateRates[this.input.niche] || platformRates.affiliateRates.other) * 
                                locationConfig.purchasingPower;
      
      const merchandise = followers * platformRates.merchandiseRates.baseConversion * 
                         Math.min(2.2, engagementRate / 2.0) * platformRates.merchandiseRates.loyaltyMultiplier * 
                         (platformRates.merchandiseRates.nicheMultiplier[this.input.niche] || 
                          platformRates.merchandiseRates.nicheMultiplier.other) * 
                         locationConfig.purchasingPower * 30;
      
      const other = (creatorFund + brandPartnerships + affiliateMarketing + merchandise) * 0.06;

      return {
        creatorFund: Math.round(creatorFund * 100) / 100,
        brandPartnerships: Math.round(brandPartnerships * 100) / 100,
        liveGifts: 0, // Instagram doesn't have live gifts
        affiliateMarketing: Math.round(affiliateMarketing * 100) / 100,
        merchandise: Math.round(merchandise * 100) / 100,
        other: Math.round(other * 100) / 100,
      };
    } else if (this.platform === 'youtube') {
      // YouTube收益计算
      const adRevenue = (monthlyViews / 1000) * platformRates.adRevenueCPM.average * 
                       locationConfig.multiplier * nicheConfig.multiplier * 0.55;
      
      const brandPartnerships = (followers / 1000) * platformRates.brandDealRates[followerTier].average * 
                               nicheConfig.brandAffinityScore * locationConfig.brandSpendingIndex * 
                               Math.min(2.0, engagementRate / 4.0);
      
      const memberships = followers * platformRates.membershipRates.baseRate * 
                         Math.min(2.5, engagementRate / 3.0) * platformRates.membershipRates.loyaltyFactor * 
                         platformRates.membershipRates.contentQualityMultiplier * locationConfig.purchasingPower * 5;
      
      const superChat = followers * platformRates.superChatRates.baseRate * 
                       (postFrequency * 0.3) * platformRates.superChatRates.liveFrequencyMultiplier * 
                       locationConfig.purchasingPower * 30;
      
      const affiliateMarketing = monthlyViews * 0.018 * 
                                (platformRates.affiliateRates[this.input.niche] || platformRates.affiliateRates.other) * 
                                locationConfig.purchasingPower;
      
      const other = (adRevenue + brandPartnerships + memberships + superChat + affiliateMarketing) * 0.05;

      return {
        creatorFund: Math.round(adRevenue * 100) / 100, // Map adRevenue to creatorFund
        brandPartnerships: Math.round(brandPartnerships * 100) / 100,
        liveGifts: Math.round((memberships + superChat) * 100) / 100, // Map memberships + superChat to liveGifts
        affiliateMarketing: Math.round(affiliateMarketing * 100) / 100,
        merchandise: 0, // YouTube doesn't typically have merchandise through the platform
        other: Math.round(other * 100) / 100,
      };
    }

      // 默认返回空对象（不应该到达这里）
      throw new CalculationError(`Unsupported platform: ${this.platform}`, 'UNSUPPORTED_PLATFORM');

    } catch (error) {
      logger.log('error', 'Earnings breakdown calculation failed', {
        platform: this.platform,
        error: error.message,
      });

      if (error instanceof CalculationError) {
        throw error;
      }

      throw new CalculationError(
        `Earnings breakdown calculation failed: ${error.message}`,
        'BREAKDOWN_CALCULATION_FAILED',
        { originalError: error }
      );
    }
  }

  /**
   * 企业级影响因素分析
   */
  private analyzeInfluencingFactors(nicheConfig: any, locationConfig: any): InfluencingFactors {
    try {
      const { engagementRate, postFrequency, followers, averageViews } = this.input;

      // 安全地获取配置值
      const nicheMultiplier = nicheConfig?.multiplier || 1.0;
      const locationMultiplier = locationConfig?.multiplier || 1.0;

      // 计算内容质量评分
      const viewToFollowerRatio = followers > 0 ? averageViews / followers : 0;
      const qualityScore = Math.min(10, Math.max(0, viewToFollowerRatio * 10));

      return {
        engagement: {
          score: Math.round(engagementRate * 10) / 10,
          impact: engagementRate >= 5 ? 'high' : engagementRate >= 3 ? 'medium' : 'low',
          description: `${engagementRate.toFixed(1)}% engagement rate`,
        },
        niche: {
          multiplier: Math.round(nicheMultiplier * 100) / 100,
          impact: nicheMultiplier >= 1.5 ? 'high' : nicheMultiplier >= 1.2 ? 'medium' : 'low',
          description: `${this.input.niche} niche with ${nicheMultiplier.toFixed(2)}x multiplier`,
        },
        location: {
          multiplier: Math.round(locationMultiplier * 100) / 100,
          impact: locationMultiplier >= 0.8 ? 'high' : locationMultiplier >= 0.5 ? 'medium' : 'low',
          description: `${this.input.location} market with ${locationMultiplier.toFixed(2)}x multiplier`,
        },
        consistency: {
          score: postFrequency,
          impact: postFrequency >= 7 ? 'high' : postFrequency >= 3 ? 'medium' : 'low',
          description: `${postFrequency} posts per week`,
        },
        quality: {
          score: Math.round(qualityScore * 10) / 10,
          impact: qualityScore >= 7 ? 'high' : qualityScore >= 4 ? 'medium' : 'low',
          description: `Content quality score: ${qualityScore.toFixed(1)}/10 (based on view-to-follower ratio)`,
        },
      };

    } catch (error) {
      logger.log('error', 'Factor analysis failed', { error: error.message });

      // 返回默认值
      return {
        engagement: {
          score: this.input.engagementRate,
          impact: 'medium',
          description: 'Engagement rate analysis failed',
        },
        niche: {
          multiplier: 1.0,
          impact: 'medium',
          description: 'Niche analysis failed',
        },
        location: {
          multiplier: 1.0,
          impact: 'medium',
          description: 'Location analysis failed',
        },
        consistency: {
          score: this.input.postFrequency,
          impact: 'medium',
          description: 'Consistency analysis failed',
        },
        quality: {
          score: 5,
          impact: 'medium',
          description: 'Quality analysis failed',
        },
      };
    }
  }

  /**
   * 企业级优化建议生成
   */
  private generateTips(): string[] {
    try {
      const { engagementRate, postFrequency, followers, averageViews } = this.input;
      const tips: string[] = [];

      // 基于互动率的建议
      if (engagementRate < 2) {
        tips.push('🚨 Critical: Your engagement rate is very low. Focus on creating highly interactive content with polls, questions, and calls-to-action');
      } else if (engagementRate < 3) {
        tips.push('⚠️ Focus on creating more engaging content to boost your engagement rate above 3%');
      } else if (engagementRate > 8) {
        tips.push('🎉 Excellent engagement rate! Leverage this for premium brand partnerships');
      }

      // 基于发布频率的建议
      if (postFrequency < 3) {
        tips.push('📅 Increase your posting frequency to at least 3-5 times per week for better algorithm visibility');
      } else if (postFrequency < 5) {
        tips.push('📈 Consider posting daily to maximize reach and audience retention');
      } else if (postFrequency > 15) {
        tips.push('⚖️ Consider quality over quantity - too many posts might overwhelm your audience');
      }

      // 基于粉丝数量的建议
      if (followers < 1000) {
        tips.push('🌱 Focus on consistent, high-quality content to reach the 1K milestone for monetization');
      } else if (followers < 10000) {
        tips.push('🚀 You\'re in the nano-influencer category - perfect for authentic brand partnerships');
      } else if (followers > 100000) {
        tips.push('💼 Consider working with talent agencies to maximize your earning potential');
      }

      // 基于观看率的建议
      const viewRate = followers > 0 ? (averageViews / followers) * 100 : 0;
      if (viewRate < 10) {
        tips.push('👀 Your view rate is low - experiment with trending hashtags and optimal posting times');
      } else if (viewRate > 50) {
        tips.push('🔥 Great view rate! Your content resonates well with your audience');
      }

      // 平台特定建议
      if (this.platform === 'tiktok') {
        tips.push('🎵 Use trending sounds and participate in viral challenges to boost discoverability');
        tips.push('💝 Enable live streaming to increase direct fan engagement and gift revenue');
      } else if (this.platform === 'instagram') {
        tips.push('📱 Utilize Instagram Stories and Reels for higher engagement rates');
        tips.push('🛍️ Set up Instagram Shopping to monetize your posts directly');
      } else if (this.platform === 'youtube') {
        tips.push('💰 Enable all monetization features: ads, memberships, and Super Chat');
        tips.push('📺 Create longer-form content for better ad revenue potential');
      }

      // 通用建议
      tips.push('🤝 Diversify your revenue streams by exploring brand partnerships and affiliate marketing');
      tips.push('💬 Build a loyal community by consistently responding to comments and messages');
      tips.push('📊 Track your analytics regularly to understand what content performs best');

      // 确保至少有一些建议
      if (tips.length === 0) {
        tips.push('Keep creating consistent, high-quality content to grow your audience and earnings');
        tips.push('Engage with your community regularly to build stronger relationships');
      }

      return tips;

    } catch (error) {
      logger.log('error', 'Tips generation failed', { error: error.message });

      // 返回默认建议
      return [
        'Focus on creating consistent, high-quality content',
        'Engage with your audience regularly',
        'Explore different monetization opportunities',
        'Track your performance metrics to optimize your strategy',
      ];
    }
  }
}

/**
 * 主要的计算函数（向后兼容）
 */
export function calculateEarnings(input: CalculatorInput): CalculationResult {
  const calculator = new OptimizedCalculator(input, input.platform);
  return calculator.calculate();
}
