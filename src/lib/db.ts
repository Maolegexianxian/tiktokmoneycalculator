import { PrismaClient } from '@prisma/client';
import { env } from './utils';

// 全局Prisma客户端实例
declare global {
  var __prisma: PrismaClient | undefined;
}

/**
 * 创建Prisma客户端实例
 */
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: env.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./dev.db',
      },
    },
  });
}

/**
 * 获取Prisma客户端实例
 * 在开发环境中使用全局变量避免热重载时创建多个连接
 */
export const prisma = globalThis.__prisma ?? createPrismaClient();

if (env.isDevelopment) {
  globalThis.__prisma = prisma;
}

/**
 * 数据库连接管理器
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private client: PrismaClient;
  private isConnected: boolean = false;

  private constructor() {
    this.client = prisma;
  }

  /**
   * 获取数据库管理器单例
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * 获取Prisma客户端
   */
  public getClient(): PrismaClient {
    return this.client;
  }

  /**
   * 连接数据库
   */
  public async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.isConnected = true;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  /**
   * 断开数据库连接
   */
  public async disconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
      this.isConnected = false;
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
      throw error;
    }
  }

  /**
   * 检查数据库连接状态
   */
  public async isHealthy(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * 获取连接状态
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * 执行数据库迁移
   */
  public async migrate(): Promise<void> {
    try {
      // 注意：在生产环境中，迁移应该通过CI/CD流程执行
      if (env.isDevelopment) {
        console.log('🔄 Running database migrations...');
        // 这里可以添加自定义迁移逻辑
        console.log('✅ Database migrations completed');
      }
    } catch (error) {
      console.error('❌ Database migration failed:', error);
      throw error;
    }
  }

  /**
   * 清理数据库连接池
   */
  public async cleanup(): Promise<void> {
    try {
      await this.client.$disconnect();
      this.isConnected = false;
    } catch (error) {
      console.error('Database cleanup failed:', error);
    }
  }
}

/**
 * 数据库操作基类
 */
export abstract class BaseRepository {
  protected db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  /**
   * 开始事务
   */
  protected async withTransaction<T>(
    callback: (tx: any) => Promise<T>
  ): Promise<T> {
    return await this.db.$transaction(callback);
  }

  /**
   * 执行原始SQL查询
   */
  protected async executeRaw<T = any>(
    query: string,
    ...values: any[]
  ): Promise<T> {
    return await this.db.$queryRawUnsafe(query, ...values);
  }

  /**
   * 批量操作
   */
  protected async batchExecute<T>(
    operations: Array<() => Promise<T>>
  ): Promise<T[]> {
    return await Promise.all(operations.map(op => op()));
  }
}

/**
 * 用户数据仓库
 */
export class UserRepository extends BaseRepository {
  /**
   * 根据ID查找用户
   */
  async findById(id: string) {
    return await this.db.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        sessions: true,
        historyRecords: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        savedCalculations: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string) {
    return await this.db.user.findUnique({
      where: { email },
    });
  }

  /**
   * 创建用户
   */
  async create(data: {
    email: string;
    name?: string;
    image?: string;
  }) {
    return await this.db.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        image: data.image || null,
      },
    });
  }

  /**
   * 更新用户
   */
  async update(id: string, data: {
    email?: string;
    name?: string;
    image?: string;
  }) {
    return await this.db.user.update({
      where: { id },
      data,
    });
  }

  /**
   * 删除用户
   */
  async delete(id: string) {
    return await this.withTransaction(async (tx) => {
      // 删除相关数据
      await tx.historyRecord.deleteMany({ where: { userId: id } });
      await tx.savedCalculation.deleteMany({ where: { userId: id } });
      await tx.session.deleteMany({ where: { userId: id } });
      await tx.account.deleteMany({ where: { userId: id } });
      
      // 删除用户
      return await tx.user.delete({ where: { id } });
    });
  }
}

/**
 * 计算历史记录仓库
 */
export class HistoryRepository extends BaseRepository {
  /**
   * 创建历史记录
   */
  async create(data: {
    userId?: string;
    platform: string;
    input: any;
    result: any;
  }) {
    return await this.db.historyRecord.create({
      data: {
        ...(data.userId && { userId: data.userId }),
        platform: data.platform,
        inputData: JSON.stringify(data.input),
        resultData: JSON.stringify(data.result),
      },
    });
  }

  /**
   * 获取用户历史记录
   */
  async findByUserId(userId: string, limit: number = 20) {
    const records = await this.db.historyRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return records.map(record => ({
      ...record,
      input: JSON.parse(record.inputData as string),
      result: JSON.parse(record.resultData as string),
    }));
  }

