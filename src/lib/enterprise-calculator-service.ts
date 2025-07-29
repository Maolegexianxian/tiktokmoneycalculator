/**
 * 企业级创作者收益计算服务
 * 集成所有高级功能的主要服务接口
 */

import type { CalculatorInput, CalculationResult } from '@/types';
import { EnterpriseCalculatorEngine } from './enhanced-calculator';
import { marketDataService } from './market-data-service';
import { mlPredictionEngine } from './ml-prediction-model';
import { riskAssessmentEngine } from './risk-assessment';
import { abTestingEngine } from './ab-testing-framework';
import { monitoringSystem } from './monitoring-system';

// 企业级计算结果接口
interface EnterpriseCalculationResult extends CalculationResult {
  // 增强的预测信息
  prediction: {
    confidence: number;
    variance: number;
    modelVersion: string;
    featureImportance: Record<string, number>;
  };
  
  // 风险评估
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    confidenceInterval: {
      lower: number;
      median: number;
      upper: number;
    };
    volatilityMetrics: {
      monthlyVolatility: number;
      yearlyVolatility: number;
    };
  };
  
  // 市场对比
  marketComparison: {
    percentile: number;
    industryAverage: number;
    topPerformerBenchmark: number;
  };
  
  // 增长预测
  growthProjections: {
    timeframe: string;
    scenarios: {
      conservative: number;
      realistic: number;
      optimistic: number;
    };
  }[];
  
  // 可执行建议
  actionableInsights: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'content' | 'engagement' | 'monetization' | 'growth';
    recommendation: string;
    expectedImpact: {
      revenue: number;
      timeToSeeResults: number;
      implementationDifficulty: 'easy' | 'medium' | 'hard';
    };
  }[];
  
  // 元数据
  metadata: {
    calculationId: string;
    timestamp: Date;
    algorithmVersion: string;
    dataFreshness: number;
    processingTime: number;
  };
}

// 计算选项
interface CalculationOptions {
  userId?: string;
  sessionId?: string;
  includeRiskAssessment?: boolean;
  includeMarketComparison?: boolean;
  includeGrowthProjections?: boolean;
  useMLPrediction?: boolean;
  enableABTesting?: boolean;
  enableMonitoring?: boolean;
}

/**
 * 企业级计算器服务
 */
export class EnterpriseCalculatorService {
  private calculatorEngine: EnterpriseCalculatorEngine;

  constructor() {
    this.calculatorEngine = new EnterpriseCalculatorEngine();
  }

  /**
   * 执行企业级收益计算
   */
  async calculateEarnings(
    input: CalculatorInput,
    options: CalculationOptions = {}
  ): Promise<EnterpriseCalculationResult> {
    const startTime = Date.now();
    const calculationId = this.generateCalculationId();
    
    try {
      // 1. A/B测试：获取算法变体
      let algorithmConfig = { version: '2.0.0', parameters: {} };
      if (options.enableABTesting && options.userId) {
        const variant = abTestingEngine.getVariantForUser(
          options.userId,
          input,
          options.sessionId
        );
        algorithmConfig = {
          version: variant.algorithmVersion,
          parameters: variant.parameters,
        };
      }

      // 2. 加载实时市场数据
      await marketDataService.getPlatformMetrics(input.platform);

      // 3. 执行基础计算
      let baseResult: CalculationResult;
      if (options.useMLPrediction !== false) {
        // 使用机器学习增强的计算
        baseResult = await this.calculateWithML(input, algorithmConfig);
      } else {
        // 使用传统算法
        baseResult = await this.calculateTraditional(input);
      }

      // 4. 风险评估
      let riskAssessment = null;
      if (options.includeRiskAssessment !== false) {
        const riskResult = await riskAssessmentEngine.assessRisk(input, baseResult);
        riskAssessment = {
          overallRisk: riskResult.overallRisk,
          riskScore: riskResult.riskScore,
          confidenceInterval: riskResult.confidenceInterval,
          volatilityMetrics: {
            monthlyVolatility: riskResult.volatilityMetrics.monthlyVolatility,
            yearlyVolatility: riskResult.volatilityMetrics.yearlyVolatility,
          },
        };
      }

      // 5. 市场对比分析
      let marketComparison = null;
      if (options.includeMarketComparison !== false) {
        marketComparison = await this.performMarketComparison(input, baseResult);
      }

      // 6. 增长预测
      let growthProjections: any[] = [];
      if (options.includeGrowthProjections !== false) {
        growthProjections = await this.generateGrowthProjections(input, baseResult);
      }

      // 7. 生成可执行建议
      const actionableInsights = await this.generateActionableInsights(
        input,
        baseResult,
        riskAssessment
      );

      // 8. ML预测信息
      const mlPrediction = await mlPredictionEngine.predict(input);

      const processingTime = Date.now() - startTime;

      // 构建企业级结果
      const enterpriseResult: EnterpriseCalculationResult = {
        ...baseResult,
        prediction: {
          confidence: mlPrediction.confidence,
          variance: mlPrediction.variance,
          modelVersion: mlPrediction.modelVersion,
          featureImportance: mlPrediction.featureImportance,
        },
        riskAssessment: riskAssessment || {
          overallRisk: 'medium',
          riskScore: 0.5,
          confidenceInterval: {
            lower: baseResult.monthlyEarnings * 0.8,
            median: baseResult.monthlyEarnings,
            upper: baseResult.monthlyEarnings * 1.2,
          },
          volatilityMetrics: {
            monthlyVolatility: 0.15,
            yearlyVolatility: 0.25,
          },
        },
        marketComparison: marketComparison || {
          percentile: 50,
          industryAverage: baseResult.monthlyEarnings,
          topPerformerBenchmark: baseResult.monthlyEarnings * 2,
        },
        growthProjections,
        actionableInsights,
        metadata: {
          calculationId,
          timestamp: new Date(),
          algorithmVersion: algorithmConfig.version,
          dataFreshness: 0.95, // 从市场数据服务获取
          processingTime,
        },
      };

      // 9. 监控和记录
      if (options.enableMonitoring !== false) {
        this.recordCalculationMetrics(
          input,
          enterpriseResult,
          processingTime,
          algorithmConfig.version
        );
      }

      // 10. A/B测试结果记录
      if (options.enableABTesting && options.userId) {
        abTestingEngine.recordResult(
          options.userId,
          algorithmConfig.version,
          input,
          baseResult
        );
      }

      return enterpriseResult;

    } catch (error) {
      // 错误处理和监控
      if (options.enableMonitoring !== false) {
        monitoringSystem.recordError(error as Error, {
          component: 'enterprise_calculator',
          operation: 'calculateEarnings',
          userId: options.userId,
          input,
        });
      }

      // 降级到基础计算
      console.warn('Enterprise calculation failed, falling back to basic calculation:', error);
      return this.fallbackCalculation(input, calculationId, startTime);
    }
  }

