/**
 * 风险评估系统
 * 分析创作者收益的风险因素和波动性，提供置信区间和风险建议
 */

import type { CalculatorInput, CalculationResult } from '@/types';

// 风险因子接口
interface RiskFactor {
  name: string;
  weight: number; // 权重 (0-1)
  score: number; // 风险评分 (0-1, 1为最高风险)
  description: string;
  mitigation: string; // 风险缓解建议
}

// 风险评估结果
interface RiskAssessmentResult {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 综合风险评分 (0-1)
  confidenceInterval: {
    lower: number; // 下限 (5th percentile)
    median: number; // 中位数
    upper: number; // 上限 (95th percentile)
    standardDeviation: number;
  };
  volatilityMetrics: {
    monthlyVolatility: number; // 月度波动率
    yearlyVolatility: number; // 年度波动率
    maxDrawdown: number; // 最大回撤
    sharpeRatio: number; // 夏普比率
  };
  riskFactors: RiskFactor[];
  recommendations: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'diversification' | 'platform' | 'content' | 'market';
    action: string;
    expectedImpact: number; // 预期风险降低 (%)
  }[];
  stressTestResults: {
    scenario: string;
    probability: number;
    impact: number; // 收益影响 (%)
  }[];
}

// 市场情景
interface MarketScenario {
  name: string;
  probability: number;
  factors: {
    platformGrowth: number;
    competitionIncrease: number;
    brandBudgetChange: number;
    regulatoryImpact: number;
  };
}

/**
 * 风险评估引擎
 */
export class RiskAssessmentEngine {
  private marketScenarios: MarketScenario[];
  private historicalVolatility: Record<string, number>;

  constructor() {
    // 定义市场情景
    this.marketScenarios = [
      {
        name: 'Economic Recession',
        probability: 0.15,
        factors: {
          platformGrowth: -0.3,
          competitionIncrease: 0.2,
          brandBudgetChange: -0.4,
          regulatoryImpact: 0.1,
        },
      },
      {
        name: 'Platform Algorithm Change',
        probability: 0.25,
        factors: {
          platformGrowth: 0.0,
          competitionIncrease: 0.1,
          brandBudgetChange: 0.0,
          regulatoryImpact: 0.0,
        },
      },
      {
        name: 'Increased Competition',
        probability: 0.35,
        factors: {
          platformGrowth: 0.1,
          competitionIncrease: 0.4,
          brandBudgetChange: 0.0,
          regulatoryImpact: 0.0,
        },
      },
      {
        name: 'Regulatory Changes',
        probability: 0.20,
        factors: {
          platformGrowth: -0.1,
          competitionIncrease: 0.0,
          brandBudgetChange: -0.2,
          regulatoryImpact: 0.3,
        },
      },
      {
        name: 'Market Boom',
        probability: 0.10,
        factors: {
          platformGrowth: 0.5,
          competitionIncrease: 0.3,
          brandBudgetChange: 0.6,
          regulatoryImpact: 0.0,
        },
      },
    ];

    // 历史波动率数据（基于平台和细分领域）
    this.historicalVolatility = {
      'tiktok_lifestyle': 0.35,
      'tiktok_tech': 0.28,
      'tiktok_beauty': 0.32,
      'instagram_lifestyle': 0.25,
      'instagram_tech': 0.22,
      'instagram_beauty': 0.28,
      'youtube_lifestyle': 0.20,
      'youtube_tech': 0.18,
      'youtube_beauty': 0.23,
    };
  }

  /**
   * 执行风险评估
   */
  async assessRisk(
    input: CalculatorInput,
    baseResult: CalculationResult
  ): Promise<RiskAssessmentResult> {
    // 1. 识别和评估风险因子
    const riskFactors = await this.identifyRiskFactors(input);
    
    // 2. 计算综合风险评分
    const riskScore = this.calculateOverallRisk(riskFactors);
    
    // 3. 计算置信区间
    const confidenceInterval = this.calculateConfidenceInterval(baseResult, riskScore, input);
    
    // 4. 计算波动性指标
    const volatilityMetrics = this.calculateVolatilityMetrics(input, baseResult);
    
    // 5. 压力测试
    const stressTestResults = this.performStressTest(baseResult, input);
    
    // 6. 生成风险缓解建议
    const recommendations = this.generateRiskRecommendations(riskFactors, input);

    return {
      overallRisk: this.categorizeRisk(riskScore),
      riskScore,
      confidenceInterval,
      volatilityMetrics,
      riskFactors,
      recommendations,
      stressTestResults,
    };
  }

  /**
   * 识别风险因子
   */
  private async identifyRiskFactors(input: CalculatorInput): Promise<RiskFactor[]> {
    const factors: RiskFactor[] = [];

    // 平台风险
    factors.push(await this.assessPlatformRisk(input.platform));
    
    // 市场集中度风险
    factors.push(this.assessConcentrationRisk(input));
    
    // 竞争风险
    factors.push(await this.assessCompetitionRisk(input));
    
    // 内容质量风险
    factors.push(this.assessContentQualityRisk(input));
    
    // 地理风险
    factors.push(this.assessGeographicRisk(input.profile.audienceLocation));
    
    // 监管风险
    factors.push(await this.assessRegulatoryRisk(input));
    
    // 技术风险
    factors.push(this.assessTechnicalRisk(input));

    return factors;
  }