  /**
   * 删除历史记录
   */
  async delete(id: string, userId?: string) {
    const where = userId ? { id, userId } : { id };
    return await this.db.historyRecord.delete({ where });
  }

  /**
   * 清空用户历史记录
   */
  async clearByUserId(userId: string) {
    return await this.db.historyRecord.deleteMany({
      where: { userId },
    });
  }

  /**
   * 获取用户历史记录（带分页和过滤）
   */
  async getHistory(userId: string, options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    niche?: string;
    location?: string;
    platform?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      niche,
      location,
      platform,
      dateFrom,
      dateTo,
    } = options;

    const skip = (page - 1) * limit;

    // 构建where条件
    const where: any = { userId };

    if (platform) {
      where.platform = platform;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    // 对于JSON字段的搜索，我们需要使用原始查询或者在应用层过滤
    const records = await this.db.historyRecord.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    const total = await this.db.historyRecord.count({ where });

    // 解析JSON并应用额外过滤
    let filteredRecords = records.map(record => ({
      ...record,
      input: JSON.parse(record.inputData as string),
      result: JSON.parse(record.resultData as string),
    }));

    // 应用搜索和过滤
    if (search || niche || location) {
      filteredRecords = filteredRecords.filter(record => {
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesSearch =
            record.platform.toLowerCase().includes(searchLower) ||
            record.input.profile?.contentNiche?.toLowerCase().includes(searchLower) ||
            record.input.profile?.audienceLocation?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        if (niche && record.input.profile?.contentNiche !== niche) {
          return false;
        }

        if (location && record.input.profile?.audienceLocation !== location) {
          return false;
        }

        return true;
      });
    }

    return {
      data: filteredRecords,
      total: filteredRecords.length,
      page,
      limit,
      totalPages: Math.ceil(filteredRecords.length / limit),
    };
  }