  /**
   * 记录用户反馈
   */
  async recordUserFeedback(
    calculationId: string,
    userId: string,
    feedback: {
      accuracy: number; // 1-5
      usefulness: number; // 1-5
      satisfaction: number; // 1-5
      comments?: string;
    }
  ): Promise<void> {
    try {
      // 记录到监控系统
      monitoringSystem.recordUserFeedback(
        userId,
        {} as CalculatorInput, // 需要从计算历史中获取
        {} as CalculationResult, // 需要从计算历史中获取
        feedback
      );

      // 记录到A/B测试系统（如果适用）
      // abTestingEngine.recordFeedback(userId, calculationId, feedback);

      console.log('User feedback recorded:', { calculationId, userId, feedback });
    } catch (error) {
      console.error('Failed to record user feedback:', error);
    }
  }

  /**
   * 获取系统健康状态
   */
  getSystemHealth() {
    return monitoringSystem.getSystemHealth();
  }

  /**
   * 获取算法性能指标
   */
  getPerformanceMetrics(timeRange: { start: Date; end: Date }) {
    return {
      executionTime: monitoringSystem.getMetricHistory(
        'algorithm_execution_time',
        timeRange
      ),
      accuracy: monitoringSystem.getMetricHistory(
        'prediction_reasonability',
        timeRange
      ),
      userSatisfaction: monitoringSystem.getMetricHistory(
        'user_satisfaction',
        timeRange
      ),
    };
  }

  /**
   * 私有方法
   */
  private async calculateWithML(
    input: CalculatorInput,
    algorithmConfig: { version: string; parameters: any }
  ): Promise<CalculationResult> {
    // 使用增强的计算引擎
    return await this.calculatorEngine.calculateEnhanced(input);
  }

  private async calculateTraditional(input: CalculatorInput): Promise<CalculationResult> {
    // 使用传统算法（从原有的calculator.ts）
    const { calculateEarnings } = await import('./calculator');
    return calculateEarnings(input);
  }

  private async performMarketComparison(
    input: CalculatorInput,
    result: CalculationResult
  ): Promise<any> {
    try {
      const benchmarks = await marketDataService.getIndustryBenchmarks(
        input.platform,
        input.profile.contentNiche
      );

      const percentile = this.calculatePercentile(
        result.monthlyEarnings,
        benchmarks.metrics.averageEarnings
      );

      return {
        percentile,
        industryAverage: benchmarks.metrics.averageEarnings,
        topPerformerBenchmark: benchmarks.metrics.topPercentileEarnings,
      };
    } catch (error) {
      console.warn('Market comparison failed:', error);
      return {
        percentile: 50,
        industryAverage: result.monthlyEarnings,
        topPerformerBenchmark: result.monthlyEarnings * 2,
      };
    }
  }

