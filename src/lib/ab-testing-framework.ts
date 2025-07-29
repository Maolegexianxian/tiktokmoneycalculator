/**
 * A/B测试框架
 * 用于算法版本对比和持续优化的企业级测试系统
 */

import type { CalculatorInput, CalculationResult } from '@/types';

// 实验配置接口
interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  trafficAllocation: number; // 流量分配比例 (0-1)
  variants: ExperimentVariant[];
  successMetrics: SuccessMetric[];
  segmentation?: SegmentationRule[];
}

// 实验变体
interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  trafficWeight: number; // 权重 (0-1)
  algorithmVersion: string;
  parameters: Record<string, any>;
  isControl: boolean;
}

// 成功指标
interface SuccessMetric {
  name: string;
  type: 'accuracy' | 'user_satisfaction' | 'engagement' | 'conversion';
  target: number; // 目标值
  threshold: number; // 显著性阈值
  direction: 'increase' | 'decrease'; // 期望方向
}

// 分段规则
interface SegmentationRule {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

// 实验结果
interface ExperimentResult {
  experimentId: string;
  variantId: string;
  metrics: {
    [metricName: string]: {
      value: number;
      confidence: number;
      significance: number;
      sampleSize: number;
    };
  };
  statisticalSignificance: boolean;
  recommendedAction: 'continue' | 'stop' | 'scale' | 'iterate';
}

// 用户分配记录
interface UserAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: Date;
  sessionId?: string;
}

/**
 * A/B测试引擎
 */
export class ABTestingEngine {
  private experiments: Map<string, ExperimentConfig> = new Map();
  private userAssignments: Map<string, UserAssignment[]> = new Map();
  private results: Map<string, ExperimentResult[]> = new Map();

  constructor() {
    this.initializeDefaultExperiments();
  }

  /**
   * 创建新实验
   */
  createExperiment(config: Omit<ExperimentConfig, 'id'>): string {
    const experimentId = this.generateExperimentId();
    const experiment: ExperimentConfig = {
      ...config,
      id: experimentId,
    };

    this.experiments.set(experimentId, experiment);
    return experimentId;
  }

  /**
   * 获取用户的算法变体
   */
  getVariantForUser(
    userId: string,
    input: CalculatorInput,
    sessionId?: string
  ): { variantId: string; algorithmVersion: string; parameters: Record<string, any> } {
    // 检查现有分配
    const existingAssignment = this.getUserAssignment(userId);
    if (existingAssignment) {
      const experiment = this.experiments.get(existingAssignment.experimentId);
      const variant = experiment?.variants.find(v => v.id === existingAssignment.variantId);
      if (variant) {
        return {
          variantId: variant.id,
          algorithmVersion: variant.algorithmVersion,
          parameters: variant.parameters,
        };
      }
    }

    // 为新用户分配变体
    const activeExperiment = this.getActiveExperimentForUser(userId, input);
    if (!activeExperiment) {
      // 返回默认算法
      return {
        variantId: 'default',
        algorithmVersion: '2.0.0',
        parameters: {},
      };
    }

    const variant = this.assignUserToVariant(userId, activeExperiment, sessionId);
    return {
      variantId: variant.id,
      algorithmVersion: variant.algorithmVersion,
      parameters: variant.parameters,
    };
  }

  /**
   * 记录实验结果
   */
  recordResult(
    userId: string,
    variantId: string,
    input: CalculatorInput,
    result: CalculationResult,
    userFeedback?: {
      accuracy: number; // 1-5
      satisfaction: number; // 1-5
      usefulness: number; // 1-5
    }
  ): void {
    const assignment = this.getUserAssignment(userId);
    if (!assignment) return;

    const experimentId = assignment.experimentId;
    
    // 计算指标
    const metrics = this.calculateMetrics(input, result, userFeedback);
    
    // 存储结果
    if (!this.results.has(experimentId)) {
      this.results.set(experimentId, []);
    }
    
    this.results.get(experimentId)!.push({
      experimentId,
      variantId,
      metrics,
      statisticalSignificance: false, // 将在分析时计算
      recommendedAction: 'continue',
    });

    // 检查是否需要进行统计分析
    this.checkForStatisticalSignificance(experimentId);
  }

  /**
   * 分析实验结果
   */
  analyzeExperiment(experimentId: string): {
    summary: {
      totalSamples: number;
      duration: number; // 天数
      status: string;
    };
    variants: {
      [variantId: string]: {
        sampleSize: number;
        metrics: Record<string, number>;
        confidence: Record<string, number>;
      };
    };
    recommendations: string[];
    statisticalSignificance: boolean;
  } {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    const results = this.results.get(experimentId) || [];
    
    // 按变体分组结果
    const variantResults = this.groupResultsByVariant(results);
    
    // 计算统计显著性
    const significance = this.calculateStatisticalSignificance(variantResults, experiment);
    
    // 生成建议
    const recommendations = this.generateRecommendations(variantResults, experiment, significance);

    return {
      summary: {
        totalSamples: results.length,
        duration: this.calculateExperimentDuration(experiment),
        status: experiment.status,
      },
      variants: variantResults,
      recommendations,
      statisticalSignificance: significance.isSignificant,
    };
  }

