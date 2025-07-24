import type {
  CalculatorInput,
  LegacyCalculatorInput,
  CalculationResult,
  EarningsBreakdown,
  InfluencingFactors,
} from '@/types';
import {
  NICHE_CONFIG,
  LOCATION_CONFIG,
  EARNINGS_BASE,
  ENGAGEMENT_FACTORS,
  FREQUENCY_FACTORS,
  FOLLOWER_TIERS,
} from './constants';
import { clamp, average } from './utils';

/**
 * 转换新格式输入为旧格式
 */
function convertToLegacyInput(input: CalculatorInput): LegacyCalculatorInput {
  const { metrics, profile } = input;

  return {
    followers: metrics.followers || metrics.subscribers || 0,
    engagementRate: metrics.engagementRate || 0,
    niche: profile.contentNiche,
    location: profile.audienceLocation,
    postFrequency: profile.postFrequency || profile.uploadFrequency || 0,
    averageViews: metrics.avgViews || 0,
  };
}

/**
 * TikTok创作者收益计算器核心引擎
 */
export class TikTokCalculator {
  private input: LegacyCalculatorInput;
  private nicheMultiplier: number;
  private locationMultiplier: number;
  private engagementMultiplier: number;
  private frequencyMultiplier: number;
  private followerTier: keyof typeof FOLLOWER_TIERS;

  constructor(input: CalculatorInput | LegacyCalculatorInput) {
    // 如果是新格式，转换为旧格式
    const legacyInput = 'platform' in input ? convertToLegacyInput(input) : input;
    this.input = this.validateInput(legacyInput);
    this.nicheMultiplier = this.calculateNicheMultiplier();
    this.locationMultiplier = this.calculateLocationMultiplier();
    this.engagementMultiplier = this.calculateEngagementMultiplier();
    this.frequencyMultiplier = this.calculateFrequencyMultiplier();
    this.followerTier = this.determineFollowerTier();
  }

  /**
   * 验证输入参数
   */
  private validateInput(input: LegacyCalculatorInput): LegacyCalculatorInput {
    return {
      followers: clamp(input.followers, 100, 100000000),
      engagementRate: clamp(input.engagementRate, 0.1, 20.0),
      niche: input.niche,
      location: input.location,
      postFrequency: clamp(input.postFrequency, 1, 50),
      averageViews: clamp(input.averageViews, 100, 1000000000),
    };
  }

  /**
   * 计算细分领域影响因子
   */
  private calculateNicheMultiplier(): number {
    const config = NICHE_CONFIG[this.input.niche as keyof typeof NICHE_CONFIG];
    return config?.multiplier || 1.0;
  }

  /**
   * 计算地理位置影响因子
   */
  private calculateLocationMultiplier(): number {
    const config = LOCATION_CONFIG[this.input.location as keyof typeof LOCATION_CONFIG];
    return config?.multiplier || 0.5;
  }

  /**
   * 计算互动率影响因子
   */
  private calculateEngagementMultiplier(): number {
    const { engagementRate } = this.input;
    
    if (engagementRate >= ENGAGEMENT_FACTORS.excellent.min) {
      return ENGAGEMENT_FACTORS.excellent.multiplier;
    } else if (engagementRate >= ENGAGEMENT_FACTORS.good.min) {
      return ENGAGEMENT_FACTORS.good.multiplier;
    } else if (engagementRate >= ENGAGEMENT_FACTORS.average.min) {
      return ENGAGEMENT_FACTORS.average.multiplier;
    } else {
      return ENGAGEMENT_FACTORS.poor.multiplier;
    }
  }

  /**
   * 计算发布频率影响因子
   */
  private calculateFrequencyMultiplier(): number {
    const { postFrequency } = this.input;
    
    if (postFrequency >= FREQUENCY_FACTORS.daily.min) {
      return FREQUENCY_FACTORS.daily.multiplier;
    } else if (postFrequency >= FREQUENCY_FACTORS.frequent.min) {
      return FREQUENCY_FACTORS.frequent.multiplier;
    } else if (postFrequency >= FREQUENCY_FACTORS.regular.min) {
      return FREQUENCY_FACTORS.regular.multiplier;
    } else {
      return FREQUENCY_FACTORS.occasional.multiplier;
    }
  }

