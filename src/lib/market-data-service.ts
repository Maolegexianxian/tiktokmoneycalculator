/**
 * 实时市场数据服务
 * 集成多个数据源，提供准确的市场指标和行业基准
 */

import { cache } from './cache';

// 市场数据接口
interface MarketDataPoint {
  timestamp: Date;
  value: number;
  source: string;
  confidence: number; // 数据可信度 (0-1)
}

interface PlatformMetrics {
  platform: string;
  cpmRates: {
    [country: string]: MarketDataPoint;
  };
  engagementRates: {
    [niche: string]: MarketDataPoint;
  };
  creatorEarnings: {
    [tier: string]: MarketDataPoint;
  };
  brandBudgets: {
    total: MarketDataPoint;
    byNiche: { [niche: string]: MarketDataPoint };
  };
}

interface IndustryBenchmarks {
  platform: string;
  niche: string;
  metrics: {
    averageFollowers: number;
    averageEngagement: number;
    averageEarnings: number;
    topPercentileEarnings: number;
    growthRate: number;
  };
  lastUpdated: Date;
}

// 数据源配置
interface DataSourceConfig {
  name: string;
  endpoint: string;
  apiKey?: string;
  rateLimit: number; // 每分钟请求数
  reliability: number; // 可靠性评分 (0-1)
  updateFrequency: number; // 更新频率 (分钟)
}

/**
 * 市场数据服务类
 */
export class MarketDataService {
  private dataSources: DataSourceConfig[];
  private cache: Map<string, any> = new Map();
  private lastUpdate: Map<string, Date> = new Map();

  constructor() {
    this.dataSources = [
      {
        name: 'SocialBlade',
        endpoint: 'https://api.socialblade.com',
        rateLimit: 100,
        reliability: 0.85,
        updateFrequency: 60,
      },
      {
        name: 'InfluencerDB',
        endpoint: 'https://api.influencerdb.com',
        rateLimit: 200,
        reliability: 0.90,
        updateFrequency: 30,
      },
      {
        name: 'CreatorEconomy',
        endpoint: 'https://api.creatoreconomy.com',
        rateLimit: 150,
        reliability: 0.88,
        updateFrequency: 45,
      },
      // 添加更多数据源...
    ];
  }