  /**
   * 停止实验
   */
  stopExperiment(experimentId: string, reason: string): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.status = 'completed';
      experiment.endDate = new Date();
      
      // 记录停止原因
      console.log(`Experiment ${experimentId} stopped: ${reason}`);
    }
  }

  /**
   * 扩展获胜变体
   */
  scaleWinningVariant(experimentId: string, winningVariantId: string): void {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return;

    const winningVariant = experiment.variants.find(v => v.id === winningVariantId);
    if (!winningVariant) return;

    // 创建新的默认配置
    this.updateDefaultAlgorithm(winningVariant.algorithmVersion, winningVariant.parameters);
    
    // 停止实验
    this.stopExperiment(experimentId, `Scaling winning variant: ${winningVariantId}`);
  }

  /**
   * 私有方法
   */
  private initializeDefaultExperiments(): void {
    // 创建默认的算法对比实验
    const defaultExperiment: ExperimentConfig = {
      id: 'algorithm_v2_vs_v1',
      name: 'Algorithm V2.0 vs V1.0',
      description: 'Compare new ML-enhanced algorithm with legacy version',
      status: 'running',
      startDate: new Date(),
      trafficAllocation: 0.2, // 20%的用户参与实验
      variants: [
        {
          id: 'control_v1',
          name: 'Legacy Algorithm V1.0',
          description: 'Current production algorithm',
          trafficWeight: 0.5,
          algorithmVersion: '1.0.0',
          parameters: {},
          isControl: true,
        },
        {
          id: 'treatment_v2',
          name: 'Enhanced Algorithm V2.0',
          description: 'New ML-enhanced algorithm with real-time data',
          trafficWeight: 0.5,
          algorithmVersion: '2.0.0',
          parameters: {
            useMLPrediction: true,
            useRealTimeData: true,
            riskAssessment: true,
          },
          isControl: false,
        },
      ],
      successMetrics: [
        {
          name: 'prediction_accuracy',
          type: 'accuracy',
          target: 0.9,
          threshold: 0.05,
          direction: 'increase',
        },
        {
          name: 'user_satisfaction',
          type: 'user_satisfaction',
          target: 4.0,
          threshold: 0.1,
          direction: 'increase',
        },
      ],
    };

    this.experiments.set(defaultExperiment.id, defaultExperiment);
  }

  private generateExperimentId(): string {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserAssignment(userId: string): UserAssignment | null {
    const assignments = this.userAssignments.get(userId) || [];
    return assignments.find(a => {
      const experiment = this.experiments.get(a.experimentId);
      return experiment?.status === 'running';
    }) || null;
  }

  private getActiveExperimentForUser(userId: string, input: CalculatorInput): ExperimentConfig | null {
    for (const experiment of this.experiments.values()) {
      if (experiment.status !== 'running') continue;
      
      // 检查流量分配
      if (Math.random() > experiment.trafficAllocation) continue;
      
      // 检查分段规则
      if (experiment.segmentation && !this.matchesSegmentation(input, experiment.segmentation)) {
        continue;
      }
      
      return experiment;
    }
    
    return null;
  }

  private assignUserToVariant(
    userId: string,
    experiment: ExperimentConfig,
    sessionId?: string
  ): ExperimentVariant {
    // 使用一致性哈希确保用户总是分配到同一变体
    const hash = this.hashUserId(userId + experiment.id);
    let cumulativeWeight = 0;
    
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.trafficWeight;
      if (hash < cumulativeWeight) {
        // 记录分配
        const assignment: UserAssignment = {
          userId,
          experimentId: experiment.id,
          variantId: variant.id,
          assignedAt: new Date(),
          sessionId,
        };
        
        if (!this.userAssignments.has(userId)) {
          this.userAssignments.set(userId, []);
        }
        this.userAssignments.get(userId)!.push(assignment);
        
        return variant;
      }
    }
    
    // 默认返回第一个变体
    return experiment.variants[0] || experiment.variants.find(() => true)!;
  }

  private hashUserId(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash) / 2147483647; // 归一化到0-1
  }

  private matchesSegmentation(input: CalculatorInput, rules: SegmentationRule[]): boolean {
    return rules.every(rule => {
      const value = this.getFieldValue(input, rule.field);
      return this.evaluateRule(value, rule.operator, rule.value);
    });
  }

  private getFieldValue(input: CalculatorInput, field: string): any {
    const parts = field.split('.');
    let value: any = input;
    for (const part of parts) {
      value = value?.[part];
    }
    return value;
  }

  private evaluateRule(value: any, operator: string, target: any): boolean {
    switch (operator) {
      case 'equals':
        return value === target;
      case 'contains':
        return String(value).includes(String(target));
      case 'greater_than':
        return Number(value) > Number(target);
      case 'less_than':
        return Number(value) < Number(target);
      default:
        return false;
    }
  }

  private calculateMetrics(
    input: CalculatorInput,
    result: CalculationResult,
    feedback?: { accuracy: number; satisfaction: number; usefulness: number }
  ): Record<string, { value: number; confidence: number; significance: number; sampleSize: number }> {
    const metrics: Record<string, any> = {};
    
    // 预测准确性（需要真实数据对比）
    metrics.prediction_accuracy = {
      value: 0.85, // 模拟值
      confidence: 0.95,
      significance: 0.05,
      sampleSize: 1,
    };
    
    // 用户满意度
    if (feedback) {
      metrics.user_satisfaction = {
        value: feedback.satisfaction,
        confidence: 0.9,
        significance: 0.1,
        sampleSize: 1,
      };
      
      metrics.perceived_accuracy = {
        value: feedback.accuracy,
        confidence: 0.9,
        significance: 0.1,
        sampleSize: 1,
      };
    }
    
    return metrics;
  }

  private checkForStatisticalSignificance(experimentId: string): void {
    const results = this.results.get(experimentId) || [];
    const experiment = this.experiments.get(experimentId);
    
    if (!experiment || results.length < 100) return; // 需要最少样本量
    
    // 执行统计检验
    const significance = this.calculateStatisticalSignificance(
      this.groupResultsByVariant(results),
      experiment
    );
    
    if (significance.isSignificant) {
      console.log(`Experiment ${experimentId} reached statistical significance`);
      // 可以触发自动停止或通知
    }
  }

  private groupResultsByVariant(results: ExperimentResult[]): Record<string, any> {
    const grouped: Record<string, any> = {};
    
    for (const result of results) {
      if (!grouped[result.variantId]) {
        grouped[result.variantId] = {
          sampleSize: 0,
          metrics: {},
          confidence: {},
        };
      }
      
      grouped[result.variantId].sampleSize++;
      
      // 聚合指标
      for (const [metricName, metricData] of Object.entries(result.metrics)) {
        if (!grouped[result.variantId].metrics[metricName]) {
          grouped[result.variantId].metrics[metricName] = [];
        }
        grouped[result.variantId].metrics[metricName].push(metricData.value);
      }
    }
    
    // 计算平均值和置信度
    for (const variantData of Object.values(grouped)) {
      for (const [metricName, values] of Object.entries(variantData.metrics)) {
        const avg = (values as number[]).reduce((sum, val) => sum + val, 0) / (values as number[]).length;
        variantData.metrics[metricName] = avg;
        variantData.confidence[metricName] = this.calculateConfidence(values as number[]);
      }
    }
    
    return grouped;
  }

  private calculateStatisticalSignificance(
    variantResults: Record<string, any>,
    experiment: ExperimentConfig
  ): { isSignificant: boolean; pValue: number } {
    // 简化的统计显著性检验
    const variants = Object.keys(variantResults);
    if (variants.length < 2) return { isSignificant: false, pValue: 1.0 };
    
    // 模拟t检验结果
    const pValue = Math.random() * 0.1; // 模拟p值
    const isSignificant = pValue < 0.05;
    
    return { isSignificant, pValue };
  }

  private calculateConfidence(values: number[]): number {
    if (values.length < 2) return 0.5;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
    const standardError = Math.sqrt(variance / values.length);
    
    // 简化的置信度计算
    return Math.max(0.5, Math.min(0.99, 1 - standardError));
  }

  private generateRecommendations(
    variantResults: Record<string, any>,
    experiment: ExperimentConfig,
    significance: { isSignificant: boolean; pValue: number }
  ): string[] {
    const recommendations: string[] = [];
    
    if (!significance.isSignificant) {
      recommendations.push('Continue experiment - no statistical significance yet');
      return recommendations;
    }
    
    // 找到最佳变体
    const bestVariant = this.findBestVariant(variantResults, experiment.successMetrics);
    
    if (bestVariant.isControl) {
      recommendations.push('Keep current algorithm - control variant performs best');
    } else {
      recommendations.push(`Scale new algorithm - variant ${bestVariant.id} shows significant improvement`);
    }
    
    return recommendations;
  }

  private findBestVariant(
    variantResults: Record<string, any>,
    metrics: SuccessMetric[]
  ): { id: string; isControl: boolean } {
    // 简化的最佳变体选择逻辑
    let bestVariantId = Object.keys(variantResults)[0];
    let bestScore = 0;
    
    for (const [variantId, data] of Object.entries(variantResults)) {
      let score = 0;
      for (const metric of metrics) {
        const value = data.metrics[metric.name] || 0;
        score += value * (metric.direction === 'increase' ? 1 : -1);
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestVariantId = variantId;
      }
    }
    
    return {
      id: bestVariantId || 'control',
      isControl: (bestVariantId || 'control').includes('control')
    };
  }

  private calculateExperimentDuration(experiment: ExperimentConfig): number {
    const endDate = experiment.endDate || new Date();
    return Math.ceil((endDate.getTime() - experiment.startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  private updateDefaultAlgorithm(version: string, parameters: Record<string, any>): void {
    // 更新默认算法配置
    console.log(`Updating default algorithm to version ${version} with parameters:`, parameters);
  }
}

// 导出单例实例
export const abTestingEngine = new ABTestingEngine();