  /**
   * 确定粉丝数量等级
   */
  private determineFollowerTier(): keyof typeof FOLLOWER_TIERS {
    const { followers } = this.input;
    
    for (const [tier, config] of Object.entries(FOLLOWER_TIERS)) {
      if (followers >= config.min && followers < config.max) {
        return tier as keyof typeof FOLLOWER_TIERS;
      }
    }
    
    return 'nano';
  }

  /**
   * 计算创作者基金收益
   */
  private calculateCreatorFundEarnings(): number {
    const { averageViews, postFrequency } = this.input;
    const monthlyViews = averageViews * postFrequency * 4.33; // 平均每月
    const baseEarnings = (monthlyViews / 1000) * EARNINGS_BASE.creatorFundPer1K;
    
    return baseEarnings * this.locationMultiplier * this.engagementMultiplier;
  }

  /**
   * 计算直播礼物收益
   */
  private calculateLiveGiftsEarnings(): number {
    const { followers } = this.input;
    const baseEarnings = followers * EARNINGS_BASE.liveGiftsPerFollower;
    
    // 直播礼物主要受粉丝数和互动率影响
    return baseEarnings * this.engagementMultiplier * this.locationMultiplier;
  }

  /**
   * 计算品牌合作收益
   */
  private calculateBrandPartnershipEarnings(): number {
    const { followers, engagementRate } = this.input;
    
    // 品牌合作基础价格计算
    let baseRate = followers * EARNINGS_BASE.brandPartnershipBase;
    
    // 根据粉丝等级调整基础价格
    switch (this.followerTier) {
      case 'nano':
        baseRate *= 0.5;
        break;
      case 'micro':
        baseRate *= 0.8;
        break;
      case 'mid':
        baseRate *= 1.2;
        break;
      case 'macro':
        baseRate *= 1.8;
        break;
      case 'mega':
        baseRate *= 2.5;
        break;
    }
    
    // 应用所有影响因子
    return baseRate * 
           this.nicheMultiplier * 
           this.locationMultiplier * 
           this.engagementMultiplier * 
           (engagementRate / 3.5); // 标准化到平均互动率
  }

  /**
   * 计算联盟营销收益
   */
  private calculateAffiliateMarketingEarnings(): number {
    const { averageViews, postFrequency } = this.input;
    const monthlyViews = averageViews * postFrequency * 4.33;
    const baseEarnings = (monthlyViews / 1000) * EARNINGS_BASE.affiliateMarketingPer1K;
    
    return baseEarnings * this.nicheMultiplier * this.locationMultiplier;
  }

  /**
   * 计算商品销售收益
   */
  private calculateMerchandiseEarnings(): number {
    const { followers } = this.input;
    const baseEarnings = followers * EARNINGS_BASE.merchandisePerFollower;
    
    // 商品销售主要受粉丝忠诚度和细分领域影响
    return baseEarnings * this.nicheMultiplier * this.engagementMultiplier;
  }

  /**
   * 计算其他收入
   */
  private calculateOtherEarnings(totalMainEarnings: number): number {
    return totalMainEarnings * EARNINGS_BASE.otherIncomeRatio;
  }

  /**
   * 计算收入明细
   */
  private calculateEarningsBreakdown(): EarningsBreakdown {
    const creatorFund = this.calculateCreatorFundEarnings();
    const liveGifts = this.calculateLiveGiftsEarnings();
    const brandPartnerships = this.calculateBrandPartnershipEarnings();
    const affiliateMarketing = this.calculateAffiliateMarketingEarnings();
    const merchandise = this.calculateMerchandiseEarnings();
    
    const mainEarnings = creatorFund + liveGifts + brandPartnerships + affiliateMarketing + merchandise;
    const other = this.calculateOtherEarnings(mainEarnings);
    
    return {
      creatorFund,
      liveGifts,
      brandPartnerships,
      affiliateMarketing,
      merchandise,
      other,
    };
  }

  /**
   * 分析影响因素
   */
  private analyzeInfluencingFactors(): InfluencingFactors {
    const { engagementRate, postFrequency } = this.input;
    
    return {
      engagement: {
        score: engagementRate,
        impact: engagementRate >= 4.0 ? 'high' : engagementRate >= 2.0 ? 'medium' : 'low',
        description: this.getEngagementDescription(engagementRate),
      },
      niche: {
        multiplier: this.nicheMultiplier,
        impact: this.nicheMultiplier >= 1.3 ? 'high' : this.nicheMultiplier >= 1.1 ? 'medium' : 'low',
        description: this.getNicheDescription(),
      },
      location: {
        multiplier: this.locationMultiplier,
        impact: this.locationMultiplier >= 0.8 ? 'high' : this.locationMultiplier >= 0.5 ? 'medium' : 'low',
        description: this.getLocationDescription(),
      },
      consistency: {
        score: postFrequency,
        impact: postFrequency >= 7 ? 'high' : postFrequency >= 3 ? 'medium' : 'low',
        description: this.getConsistencyDescription(postFrequency),
      },
      quality: {
        score: this.calculateQualityScore(),
        impact: 'medium', // 基于多个因素的综合评估
        description: this.getQualityDescription(),
      },
    };
  }