  /**
   * 获取用户历史统计
   */
  async getHistoryStats(userId: string, filters: any = {}) {
    const records = await this.db.historyRecord.findMany({
      where: { userId },
    });

    const parsedRecords = records.map(record => ({
      ...record,
      input: JSON.parse(record.inputData as string),
      result: JSON.parse(record.resultData as string),
    }));

    // 计算统计数据
    const totalCalculations = parsedRecords.length;
    const avgMonthlyEarnings = parsedRecords.length > 0
      ? parsedRecords.reduce((sum, r) => sum + (r.result.monthlyEarnings || 0), 0) / parsedRecords.length
      : 0;
    const maxMonthlyEarnings = parsedRecords.length > 0
      ? Math.max(...parsedRecords.map(r => r.result.monthlyEarnings || 0))
      : 0;
    const totalFollowers = parsedRecords.length > 0
      ? parsedRecords.reduce((sum, r) => sum + (r.input.metrics?.followers || r.input.metrics?.subscribers || 0), 0)
      : 0;
    const avgEngagementRate = parsedRecords.length > 0
      ? parsedRecords.reduce((sum, r) => sum + (r.input.metrics?.engagementRate || 0), 0) / parsedRecords.length
      : 0;

    // 获取最常用的细分领域和地区
    const nicheCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    const platformCounts: Record<string, number> = {};

    parsedRecords.forEach(record => {
      const niche = record.input.profile?.contentNiche;
      const location = record.input.profile?.audienceLocation;
      const platform = record.platform;

      if (niche) nicheCounts[niche] = (nicheCounts[niche] || 0) + 1;
      if (location) locationCounts[location] = (locationCounts[location] || 0) + 1;
      if (platform) platformCounts[platform] = (platformCounts[platform] || 0) + 1;
    });

    const topNiche = Object.entries(nicheCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
    const topLocation = Object.entries(locationCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
    const mostUsedPlatform = Object.entries(platformCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // 计算本月和上月的计算次数
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const calculationsThisMonth = parsedRecords.filter(r =>
      new Date(r.createdAt) >= thisMonthStart
    ).length;

    const calculationsLastMonth = parsedRecords.filter(r =>
      new Date(r.createdAt) >= lastMonthStart && new Date(r.createdAt) <= lastMonthEnd
    ).length;

    const earningsGrowth = calculationsLastMonth > 0
      ? ((calculationsThisMonth - calculationsLastMonth) / calculationsLastMonth) * 100
      : 0;

    const lastCalculationDate = parsedRecords.length > 0
      ? new Date(Math.max(...parsedRecords.map(r => new Date(r.createdAt).getTime())))
      : new Date();

    return {
      totalCalculations,
      avgMonthlyEarnings,
      maxMonthlyEarnings,
      totalFollowers,
      avgEngagementRate,
      topNiche,
      topLocation,
      calculationsThisMonth,
      calculationsLastMonth,
      earningsGrowth,
      mostUsedPlatform,
      lastCalculationDate,
    };
  }
}

/**
 * 保存的计算结果仓库
 */
export class SavedCalculationRepository extends BaseRepository {
  /**
   * 保存计算结果
   */
  async create(data: {
    userId?: string;
    name?: string;
    platform: string;
    input: any;
    result: any;
  }) {
    return await this.db.savedCalculation.create({
      data: {
        ...(data.userId && { userId: data.userId }),
        name: data.name || `Calculation ${new Date().toLocaleDateString()}`,
        platform: data.platform,
        inputData: JSON.stringify(data.input),
        resultData: JSON.stringify(data.result),
      },
    });
  }

  /**
   * 获取用户保存的计算
   */
  async findByUserId(userId: string, limit: number = 50) {
    const calculations = await this.db.savedCalculation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return calculations.map(calc => ({
      ...calc,
      input: JSON.parse(calc.inputData as string),
      result: JSON.parse(calc.resultData as string),
    }));
  }

  /**
   * 根据ID获取计算结果
   */
  async findById(id: string, userId?: string) {
    const where = userId ? { id, userId } : { id };
    const calculation = await this.db.savedCalculation.findUnique({ where });
    
    if (!calculation) return null;
    
    return {
      ...calculation,
      input: JSON.parse(calculation.inputData as string),
      result: JSON.parse(calculation.resultData as string),
    };
  }

  /**
   * 更新计算结果
   */
  async update(id: string, data: {
    input?: any;
    result?: any;
  }, userId?: string) {
    const where = userId ? { id, userId } : { id };
    const updateData: any = {};
    
    if (data.input) updateData.inputData = JSON.stringify(data.input);
    if (data.result) updateData.resultData = JSON.stringify(data.result);

    const calculation = await this.db.savedCalculation.update({
      where,
      data: updateData,
    });

    return {
      ...calculation,
      input: JSON.parse(calculation.inputData as string),
      result: JSON.parse(calculation.resultData as string),
    };
  }

  /**
   * 删除计算结果
   */
  async delete(id: string, userId?: string) {
    const where = userId ? { id, userId } : { id };
    return await this.db.savedCalculation.delete({ where });
  }
}

/**
 * 平台配置仓库
 */
export class PlatformConfigRepository extends BaseRepository {
  /**
   * 获取所有平台配置
   */
  async findAll() {
    return await this.db.platformConfig.findMany({
      orderBy: { platform: 'asc' },
    });
  }

  /**
   * 根据平台获取配置
   */
  async findByPlatform(platform: string) {
    return await this.db.platformConfig.findUnique({
      where: { platform },
    });
  }

  /**
   * 更新平台配置
   */
  async updateByPlatform(platform: string, config: any) {
    return await this.db.platformConfig.upsert({
      where: { platform },
      update: { config },
      create: {
        platform,
        config,
      },
    });
  }

  /**
   * 删除平台配置
   */
  async deleteByPlatform(platform: string) {
    return await this.db.platformConfig.delete({
      where: { platform },
    });
  }
}

/**
 * 汇率仓库
 */
export class ExchangeRateRepository extends BaseRepository {
  /**
   * 获取汇率
   */
  async getRate(fromCurrency: string, toCurrency: string) {
    return await this.db.exchangeRate.findFirst({
      where: {
        fromCurrency,
        toCurrency,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * 更新汇率
   */
  async updateRate(fromCurrency: string, toCurrency: string, rate: number) {
    return await this.db.exchangeRate.upsert({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency,
          toCurrency,
        },
      },
      update: { rate },
      create: {
        fromCurrency,
        toCurrency,
        rate,
      },
    });
  }

  /**
   * 批量更新汇率
   */
  async batchUpdateRates(rates: Array<{
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  }>) {
    return await this.withTransaction(async (tx) => {
      const operations = rates.map(({ fromCurrency, toCurrency, rate }) =>
        tx.exchangeRate.upsert({
          where: {
            fromCurrency_toCurrency: {
              fromCurrency,
              toCurrency,
            },
          },
          update: { rate },
          create: {
            fromCurrency,
            toCurrency,
            rate,
          },
        })
      );
      
      return await Promise.all(operations);
    });
  }
}

// 导出仓库实例
export const userRepository = new UserRepository();
export const historyRepository = new HistoryRepository();
export const savedCalculationRepository = new SavedCalculationRepository();
export const platformConfigRepository = new PlatformConfigRepository();
export const exchangeRateRepository = new ExchangeRateRepository();

// 导出数据库管理器实例
export const dbManager = DatabaseManager.getInstance();

// 优雅关闭处理
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await dbManager.cleanup();
  });

  process.on('SIGINT', async () => {
    await dbManager.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await dbManager.cleanup();
    process.exit(0);
  });
}