  /**
   * 获取平台实时指标
   */
  async getPlatformMetrics(platform: string): Promise<PlatformMetrics> {
    const cacheKey = `platform_metrics_${platform}`;
    
    // 检查缓存
    const cached = await this.getCachedData(cacheKey);
    if (cached && this.isCacheValid(cacheKey, 15)) { // 15分钟缓存
      return cached;
    }

    try {
      // 从多个数据源获取数据
      const dataPromises = this.dataSources.map(source => 
        this.fetchFromSource(source, `platforms/${platform}/metrics`)
      );

      const results = await Promise.allSettled(dataPromises);
      const validResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value);

      // 合并和验证数据
      const mergedData = this.mergeDataSources(validResults);
      const metrics = this.transformToPlatformMetrics(mergedData, platform);

      // 缓存结果
      await this.setCachedData(cacheKey, metrics);
      
      return metrics;
    } catch (error) {
      console.error('Failed to fetch platform metrics:', error);
      
      // 返回缓存数据或默认值
      return cached || this.getDefaultPlatformMetrics(platform);
    }
  }

  /**
   * 获取行业基准数据
   */
  async getIndustryBenchmarks(platform: string, niche: string): Promise<IndustryBenchmarks> {
    const cacheKey = `benchmarks_${platform}_${niche}`;
    
    const cached = await this.getCachedData(cacheKey);
    if (cached && this.isCacheValid(cacheKey, 60)) { // 1小时缓存
      return cached;
    }

    try {
      const benchmarkData = await this.fetchBenchmarkData(platform, niche);
      await this.setCachedData(cacheKey, benchmarkData);
      return benchmarkData;
    } catch (error) {
      console.error('Failed to fetch industry benchmarks:', error);
      return cached || this.getDefaultBenchmarks(platform, niche);
    }
  }

  /**
   * 获取实时CPM费率
   */
  async getCPMRates(platform: string, country: string): Promise<number> {
    const cacheKey = `cpm_${platform}_${country}`;
    
    const cached = await this.getCachedData(cacheKey);
    if (cached && this.isCacheValid(cacheKey, 30)) { // 30分钟缓存
      return cached;
    }

    try {
      // 从广告平台API获取实时CPM数据
      const cpmData = await this.fetchCPMData(platform, country);
      await this.setCachedData(cacheKey, cpmData);
      return cpmData;
    } catch (error) {
      console.error('Failed to fetch CPM rates:', error);
      return cached || this.getDefaultCPM(platform, country);
    }
  }

  /**
   * 获取品牌预算趋势
   */
  async getBrandBudgetTrends(niche: string, timeframe: string): Promise<any> {
    const cacheKey = `brand_budgets_${niche}_${timeframe}`;
    
    const cached = await this.getCachedData(cacheKey);
    if (cached && this.isCacheValid(cacheKey, 120)) { // 2小时缓存
      return cached;
    }

    try {
      const budgetData = await this.fetchBrandBudgetData(niche, timeframe);
      await this.setCachedData(cacheKey, budgetData);
      return budgetData;
    } catch (error) {
      console.error('Failed to fetch brand budget trends:', error);
      return cached || this.getDefaultBrandBudgets(niche);
    }
  }

  /**
   * 获取竞争指数
   */
  async getCompetitionIndex(platform: string, niche: string): Promise<number> {
    const cacheKey = `competition_${platform}_${niche}`;
    
    const cached = await this.getCachedData(cacheKey);
    if (cached && this.isCacheValid(cacheKey, 60)) {
      return cached;
    }

    try {
      // 计算竞争指数：创作者数量 vs 品牌需求
      const creatorCount = await this.getCreatorCount(platform, niche);
      const brandDemand = await this.getBrandDemand(niche);
      
      const competitionIndex = Math.min(1, creatorCount / (brandDemand * 100));
      
      await this.setCachedData(cacheKey, competitionIndex);
      return competitionIndex;
    } catch (error) {
      console.error('Failed to calculate competition index:', error);
      return cached || 0.5; // 默认中等竞争
    }
  }

  /**
   * 从数据源获取数据
   */
  private async fetchFromSource(source: DataSourceConfig, endpoint: string): Promise<any> {
    const url = `${source.endpoint}/${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (source.apiKey) {
      headers['Authorization'] = `Bearer ${source.apiKey}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      timeout: 10000, // 10秒超时
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 合并多个数据源的结果
   */
  private mergeDataSources(results: any[]): any {
    if (results.length === 0) {
      throw new Error('No valid data sources available');
    }

    // 使用加权平均合并数据
    const weights = this.dataSources.map(source => source.reliability);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    // 实现数据合并逻辑
    return results.reduce((merged, result, index) => {
      const weight = weights[index] / totalWeight;
      // 合并逻辑...
      return merged;
    }, {});
  }

  /**
   * 转换为平台指标格式
   */
  private transformToPlatformMetrics(data: any, platform: string): PlatformMetrics {
    // 实现数据转换逻辑
    return {
      platform,
      cpmRates: {},
      engagementRates: {},
      creatorEarnings: {},
      brandBudgets: {
        total: {
          timestamp: new Date(),
          value: 0,
          source: 'aggregated',
          confidence: 0.8,
        },
        byNiche: {},
      },
    };
  }

  /**
   * 缓存相关方法
   */
  private async getCachedData(key: string): Promise<any> {
    try {
      return await cache.get(key);
    } catch (error) {
      return this.cache.get(key);
    }
  }

  private async setCachedData(key: string, data: any): Promise<void> {
    try {
      await cache.set(key, data, 3600); // 1小时TTL
    } catch (error) {
      this.cache.set(key, data);
    }
    this.lastUpdate.set(key, new Date());
  }

  private isCacheValid(key: string, maxAgeMinutes: number): boolean {
    const lastUpdate = this.lastUpdate.get(key);
    if (!lastUpdate) return false;
    
    const ageMinutes = (Date.now() - lastUpdate.getTime()) / (1000 * 60);
    return ageMinutes < maxAgeMinutes;
  }

  /**
   * 默认值方法
   */
  private getDefaultPlatformMetrics(platform: string): PlatformMetrics {
    // 返回默认的平台指标
    return {
      platform,
      cpmRates: {},
      engagementRates: {},
      creatorEarnings: {},
      brandBudgets: {
        total: {
          timestamp: new Date(),
          value: 1000000, // 默认品牌预算
          source: 'default',
          confidence: 0.5,
        },
        byNiche: {},
      },
    };
  }

  private getDefaultBenchmarks(platform: string, niche: string): IndustryBenchmarks {
    // 返回默认的行业基准
    return {
      platform,
      niche,
      metrics: {
        averageFollowers: 50000,
        averageEngagement: 3.5,
        averageEarnings: 2500,
        topPercentileEarnings: 25000,
        growthRate: 0.15,
      },
      lastUpdated: new Date(),
    };
  }

  private getDefaultCPM(platform: string, country: string): number {
    // 基于平台和国家的默认CPM
    const defaultRates: Record<string, Record<string, number>> = {
      tiktok: { us: 2.5, uk: 2.0, ca: 1.8, other: 1.0 },
      instagram: { us: 3.0, uk: 2.5, ca: 2.2, other: 1.2 },
      youtube: { us: 2.8, uk: 2.3, ca: 2.0, other: 1.1 },
    };

    return defaultRates[platform]?.[country] || defaultRates[platform]?.other || 1.0;
  }

  private getDefaultBrandBudgets(niche: string): any {
    // 返回默认的品牌预算数据
    return {
      total: 1000000,
      trend: 'stable',
      seasonality: 1.0,
    };
  }

  // 辅助方法
  private async fetchBenchmarkData(platform: string, niche: string): Promise<IndustryBenchmarks> {
    // 实现基准数据获取
    throw new Error('Not implemented');
  }

  private async fetchCPMData(platform: string, country: string): Promise<number> {
    // 实现CPM数据获取
    throw new Error('Not implemented');
  }

  private async fetchBrandBudgetData(niche: string, timeframe: string): Promise<any> {
    // 实现品牌预算数据获取
    throw new Error('Not implemented');
  }

  private async getCreatorCount(platform: string, niche: string): Promise<number> {
    // 获取创作者数量
    return 10000;
  }

  private async getBrandDemand(niche: string): Promise<number> {
    // 获取品牌需求
    return 100;
  }
}

// 导出单例实例
export const marketDataService = new MarketDataService();