  /**
   * 计算内容质量评分
   */
  private calculateQualityScore(): number {
    const { averageViews, followers, engagementRate } = this.input;
    
    // 观看量与粉丝数的比率
    const viewToFollowerRatio = averageViews / followers;
    
    // 综合质量评分 (0-10)
    const qualityScore = Math.min(10, (
      (viewToFollowerRatio * 2) + // 观看率权重
      (engagementRate * 1.5) + // 互动率权重
      (this.frequencyMultiplier * 2) // 发布频率权重
    ) / 2);
    
    return Math.round(qualityScore * 10) / 10;
  }

  /**
   * 生成提升收益的建议
   */
  private generateTips(): string[] {
    const tips: string[] = [];
    const { engagementRate, postFrequency, averageViews, followers } = this.input;
    
    // 基于互动率的建议
    if (engagementRate < 2.0) {
      tips.push('Improve engagement by asking questions and responding to comments');
      tips.push('Create more interactive content like polls and challenges');
    }
    
    // 基于发布频率的建议
    if (postFrequency < 3) {
      tips.push('Increase posting frequency to maintain audience engagement');
      tips.push('Develop a consistent content calendar');
    }
    
    // 基于观看量的建议
    const viewToFollowerRatio = averageViews / followers;
    if (viewToFollowerRatio < 0.1) {
      tips.push('Optimize posting times when your audience is most active');
      tips.push('Use trending hashtags and sounds to increase discoverability');
    }
    
    // 基于细分领域的建议
    if (this.nicheMultiplier < 1.2) {
      tips.push('Consider focusing on higher-value niches like tech or business');
      tips.push('Collaborate with creators in profitable niches');
    }
    
    // 基于粉丝等级的建议
    if (this.followerTier === 'nano' || this.followerTier === 'micro') {
      tips.push('Focus on growing your follower base through consistent, quality content');
      tips.push('Engage with your community to build loyal followers');
    }
    
    // 通用建议
    tips.push('Diversify your income streams beyond just one platform');
    tips.push('Build an email list to maintain direct contact with your audience');
    
    return tips.slice(0, 5); // 限制为5个建议
  }

  /**
   * 获取互动率描述
   */
  private getEngagementDescription(rate: number): string {
    if (rate >= 6.0) return 'Excellent engagement rate - your audience is highly active';
    if (rate >= 4.0) return 'Good engagement rate - above average audience interaction';
    if (rate >= 2.0) return 'Average engagement rate - room for improvement';
    return 'Low engagement rate - focus on creating more engaging content';
  }

  /**
   * 获取细分领域描述
   */
  private getNicheDescription(): string {
    const config = NICHE_CONFIG[this.input.niche as keyof typeof NICHE_CONFIG];
    return config?.description || 'General content category';
  }

  /**
   * 获取地理位置描述
   */
  private getLocationDescription(): string {
    const config = LOCATION_CONFIG[this.input.location as keyof typeof LOCATION_CONFIG];
    const maturity = config?.marketMaturity || 'medium';
    
    switch (maturity) {
      case 'high':
        return 'High-value market with strong monetization opportunities';
      case 'medium':
        return 'Developing market with moderate monetization potential';
      case 'low':
        return 'Emerging market with growing monetization opportunities';
      default:
        return 'Market with average monetization potential';
    }
  }

  /**
   * 获取发布一致性描述
   */
  private getConsistencyDescription(frequency: number): string {
    if (frequency >= 7) return 'Daily posting - excellent consistency';
    if (frequency >= 4) return 'Frequent posting - good consistency';
    if (frequency >= 2) return 'Regular posting - average consistency';
    return 'Occasional posting - improve consistency for better results';
  }

  /**
   * 获取内容质量描述
   */
  private getQualityDescription(): string {
    const score = this.calculateQualityScore();
    
    if (score >= 8.0) return 'High-quality content with strong performance metrics';
    if (score >= 6.0) return 'Good content quality with room for optimization';
    if (score >= 4.0) return 'Average content quality - focus on improvement';
    return 'Content quality needs significant improvement';
  }