  /**
   * 评估平台风险
   */
  private async assessPlatformRisk(platform: string): Promise<RiskFactor> {
    const platformRisks: Record<string, number> = {
      tiktok: 0.6, // 较新平台，政策变化风险高
      instagram: 0.4, // 成熟平台，但算法变化频繁
      youtube: 0.3, // 最稳定的平台
    };

    const riskScore = platformRisks[platform] || 0.5;

    return {
      name: 'Platform Risk',
      weight: 0.25,
      score: riskScore,
      description: `Risk associated with ${platform} platform stability and policy changes`,
      mitigation: 'Diversify across multiple platforms to reduce dependency',
    };
  }

  /**
   * 评估市场集中度风险
   */
  private assessConcentrationRisk(input: CalculatorInput): RiskFactor {
    // 假设用户只在一个平台活跃
    const concentrationScore = 0.7; // 高集中度风险

    return {
      name: 'Concentration Risk',
      weight: 0.20,
      score: concentrationScore,
      description: 'Risk from over-dependence on a single platform or revenue stream',
      mitigation: 'Diversify revenue streams and expand to multiple platforms',
    };
  }

  /**
   * 评估竞争风险
   */
  private async assessCompetitionRisk(input: CalculatorInput): Promise<RiskFactor> {
    const niche = input.profile.contentNiche;
    
    // 基于细分领域的竞争强度
    const competitionLevels: Record<string, number> = {
      lifestyle: 0.8, // 高竞争
      beauty: 0.7,
      fitness: 0.6,
      tech: 0.4, // 相对低竞争
      business: 0.3,
    };

    const competitionScore = competitionLevels[niche] || 0.6;

    return {
      name: 'Competition Risk',
      weight: 0.15,
      score: competitionScore,
      description: `Competition level in ${niche} niche affects earning potential`,
      mitigation: 'Focus on unique value proposition and niche specialization',
    };
  }

  /**
   * 评估内容质量风险
   */
  private assessContentQualityRisk(input: CalculatorInput): RiskFactor {
    const engagementRate = input.metrics.engagementRate || 0;
    const avgViews = input.metrics.avgViews || 0;
    const followers = input.metrics.followers || input.metrics.subscribers || 1;
    
    const viewToFollowerRatio = avgViews / followers;
    
    // 基于互动率和观看率评估内容质量风险
    let qualityScore = 0.5;
    
    if (engagementRate < 2.0) qualityScore += 0.3;
    if (viewToFollowerRatio < 0.1) qualityScore += 0.2;
    
    qualityScore = Math.min(1.0, qualityScore);

    return {
      name: 'Content Quality Risk',
      weight: 0.15,
      score: qualityScore,
      description: 'Risk from declining content performance and engagement',
      mitigation: 'Invest in content quality improvement and audience research',
    };
  }

  /**
   * 评估地理风险
   */
  private assessGeographicRisk(location: string): RiskFactor {
    const geoRisks: Record<string, number> = {
      us: 0.2, // 低风险
      uk: 0.25,
      ca: 0.25,
      au: 0.3,
      de: 0.3,
      cn: 0.7, // 高监管风险
      in: 0.6,
      br: 0.5,
    };

    const riskScore = geoRisks[location] || 0.4;

    return {
      name: 'Geographic Risk',
      weight: 0.10,
      score: riskScore,
      description: `Economic and regulatory risks in ${location}`,
      mitigation: 'Consider expanding to multiple geographic markets',
    };
  }

  /**
   * 评估监管风险
   */
  private async assessRegulatoryRisk(input: CalculatorInput): Promise<RiskFactor> {
    // 基于平台和地理位置的监管风险
    let regulatoryScore = 0.3;
    
    if (input.platform === 'tiktok') regulatoryScore += 0.2; // TikTok面临更多监管压力
    if (input.profile.audienceLocation === 'cn') regulatoryScore += 0.3;

    return {
      name: 'Regulatory Risk',
      weight: 0.10,
      score: Math.min(1.0, regulatoryScore),
      description: 'Risk from changing regulations affecting creator monetization',
      mitigation: 'Stay informed about regulatory changes and maintain compliance',
    };
  }

  /**
   * 评估技术风险
   */
  private assessTechnicalRisk(input: CalculatorInput): RiskFactor {
    // 基于平台技术稳定性和算法变化频率
    const techRisks: Record<string, number> = {
      tiktok: 0.5, // 算法变化频繁
      instagram: 0.4,
      youtube: 0.3, // 相对稳定
    };

    const riskScore = techRisks[input.platform] || 0.4;

    return {
      name: 'Technical Risk',
      weight: 0.05,
      score: riskScore,
      description: 'Risk from algorithm changes and technical issues',
      mitigation: 'Adapt quickly to platform changes and maintain technical skills',
    };
  }