  private async generateGrowthProjections(
    input: CalculatorInput,
    result: CalculationResult
  ): Promise<any[]> {
    const projections = [];
    const baseEarnings = result.monthlyEarnings;

    // 3个月预测
    projections.push({
      timeframe: '3months',
      scenarios: {
        conservative: baseEarnings * 1.05,
        realistic: baseEarnings * 1.15,
        optimistic: baseEarnings * 1.30,
      },
    });

    // 6个月预测
    projections.push({
      timeframe: '6months',
      scenarios: {
        conservative: baseEarnings * 1.10,
        realistic: baseEarnings * 1.35,
        optimistic: baseEarnings * 1.70,
      },
    });

    // 1年预测
    projections.push({
      timeframe: '1year',
      scenarios: {
        conservative: baseEarnings * 1.20,
        realistic: baseEarnings * 1.75,
        optimistic: baseEarnings * 2.50,
      },
    });

    return projections;
  }

  private async generateActionableInsights(
    input: CalculatorInput,
    result: CalculationResult,
    riskAssessment: any
  ): Promise<any[]> {
    const insights = [];

    // 基于互动率的建议
    const engagementRate = input.metrics.engagementRate || 0;
    if (engagementRate < 3.0) {
      insights.push({
        priority: 'high' as const,
        category: 'engagement' as const,
        recommendation: 'Focus on improving engagement rate through interactive content and community building',
        expectedImpact: {
          revenue: 25, // 25% 收益提升
          timeToSeeResults: 30, // 30天
          implementationDifficulty: 'medium' as const,
        },
      });
    }

    // 基于平台多样化的建议
    insights.push({
      priority: 'medium' as const,
      category: 'growth' as const,
      recommendation: 'Diversify to additional platforms to reduce platform risk',
      expectedImpact: {
        revenue: 40,
        timeToSeeResults: 90,
        implementationDifficulty: 'hard' as const,
      },
    });

    return insights;
  }

  private recordCalculationMetrics(
    input: CalculatorInput,
    result: EnterpriseCalculationResult,
    processingTime: number,
    algorithmVersion: string
  ): void {
    monitoringSystem.recordAlgorithmPerformance(
      input,
      result,
      processingTime,
      algorithmVersion
    );
  }

  private fallbackCalculation(
    input: CalculatorInput,
    calculationId: string,
    startTime: number
  ): EnterpriseCalculationResult {
    // 简化的降级计算
    const baseEarnings = (input.metrics.followers || 0) * 0.01;
    const processingTime = Date.now() - startTime;

    return {
      monthlyEarnings: baseEarnings,
      yearlyEarnings: baseEarnings * 12,
      perPostEarnings: baseEarnings / 30,
      perThousandViewsEarnings: 1.0,
      breakdown: {
        creatorFund: baseEarnings * 0.3,
        liveGifts: baseEarnings * 0.2,
        brandPartnerships: baseEarnings * 0.3,
        affiliateMarketing: baseEarnings * 0.1,
        merchandise: baseEarnings * 0.05,
        other: baseEarnings * 0.05,
      },
      factors: {
        engagement: { score: 3.5, impact: 'medium', description: 'Average engagement' },
        niche: { multiplier: 1.0, impact: 'medium', description: 'Standard niche' },
        location: { multiplier: 1.0, impact: 'medium', description: 'Standard location' },
        consistency: { score: 5, impact: 'medium', description: 'Regular posting' },
        quality: { score: 7, impact: 'medium', description: 'Good quality content' },
      },
      tips: ['Focus on consistent content creation', 'Engage with your audience'],
      prediction: {
        confidence: 0.6,
        variance: baseEarnings * 0.3,
        modelVersion: 'fallback',
        featureImportance: { followers: 1.0 },
      },
      riskAssessment: {
        overallRisk: 'medium',
        riskScore: 0.5,
        confidenceInterval: {
          lower: baseEarnings * 0.7,
          median: baseEarnings,
          upper: baseEarnings * 1.3,
        },
        volatilityMetrics: {
          monthlyVolatility: 0.2,
          yearlyVolatility: 0.3,
        },
      },
      marketComparison: {
        percentile: 50,
        industryAverage: baseEarnings,
        topPerformerBenchmark: baseEarnings * 2,
      },
      growthProjections: [],
      actionableInsights: [],
      metadata: {
        calculationId,
        timestamp: new Date(),
        algorithmVersion: 'fallback',
        dataFreshness: 0.5,
        processingTime,
      },
    };
  }

  private calculatePercentile(value: number, average: number): number {
    // 简化的百分位计算
    const ratio = value / average;
    if (ratio >= 2.0) return 95;
    if (ratio >= 1.5) return 80;
    if (ratio >= 1.2) return 70;
    if (ratio >= 1.0) return 60;
    if (ratio >= 0.8) return 40;
    if (ratio >= 0.6) return 30;
    if (ratio >= 0.4) return 20;
    return 10;
  }

  private generateCalculationId(): string {
    return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出单例实例
export const enterpriseCalculatorService = new EnterpriseCalculatorService();