  /**
   * 执行完整计算
   */
  public calculate(): CalculationResult {
    const breakdown = this.calculateEarningsBreakdown();
    const monthlyEarnings = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
    const yearlyEarnings = monthlyEarnings * 12;
    const perPostEarnings = monthlyEarnings / (this.input.postFrequency * 4.33);
    const perThousandViewsEarnings = (monthlyEarnings / (this.input.averageViews * this.input.postFrequency * 4.33)) * 1000;
    
    return {
      monthlyEarnings: Math.round(monthlyEarnings * 100) / 100,
      yearlyEarnings: Math.round(yearlyEarnings * 100) / 100,
      perPostEarnings: Math.round(perPostEarnings * 100) / 100,
      perThousandViewsEarnings: Math.round(perThousandViewsEarnings * 100) / 100,
      breakdown: {
        creatorFund: Math.round(breakdown.creatorFund * 100) / 100,
        liveGifts: Math.round(breakdown.liveGifts * 100) / 100,
        brandPartnerships: Math.round(breakdown.brandPartnerships * 100) / 100,
        affiliateMarketing: Math.round(breakdown.affiliateMarketing * 100) / 100,
        merchandise: Math.round(breakdown.merchandise * 100) / 100,
        other: Math.round(breakdown.other * 100) / 100,
      },
      factors: this.analyzeInfluencingFactors(),
      tips: this.generateTips(),
    };
  }
}

/**
 * 便捷的计算函数
 */
export function calculateEarnings(input: CalculatorInput | LegacyCalculatorInput): CalculationResult {
  const calculator = new TikTokCalculator(input);
  return calculator.calculate();
}

/**
 * 多平台计算器工厂
 */
export function createCalculator(input: CalculatorInput): CalculationResult {
  switch (input.platform) {
    case 'tiktok':
      return new TikTokCalculator(input).calculate();
    case 'instagram':
      return new InstagramCalculator(input).calculate();
    case 'youtube':
      return new YouTubeCalculator(input).calculate();
    default:
      throw new Error(`Unsupported platform: ${input.platform}`);
  }
}

/**
 * 批量计算多个场景
 */
export function calculateMultipleScenarios(
  baseInput: CalculatorInput,
  variations: Partial<CalculatorInput>[]
): CalculationResult[] {
  return variations.map(variation => {
    const input = { ...baseInput, ...variation };
    return createCalculator(input);
  });
}

/**
 * 计算收益增长潜力
 */
export function calculateGrowthPotential(
  currentInput: CalculatorInput,
  targetFollowers: number,
  targetEngagement: number
): {
  current: CalculationResult;
  potential: CalculationResult;
  growthFactor: number;
} {
  const current = createCalculator(currentInput);

  // 创建目标输入
  const potentialInput = { ...currentInput };
  if (currentInput.platform === 'youtube') {
    potentialInput.metrics.subscribers = targetFollowers;
  } else {
    potentialInput.metrics.followers = targetFollowers;
  }
  potentialInput.metrics.engagementRate = targetEngagement;

  const potential = createCalculator(potentialInput);

  const growthFactor = potential.monthlyEarnings / current.monthlyEarnings;

  return {
    current,
    potential,
    growthFactor: Math.round(growthFactor * 100) / 100,
  };
}

/**
 * Instagram创作者收益计算器
 */
export class InstagramCalculator {
  private input: LegacyCalculatorInput;
  private nicheMultiplier: number;
  private locationMultiplier: number;
  private engagementMultiplier: number;
  private followerTier: keyof typeof FOLLOWER_TIERS;

  constructor(input: CalculatorInput | LegacyCalculatorInput) {
    const legacyInput = 'platform' in input ? convertToLegacyInput(input) : input;
    this.input = this.validateInput(legacyInput);
    this.nicheMultiplier = this.calculateNicheMultiplier();
    this.locationMultiplier = this.calculateLocationMultiplier();
    this.engagementMultiplier = this.calculateEngagementMultiplier();
    this.followerTier = this.determineFollowerTier();
  }

  private validateInput(input: LegacyCalculatorInput): LegacyCalculatorInput {
    return {
      followers: clamp(input.followers, 100, 100000000),
      engagementRate: clamp(input.engagementRate, 0.1, 20.0),
      niche: input.niche,
      location: input.location,
      postFrequency: clamp(input.postFrequency, 1, 50),
      averageViews: clamp(input.averageViews, 100, 1000000000),
    };
  }

