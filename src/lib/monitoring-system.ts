/**
 * 监控和告警系统
 * 实时监控算法性能、准确性和系统健康状况
 */

import type { CalculatorInput, CalculationResult } from '@/types';

// 监控指标接口
interface MonitoringMetric {
  name: string;
  value: number;
  timestamp: Date;
  threshold: {
    warning: number;
    critical: number;
  };
  unit: string;
  tags: Record<string, string>;
}

// 告警配置
interface AlertConfig {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  enabled: boolean;
  cooldownMinutes: number; // 冷却时间
  channels: AlertChannel[];
}

// 告警渠道
interface AlertChannel {
  type: 'email' | 'slack' | 'webhook' | 'sms';
  config: Record<string, any>;
  enabled: boolean;
}

// 告警事件
interface AlertEvent {
  id: string;
  alertId: string;
  metric: MonitoringMetric;
  triggeredAt: Date;
  resolvedAt?: Date;
  status: 'active' | 'resolved' | 'suppressed';
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// 系统健康状态
interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  components: {
    [component: string]: {
      status: 'healthy' | 'degraded' | 'critical';
      lastCheck: Date;
      metrics: MonitoringMetric[];
    };
  };
  lastUpdated: Date;
}

/**
 * 监控系统类
 */
export class MonitoringSystem {
  private metrics: Map<string, MonitoringMetric[]> = new Map();
  private alerts: Map<string, AlertConfig> = new Map();
  private activeAlerts: Map<string, AlertEvent> = new Map();
  private healthStatus: SystemHealth;

  constructor() {
    this.healthStatus = {
      overall: 'healthy',
      components: {},
      lastUpdated: new Date(),
    };

    this.initializeDefaultAlerts();
    this.startHealthChecks();
  }

  /**
   * 记录指标
   */
  recordMetric(metric: MonitoringMetric): void {
    const key = metric.name;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metricHistory = this.metrics.get(key)!;
    metricHistory.push(metric);
    
    // 保留最近1000个数据点
    if (metricHistory.length > 1000) {
      metricHistory.shift();
    }
    
    // 检查告警条件
    this.checkAlerts(metric);
    
    // 更新组件健康状态
    this.updateComponentHealth(metric);
  }

  /**
   * 记录算法性能指标
   */
  recordAlgorithmPerformance(
    input: CalculatorInput,
    result: CalculationResult,
    executionTime: number,
    algorithmVersion: string
  ): void {
    const timestamp = new Date();
    const tags = {
      platform: input.platform,
      niche: input.profile.contentNiche,
      location: input.profile.audienceLocation,
      algorithm_version: algorithmVersion,
    };

    // 执行时间
    this.recordMetric({
      name: 'algorithm_execution_time',
      value: executionTime,
      timestamp,
      threshold: { warning: 1000, critical: 3000 }, // 毫秒
      unit: 'ms',
      tags,
    });

    // 预测值合理性检查
    const reasonabilityScore = this.calculateReasonabilityScore(input, result);
    this.recordMetric({
      name: 'prediction_reasonability',
      value: reasonabilityScore,
      timestamp,
      threshold: { warning: 0.7, critical: 0.5 },
      unit: 'score',
      tags,
    });

    // 收益分布检查
    const distributionScore = this.calculateDistributionScore(result.breakdown);
    this.recordMetric({
      name: 'earnings_distribution',
      value: distributionScore,
      timestamp,
      threshold: { warning: 0.8, critical: 0.6 },
      unit: 'score',
      tags,
    });
  }