  /**
   * 计算综合风险评分
   */
  private calculateOverallRisk(riskFactors: RiskFactor[]): number {
    let weightedRisk = 0;
    let totalWeight = 0;

    for (const factor of riskFactors) {
      weightedRisk += factor.score * factor.weight;
      totalWeight += factor.weight;
    }

    return totalWeight > 0 ? weightedRisk / totalWeight : 0.5;
  }

  /**
   * 计算置信区间
   */
  private calculateConfidenceInterval(
    baseResult: CalculationResult,
    riskScore: number,
    input: CalculatorInput
  ): RiskAssessmentResult['confidenceInterval'] {
    const baseEarnings = baseResult.monthlyEarnings;
    
    // 基于风险评分计算标准差
    const standardDeviation = baseEarnings * (0.1 + riskScore * 0.4);
    
    // 计算置信区间（假设正态分布）
    const lower = Math.max(0, baseEarnings - 1.96 * standardDeviation); // 2.5th percentile
    const upper = baseEarnings + 1.96 * standardDeviation; // 97.5th percentile
    
    return {
      lower: Math.round(lower * 100) / 100,
      median: baseEarnings,
      upper: Math.round(upper * 100) / 100,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
    };
  }

  /**
   * 计算波动性指标
   */
  private calculateVolatilityMetrics(
    input: CalculatorInput,
    baseResult: CalculationResult
  ): RiskAssessmentResult['volatilityMetrics'] {
    const platform = input.platform;
    const niche = input.profile.contentNiche;
    const key = `${platform}_${niche}`;
    
    const historicalVol = this.historicalVolatility[key] || 0.3;
    const monthlyVolatility = historicalVol / Math.sqrt(12);
    
    // 计算其他风险指标
    const maxDrawdown = historicalVol * 0.6; // 估算最大回撤
    const sharpeRatio = 0.8 - historicalVol; // 简化的夏普比率

    return {
      monthlyVolatility: Math.round(monthlyVolatility * 1000) / 1000,
      yearlyVolatility: Math.round(historicalVol * 1000) / 1000,
      maxDrawdown: Math.round(maxDrawdown * 1000) / 1000,
      sharpeRatio: Math.round(sharpeRatio * 1000) / 1000,
    };
  }

  /**
   * 执行压力测试
   */
  private performStressTest(
    baseResult: CalculationResult,
    input: CalculatorInput
  ): RiskAssessmentResult['stressTestResults'] {
    const results = [];
    
    for (const scenario of this.marketScenarios) {
      const impact = this.calculateScenarioImpact(baseResult, scenario, input);
      
      results.push({
        scenario: scenario.name,
        probability: scenario.probability,
        impact: Math.round(impact * 1000) / 1000,
      });
    }
    
    return results;
  }

  /**
   * 计算情景影响
   */
  private calculateScenarioImpact(
    baseResult: CalculationResult,
    scenario: MarketScenario,
    input: CalculatorInput
  ): number {
    let totalImpact = 0;
    
    // 平台增长影响
    totalImpact += scenario.factors.platformGrowth * 0.3;
    
    // 竞争影响
    totalImpact -= scenario.factors.competitionIncrease * 0.4;
    
    // 品牌预算影响
    totalImpact += scenario.factors.brandBudgetChange * 0.5;
    
    // 监管影响
    totalImpact -= scenario.factors.regulatoryImpact * 0.2;
    
    return totalImpact;
  }

  /**
   * 生成风险缓解建议
   */
  private generateRiskRecommendations(
    riskFactors: RiskFactor[],
    input: CalculatorInput
  ): RiskAssessmentResult['recommendations'] {
    const recommendations = [];
    
    // 基于最高风险因子生成建议
    const sortedFactors = riskFactors.sort((a, b) => 
      (b.score * b.weight) - (a.score * a.weight)
    );
    
    for (const factor of sortedFactors.slice(0, 3)) {
      recommendations.push({
        priority: this.getPriority(factor.score * factor.weight),
        category: this.getCategory(factor.name),
        action: factor.mitigation,
        expectedImpact: Math.round((1 - factor.score) * factor.weight * 100),
      });
    }
    
    return recommendations;
  }

  /**
   * 风险分类
   */
  private categorizeRisk(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore < 0.3) return 'low';
    if (riskScore < 0.5) return 'medium';
    if (riskScore < 0.7) return 'high';
    return 'critical';
  }

  private getPriority(score: number): 'critical' | 'high' | 'medium' | 'low' {
    if (score > 0.7) return 'critical';
    if (score > 0.5) return 'high';
    if (score > 0.3) return 'medium';
    return 'low';
  }

  private getCategory(factorName: string): 'diversification' | 'platform' | 'content' | 'market' {
    if (factorName.includes('Platform') || factorName.includes('Technical')) return 'platform';
    if (factorName.includes('Content')) return 'content';
    if (factorName.includes('Concentration')) return 'diversification';
    return 'market';
  }
}

// 导出单例实例
export const riskAssessmentEngine = new RiskAssessmentEngine();