  private calculateNicheMultiplier(): number {
    const config = NICHE_CONFIG[this.input.niche as keyof typeof NICHE_CONFIG];
    return config?.multiplier || 1.0;
  }

  private calculateLocationMultiplier(): number {
    const config = LOCATION_CONFIG[this.input.location as keyof typeof LOCATION_CONFIG];
    return config?.multiplier || 0.5;
  }

  private calculateEngagementMultiplier(): number {
    const { engagementRate } = this.input;

    if (engagementRate >= ENGAGEMENT_FACTORS.excellent.min) {
      return ENGAGEMENT_FACTORS.excellent.multiplier;
    } else if (engagementRate >= ENGAGEMENT_FACTORS.good.min) {
      return ENGAGEMENT_FACTORS.good.multiplier;
    } else if (engagementRate >= ENGAGEMENT_FACTORS.average.min) {
      return ENGAGEMENT_FACTORS.average.multiplier;
    } else {
      return ENGAGEMENT_FACTORS.poor.multiplier;
    }
  }

  private determineFollowerTier(): keyof typeof FOLLOWER_TIERS {
    const { followers } = this.input;

    for (const [tier, config] of Object.entries(FOLLOWER_TIERS)) {
      if (followers >= config.min && followers < config.max) {
        return tier as keyof typeof FOLLOWER_TIERS;
      }
    }

    return 'nano';
  }

  private calculateSponsoredPostEarnings(): number {
    const { followers } = this.input;

    // Instagram基础报价：每万粉丝$100-150
    let baseRate = (followers / 10000) * 125;

    // 根据粉丝等级调整
    switch (this.followerTier) {
      case 'nano':
        baseRate *= 0.6;
        break;
      case 'micro':
        baseRate *= 0.9;
        break;
      case 'mid':
        baseRate *= 1.3;
        break;
      case 'macro':
        baseRate *= 2.0;
        break;
      case 'mega':
        baseRate *= 3.0;
        break;
    }

    return baseRate * this.nicheMultiplier * this.locationMultiplier * this.engagementMultiplier;
  }

  private calculateStoryEarnings(): number {
    return this.calculateSponsoredPostEarnings() * 0.3; // Stories通常是帖子价格的30%
  }

  private calculateReelsEarnings(): number {
    return this.calculateSponsoredPostEarnings() * 0.8; // Reels通常是帖子价格的80%
  }

  private calculateAffiliateEarnings(): number {
    const { followers } = this.input;
    return followers * 0.005 * this.nicheMultiplier * this.locationMultiplier;
  }

  public calculate(): CalculationResult {
    const sponsoredPost = this.calculateSponsoredPostEarnings();
    const story = this.calculateStoryEarnings();
    const reels = this.calculateReelsEarnings();
    const affiliate = this.calculateAffiliateEarnings();

    const monthlyEarnings = sponsoredPost * this.input.postFrequency * 4.33;
    const yearlyEarnings = monthlyEarnings * 12;
    const perPostEarnings = sponsoredPost;
    const perThousandViewsEarnings = (sponsoredPost / this.input.averageViews) * 1000;

    return {
      monthlyEarnings: Math.round(monthlyEarnings * 100) / 100,
      yearlyEarnings: Math.round(yearlyEarnings * 100) / 100,
      perPostEarnings: Math.round(perPostEarnings * 100) / 100,
      perThousandViewsEarnings: Math.round(perThousandViewsEarnings * 100) / 100,
      breakdown: {
        creatorFund: 0, // Instagram没有创作者基金
        liveGifts: 0,
        brandPartnerships: Math.round(sponsoredPost * 100) / 100,
        affiliateMarketing: Math.round(affiliate * 100) / 100,
        merchandise: Math.round((sponsoredPost * 0.2) * 100) / 100,
        other: Math.round((sponsoredPost * 0.1) * 100) / 100,
      },
      factors: {
        engagement: {
          score: this.input.engagementRate,
          impact: this.input.engagementRate >= 4.0 ? 'high' : this.input.engagementRate >= 2.0 ? 'medium' : 'low',
          description: this.getEngagementDescription(this.input.engagementRate),
        },
        niche: {
          multiplier: this.nicheMultiplier,
          impact: this.nicheMultiplier >= 1.3 ? 'high' : this.nicheMultiplier >= 1.1 ? 'medium' : 'low',
          description: this.getNicheDescription(),
        },
        location: {
          multiplier: this.locationMultiplier,
          impact: this.locationMultiplier >= 0.8 ? 'high' : this.locationMultiplier >= 0.5 ? 'medium' : 'low',
          description: this.getLocationDescription(),
        },
        consistency: {
          score: this.input.postFrequency,
          impact: this.input.postFrequency >= 7 ? 'high' : this.input.postFrequency >= 3 ? 'medium' : 'low',
          description: this.getConsistencyDescription(this.input.postFrequency),
        },
        quality: {
          score: 7.5, // Instagram质量评分
          impact: 'medium',
          description: 'Instagram content quality assessment',
        },
      },
      tips: this.generateTips(),
    };
  }