  /**
   * 记录用户反馈
   */
  recordUserFeedback(
    userId: string,
    input: CalculatorInput,
    result: CalculationResult,
    feedback: {
      accuracy: number; // 1-5
      usefulness: number; // 1-5
      satisfaction: number; // 1-5
    }
  ): void {
    const timestamp = new Date();
    const tags = {
      platform: input.platform,
      niche: input.profile.contentNiche,
    };

    // 用户满意度
    this.recordMetric({
      name: 'user_satisfaction',
      value: feedback.satisfaction,
      timestamp,
      threshold: { warning: 3.5, critical: 3.0 },
      unit: 'rating',
      tags,
    });

    // 预测准确性（用户感知）
    this.recordMetric({
      name: 'perceived_accuracy',
      value: feedback.accuracy,
      timestamp,
      threshold: { warning: 3.5, critical: 3.0 },
      unit: 'rating',
      tags,
    });

    // 有用性评分
    this.recordMetric({
      name: 'usefulness_score',
      value: feedback.usefulness,
      timestamp,
      threshold: { warning: 3.5, critical: 3.0 },
      unit: 'rating',
      tags,
    });
  }

  /**
   * 记录系统错误
   */
  recordError(
    error: Error,
    context: {
      component: string;
      operation: string;
      userId?: string;
      input?: CalculatorInput;
    }
  ): void {
    const timestamp = new Date();
    
    // 错误率指标
    this.recordMetric({
      name: 'error_rate',
      value: 1,
      timestamp,
      threshold: { warning: 0.05, critical: 0.1 }, // 5% warning, 10% critical
      unit: 'count',
      tags: {
        component: context.component,
        operation: context.operation,
        error_type: error.constructor.name,
      },
    });

    // 记录详细错误信息
    console.error('System error recorded:', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp,
    });
  }

  /**
   * 获取系统健康状态
   */
  getSystemHealth(): SystemHealth {
    return { ...this.healthStatus };
  }

  /**
   * 获取指标历史
   */
  getMetricHistory(
    metricName: string,
    timeRange: { start: Date; end: Date },
    tags?: Record<string, string>
  ): MonitoringMetric[] {
    const metrics = this.metrics.get(metricName) || [];
    
    return metrics.filter(metric => {
      // 时间范围过滤
      if (metric.timestamp < timeRange.start || metric.timestamp > timeRange.end) {
        return false;
      }
      
      // 标签过滤
      if (tags) {
        for (const [key, value] of Object.entries(tags)) {
          if (metric.tags[key] !== value) {
            return false;
          }
        }
      }
      
      return true;
    });
  }

  /**
   * 获取活跃告警
   */
  getActiveAlerts(): AlertEvent[] {
    return Array.from(this.activeAlerts.values())
      .filter(alert => alert.status === 'active')
      .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
  }

  /**
   * 创建自定义告警
   */
  createAlert(config: Omit<AlertConfig, 'id'>): string {
    const alertId = this.generateAlertId();
    const alert: AlertConfig = {
      ...config,
      id: alertId,
    };
    
    this.alerts.set(alertId, alert);
    return alertId;
  }

  /**
   * 私有方法
   */
  private initializeDefaultAlerts(): void {
    // 算法执行时间告警
    this.createAlert({
      name: 'High Algorithm Execution Time',
      description: 'Algorithm taking too long to execute',
      metric: 'algorithm_execution_time',
      condition: 'greater_than',
      threshold: 2000, // 2秒
      severity: 'warning',
      enabled: true,
      cooldownMinutes: 5,
      channels: [
        {
          type: 'email',
          config: { recipients: ['dev-team@company.com'] },
          enabled: true,
        },
      ],
    });

    // 用户满意度告警
    this.createAlert({
      name: 'Low User Satisfaction',
      description: 'User satisfaction score below threshold',
      metric: 'user_satisfaction',
      condition: 'less_than',
      threshold: 3.0,
      severity: 'error',
      enabled: true,
      cooldownMinutes: 15,
      channels: [
        {
          type: 'slack',
          config: { channel: '#product-alerts' },
          enabled: true,
        },
      ],
    });

    // 错误率告警
    this.createAlert({
      name: 'High Error Rate',
      description: 'System error rate exceeds threshold',
      metric: 'error_rate',
      condition: 'greater_than',
      threshold: 0.05, // 5%
      severity: 'critical',
      enabled: true,
      cooldownMinutes: 1,
      channels: [
        {
          type: 'email',
          config: { recipients: ['oncall@company.com'] },
          enabled: true,
        },
        {
          type: 'sms',
          config: { numbers: ['+1234567890'] },
          enabled: true,
        },
      ],
    });
  }

  private checkAlerts(metric: MonitoringMetric): void {
    for (const alert of this.alerts.values()) {
      if (!alert.enabled || alert.metric !== metric.name) {
        continue;
      }

      const shouldTrigger = this.evaluateAlertCondition(metric, alert);
      const existingAlert = this.findActiveAlert(alert.id, metric);

      if (shouldTrigger && !existingAlert) {
        this.triggerAlert(alert, metric);
      } else if (!shouldTrigger && existingAlert) {
        this.resolveAlert(existingAlert.id);
      }
    }
  }

  private evaluateAlertCondition(metric: MonitoringMetric, alert: AlertConfig): boolean {
    switch (alert.condition) {
      case 'greater_than':
        return metric.value > alert.threshold;
      case 'less_than':
        return metric.value < alert.threshold;
      case 'equals':
        return metric.value === alert.threshold;
      case 'not_equals':
        return metric.value !== alert.threshold;
      default:
        return false;
    }
  }

  private findActiveAlert(alertId: string, metric: MonitoringMetric): AlertEvent | null {
    for (const alert of this.activeAlerts.values()) {
      if (alert.alertId === alertId && alert.status === 'active') {
        return alert;
      }
    }
    return null;
  }

  private triggerAlert(alertConfig: AlertConfig, metric: MonitoringMetric): void {
    const alertEvent: AlertEvent = {
      id: this.generateAlertEventId(),
      alertId: alertConfig.id,
      metric,
      triggeredAt: new Date(),
      status: 'active',
      message: this.generateAlertMessage(alertConfig, metric),
      severity: alertConfig.severity,
    };

    this.activeAlerts.set(alertEvent.id, alertEvent);

    // 发送告警通知
    this.sendAlertNotifications(alertConfig, alertEvent);

    console.warn('Alert triggered:', alertEvent);
  }

  private resolveAlert(alertEventId: string): void {
    const alert = this.activeAlerts.get(alertEventId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
      console.info('Alert resolved:', alert);
    }
  }

  private generateAlertMessage(config: AlertConfig, metric: MonitoringMetric): string {
    return `${config.name}: ${metric.name} is ${metric.value}${metric.unit} (threshold: ${config.threshold})`;
  }

  private sendAlertNotifications(config: AlertConfig, event: AlertEvent): void {
    for (const channel of config.channels) {
      if (!channel.enabled) continue;

      try {
        switch (channel.type) {
          case 'email':
            this.sendEmailAlert(channel.config, event);
            break;
          case 'slack':
            this.sendSlackAlert(channel.config, event);
            break;
          case 'webhook':
            this.sendWebhookAlert(channel.config, event);
            break;
          case 'sms':
            this.sendSMSAlert(channel.config, event);
            break;
        }
      } catch (error) {
        console.error(`Failed to send alert via ${channel.type}:`, error);
      }
    }
  }

  private updateComponentHealth(metric: MonitoringMetric): void {
    const component = metric.tags.component || 'algorithm';
    
    if (!this.healthStatus.components[component]) {
      this.healthStatus.components[component] = {
        status: 'healthy',
        lastCheck: new Date(),
        metrics: [],
      };
    }

    const componentHealth = this.healthStatus.components[component];
    componentHealth.lastCheck = new Date();
    componentHealth.metrics.push(metric);

    // 保留最近10个指标
    if (componentHealth.metrics.length > 10) {
      componentHealth.metrics.shift();
    }

    // 评估组件健康状态
    componentHealth.status = this.evaluateComponentHealth(componentHealth.metrics);

    // 更新整体健康状态
    this.updateOverallHealth();
  }

  private evaluateComponentHealth(metrics: MonitoringMetric[]): 'healthy' | 'degraded' | 'critical' {
    let criticalCount = 0;
    let warningCount = 0;

    for (const metric of metrics) {
      if (metric.value >= metric.threshold.critical) {
        criticalCount++;
      } else if (metric.value >= metric.threshold.warning) {
        warningCount++;
      }
    }

    if (criticalCount > 0) return 'critical';
    if (warningCount > metrics.length * 0.5) return 'degraded';
    return 'healthy';
  }

  private updateOverallHealth(): void {
    const components = Object.values(this.healthStatus.components);
    const criticalComponents = components.filter(c => c.status === 'critical').length;
    const degradedComponents = components.filter(c => c.status === 'degraded').length;

    if (criticalComponents > 0) {
      this.healthStatus.overall = 'critical';
    } else if (degradedComponents > components.length * 0.3) {
      this.healthStatus.overall = 'degraded';
    } else {
      this.healthStatus.overall = 'healthy';
    }

    this.healthStatus.lastUpdated = new Date();
  }

  private startHealthChecks(): void {
    // 每分钟执行健康检查
    setInterval(() => {
      this.performHealthCheck();
    }, 60000);
  }

  private performHealthCheck(): void {
    // 检查各个组件的健康状态
    this.checkDatabaseHealth();
    this.checkCacheHealth();
    this.checkExternalAPIHealth();
  }

  private checkDatabaseHealth(): void {
    // 模拟数据库健康检查
    const responseTime = Math.random() * 100; // 模拟响应时间
    
    this.recordMetric({
      name: 'database_response_time',
      value: responseTime,
      timestamp: new Date(),
      threshold: { warning: 50, critical: 100 },
      unit: 'ms',
      tags: { component: 'database' },
    });
  }

  private checkCacheHealth(): void {
    // 模拟缓存健康检查
    const hitRate = 0.8 + Math.random() * 0.2; // 模拟缓存命中率
    
    this.recordMetric({
      name: 'cache_hit_rate',
      value: hitRate,
      timestamp: new Date(),
      threshold: { warning: 0.7, critical: 0.5 },
      unit: 'ratio',
      tags: { component: 'cache' },
    });
  }

  private checkExternalAPIHealth(): void {
    // 模拟外部API健康检查
    const availability = Math.random() > 0.1 ? 1 : 0; // 90%可用性
    
    this.recordMetric({
      name: 'external_api_availability',
      value: availability,
      timestamp: new Date(),
      threshold: { warning: 0.95, critical: 0.9 },
      unit: 'ratio',
      tags: { component: 'external_api' },
    });
  }

  // 辅助方法
  private calculateReasonabilityScore(input: CalculatorInput, result: CalculationResult): number {
    // 检查预测结果的合理性
    const followers = input.metrics.followers || input.metrics.subscribers || 0;
    const expectedRange = followers * 0.001; // 简化的期望范围
    
    const deviation = Math.abs(result.monthlyEarnings - expectedRange) / expectedRange;
    return Math.max(0, 1 - deviation);
  }

  private calculateDistributionScore(breakdown: any): number {
    // 检查收益分布的合理性
    const total = Object.values(breakdown).reduce((sum: number, val: any) => sum + val, 0);
    if (total === 0) return 0;

    // 检查是否有单一收入源占比过高
    const maxRatio = Math.max(...Object.values(breakdown).map((val: any) => val / total));
    return maxRatio < 0.8 ? 1 : 0.5; // 如果单一收入源超过80%，评分降低
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAlertEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 通知方法（简化实现）
  private async sendEmailAlert(config: any, event: AlertEvent): Promise<void> {
    console.log('Sending email alert:', { config, event });
  }

  private async sendSlackAlert(config: any, event: AlertEvent): Promise<void> {
    console.log('Sending Slack alert:', { config, event });
  }

  private async sendWebhookAlert(config: any, event: AlertEvent): Promise<void> {
    console.log('Sending webhook alert:', { config, event });
  }

  private async sendSMSAlert(config: any, event: AlertEvent): Promise<void> {
    console.log('Sending SMS alert:', { config, event });
  }
}

// 导出单例实例
export const monitoringSystem = new MonitoringSystem();