  private getEngagementDescription(rate: number): string {
    if (rate >= 6.0) return 'Excellent engagement rate for Instagram';
    if (rate >= 3.0) return 'Good engagement rate for Instagram';
    if (rate >= 1.5) return 'Average engagement rate for Instagram';
    return 'Low engagement rate - focus on creating more engaging content';
  }

  private getNicheDescription(): string {
    const config = NICHE_CONFIG[this.input.niche as keyof typeof NICHE_CONFIG];
    return config?.description || 'General content category';
  }

  private getLocationDescription(): string {
    const config = LOCATION_CONFIG[this.input.location as keyof typeof LOCATION_CONFIG];
    const maturity = config?.marketMaturity || 'medium';

    switch (maturity) {
      case 'high':
        return 'High-value market with strong Instagram monetization opportunities';
      case 'medium':
        return 'Developing market with moderate Instagram monetization potential';
      case 'low':
        return 'Emerging market with growing Instagram monetization opportunities';
      default:
        return 'Market with average Instagram monetization potential';
    }
  }

  private getConsistencyDescription(frequency: number): string {
    if (frequency >= 7) return 'Daily posting - excellent consistency for Instagram';
    if (frequency >= 4) return 'Frequent posting - good consistency for Instagram';
    if (frequency >= 2) return 'Regular posting - average consistency for Instagram';
    return 'Occasional posting - improve consistency for better Instagram results';
  }

  private generateTips(): string[] {
    const tips: string[] = [];
    const { engagementRate, postFrequency, followers } = this.input;

    if (engagementRate < 1.5) {
      tips.push('Improve engagement by using Instagram Stories and Reels');
      tips.push('Ask questions in your captions to encourage comments');
    }

    if (postFrequency < 3) {
      tips.push('Increase posting frequency to maintain audience engagement');
      tips.push('Use Instagram scheduling tools to maintain consistency');
    }

    if (this.followerTier === 'nano' || this.followerTier === 'micro') {
      tips.push('Focus on growing your follower base through hashtag strategy');
      tips.push('Collaborate with other creators in your niche');
    }

    tips.push('Diversify content with Posts, Stories, Reels, and IGTV');
    tips.push('Build an email list to maintain direct contact with your audience');

    return tips.slice(0, 5);
  }
}

/**
 * YouTube创作者收益计算器
 */
export class YouTubeCalculator {
  private input: LegacyCalculatorInput;
  private nicheMultiplier: number;
  private locationMultiplier: number;
  private engagementMultiplier: number;
  private followerTier: keyof typeof FOLLOWER_TIERS;

  constructor(input: CalculatorInput | LegacyCalculatorInput) {
    const legacyInput = 'platform' in input ? convertToLegacyInput(input) : input;
    this.input = this.validateInput(legacyInput);
    this.nicheMultiplier = this.calculateNicheMultiplier();
    this.locationMultiplier = this.calculateLocationMultiplier();
    this.engagementMultiplier = this.calculateEngagementMultiplier();
    this.followerTier = this.determineFollowerTier();
  }

  private validateInput(input: LegacyCalculatorInput): LegacyCalculatorInput {
    return {
      followers: clamp(input.followers, 100, 100000000), // 这里是subscribers
      engagementRate: clamp(input.engagementRate, 0.1, 20.0),
      niche: input.niche,
      location: input.location,
      postFrequency: clamp(input.postFrequency, 1, 50), // 这里是upload frequency
      averageViews: clamp(input.averageViews, 100, 1000000000),
    };
  }

  private calculateNicheMultiplier(): number {
    const config = NICHE_CONFIG[this.input.niche as keyof typeof NICHE_CONFIG];
    return config?.multiplier || 1.0;
  }

  private calculateLocationMultiplier(): number {
    const config = LOCATION_CONFIG[this.input.location as keyof typeof LOCATION_CONFIG];
    return config?.multiplier || 0.5;
  }

  private calculateEngagementMultiplier(): number {
    const { engagementRate } = this.input;

    if (engagementRate >= ENGAGEMENT_FACTORS.excellent.min) {
      return ENGAGEMENT_FACTORS.excellent.multiplier;
    } else if (engagementRate >= ENGAGEMENT_FACTORS.good.min) {
      return ENGAGEMENT_FACTORS.good.multiplier;
    } else if (engagementRate >= ENGAGEMENT_FACTORS.average.min) {
      return ENGAGEMENT_FACTORS.average.multiplier;
    } else {
      return ENGAGEMENT_FACTORS.poor.multiplier;
    }
  }

  private determineFollowerTier(): keyof typeof FOLLOWER_TIERS {
    const { followers } = this.input; // subscribers

    for (const [tier, config] of Object.entries(FOLLOWER_TIERS)) {
      if (followers >= config.min && followers < config.max) {
        return tier as keyof typeof FOLLOWER_TIERS;
      }
    }

    return 'nano';
  }

  private calculateAdRevenue(): number {
    const { averageViews, postFrequency } = this.input;
    const monthlyViews = averageViews * postFrequency * 4.33;

    // YouTube RPM (Revenue Per Mille) 通常在$1-5之间
    const baseRPM = 2.5;
    const adjustedRPM = baseRPM * this.locationMultiplier * this.nicheMultiplier;

    return (monthlyViews / 1000) * adjustedRPM;
  }

  private calculateSponsoredVideoEarnings(): number {
    const { followers, averageViews } = this.input;

    // YouTube赞助视频通常按每千次观看$1-10收费
    let baseRate = (averageViews / 1000) * 5;

    // 根据订阅者等级调整
    switch (this.followerTier) {
      case 'nano':
        baseRate *= 0.5;
        break;
      case 'micro':
        baseRate *= 0.8;
        break;
      case 'mid':
        baseRate *= 1.2;
        break;
      case 'macro':
        baseRate *= 1.8;
        break;
      case 'mega':
        baseRate *= 2.5;
        break;
    }

    return baseRate * this.nicheMultiplier * this.locationMultiplier * this.engagementMultiplier;
  }

  private calculateMembershipRevenue(): number {
    const { followers } = this.input;

    // 假设1%的订阅者成为会员，每月$5
    const membershipRate = 0.01;
    const monthlyFee = 5;

    return followers * membershipRate * monthlyFee * this.locationMultiplier;
  }

  private calculateSuperChatRevenue(): number {
    const { followers } = this.input;

    // 基于订阅者数量的直播打赏收入
    return followers * 0.002 * this.engagementMultiplier * this.locationMultiplier;
  }

  private calculateAffiliateRevenue(): number {
    const { averageViews, postFrequency } = this.input;
    const monthlyViews = averageViews * postFrequency * 4.33;

    return (monthlyViews / 1000) * 0.1 * this.nicheMultiplier;
  }

  public calculate(): CalculationResult {
    const adRevenue = this.calculateAdRevenue();
    const sponsoredVideo = this.calculateSponsoredVideoEarnings();
    const membership = this.calculateMembershipRevenue();
    const superChat = this.calculateSuperChatRevenue();
    const affiliate = this.calculateAffiliateRevenue();

    const monthlyEarnings = adRevenue + (sponsoredVideo * this.input.postFrequency) + membership + superChat + affiliate;
    const yearlyEarnings = monthlyEarnings * 12;
    const perPostEarnings = sponsoredVideo;
    const perThousandViewsEarnings = (adRevenue / (this.input.averageViews * this.input.postFrequency * 4.33)) * 1000;

    return {
      monthlyEarnings: Math.round(monthlyEarnings * 100) / 100,
      yearlyEarnings: Math.round(yearlyEarnings * 100) / 100,
      perPostEarnings: Math.round(perPostEarnings * 100) / 100,
      perThousandViewsEarnings: Math.round(perThousandViewsEarnings * 100) / 100,
      breakdown: {
        creatorFund: Math.round(adRevenue * 100) / 100, // YouTube广告分成
        liveGifts: Math.round(superChat * 100) / 100,
        brandPartnerships: Math.round(sponsoredVideo * 100) / 100,
        affiliateMarketing: Math.round(affiliate * 100) / 100,
        merchandise: Math.round(membership * 100) / 100, // 会员收入
        other: Math.round((monthlyEarnings * 0.1) * 100) / 100,
      },
      factors: {
        engagement: {
          score: this.input.engagementRate,
          impact: this.input.engagementRate >= 4.0 ? 'high' : this.input.engagementRate >= 2.0 ? 'medium' : 'low',
          description: this.getEngagementDescription(this.input.engagementRate),
        },
        niche: {
          multiplier: this.nicheMultiplier,
          impact: this.nicheMultiplier >= 1.3 ? 'high' : this.nicheMultiplier >= 1.1 ? 'medium' : 'low',
          description: this.getNicheDescription(),
        },
        location: {
          multiplier: this.locationMultiplier,
          impact: this.locationMultiplier >= 0.8 ? 'high' : this.locationMultiplier >= 0.5 ? 'medium' : 'low',
          description: this.getLocationDescription(),
        },
        consistency: {
          score: this.input.postFrequency,
          impact: this.input.postFrequency >= 7 ? 'high' : this.input.postFrequency >= 3 ? 'medium' : 'low',
          description: this.getConsistencyDescription(this.input.postFrequency),
        },
        quality: {
          score: 8.0, // YouTube质量评分
          impact: 'high',
          description: 'YouTube content quality assessment based on watch time and engagement',
        },
      },
      tips: this.generateTips(),
    };
  }

  private getEngagementDescription(rate: number): string {
    if (rate >= 4.0) return 'Excellent engagement rate for YouTube';
    if (rate >= 2.0) return 'Good engagement rate for YouTube';
    if (rate >= 1.0) return 'Average engagement rate for YouTube';
    return 'Low engagement rate - focus on creating more engaging content';
  }

  private getNicheDescription(): string {
    const config = NICHE_CONFIG[this.input.niche as keyof typeof NICHE_CONFIG];
    return config?.description || 'General content category';
  }

  private getLocationDescription(): string {
    const config = LOCATION_CONFIG[this.input.location as keyof typeof LOCATION_CONFIG];
    const maturity = config?.marketMaturity || 'medium';

    switch (maturity) {
      case 'high':
        return 'High-value market with strong YouTube monetization opportunities';
      case 'medium':
        return 'Developing market with moderate YouTube monetization potential';
      case 'low':
        return 'Emerging market with growing YouTube monetization opportunities';
      default:
        return 'Market with average YouTube monetization potential';
    }
  }

  private getConsistencyDescription(frequency: number): string {
    if (frequency >= 7) return 'Daily uploads - excellent consistency for YouTube';
    if (frequency >= 4) return 'Frequent uploads - good consistency for YouTube';
    if (frequency >= 2) return 'Regular uploads - average consistency for YouTube';
    return 'Occasional uploads - improve consistency for better YouTube results';
  }

  private generateTips(): string[] {
    const tips: string[] = [];
    const { engagementRate, postFrequency, followers } = this.input;

    if (engagementRate < 2.0) {
      tips.push('Improve engagement by asking viewers to like, comment, and subscribe');
      tips.push('Create compelling thumbnails and titles to increase click-through rates');
    }

    if (postFrequency < 3) {
      tips.push('Increase upload frequency to maintain audience engagement');
      tips.push('Create a consistent upload schedule');
    }

    if (this.followerTier === 'nano' || this.followerTier === 'micro') {
      tips.push('Focus on SEO optimization for better discoverability');
      tips.push('Collaborate with other YouTubers in your niche');
    }

    tips.push('Enable all monetization features: ads, memberships, Super Chat');
    tips.push('Build an email list and promote affiliate products');

    return tips.slice(0, 5);
  }
}

/**
 * 获取行业基准数据
 */
export function getIndustryBenchmarks(niche: string, followerCount: number) {
  const nicheConfig = NICHE_CONFIG[niche as keyof typeof NICHE_CONFIG];
  const tier = Object.entries(FOLLOWER_TIERS).find(
    ([, config]) => followerCount >= config.min && followerCount < config.max
  )?.[0] || 'nano';

  return {
    averageEngagement: nicheConfig?.averageEngagement || 3.5,
    topCreatorEarnings: nicheConfig?.topCreatorEarnings || 50000,
    tier: FOLLOWER_TIERS[tier as keyof typeof FOLLOWER_TIERS].label,
    nicheMultiplier: nicheConfig?.multiplier || 1.0,
  };
}