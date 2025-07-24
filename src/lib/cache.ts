import { Redis } from 'ioredis';
import { CACHE_KEYS, CACHE_TTL } from './constants';
import { env } from './utils';

/**
 * Redis缓存客户端
 */
class CacheService {
  private redis: Redis | null = null;
  private memoryCache: Map<string, { value: any; expiry: number }> = new Map();
  private isRedisAvailable = false;

  constructor() {
    this.initializeRedis();
  }

  /**
   * 初始化Redis连接
   */
  private async initializeRedis(): Promise<void> {
    if (!process.env.REDIS_URL || env.isTest) {
      console.log('Redis not configured, using memory cache');
      return;
    }

    try {
      this.redis = new Redis(process.env.REDIS_URL || '', {
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.redis.on('connect', () => {
        this.isRedisAvailable = true;
        console.log('✅ Redis connected successfully');
      });

      this.redis.on('error', (error) => {
        this.isRedisAvailable = false;
        console.error('❌ Redis connection error:', error);
      });

      this.redis.on('close', () => {
        this.isRedisAvailable = false;
        console.log('Redis connection closed');
      });

      await this.redis.connect();
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.isRedisAvailable = false;
    }
  }

  /**
   * 设置缓存值
   */
  async set(
    key: string,
    value: any,
    ttl: number = CACHE_TTL.calculation
  ): Promise<void> {
    const serializedValue = JSON.stringify(value);

    if (this.isRedisAvailable && this.redis) {
      try {
        await this.redis.setex(key, ttl, serializedValue);
        return;
      } catch (error) {
        console.error('Redis set error:', error);
        // 降级到内存缓存
      }
    }

    // 使用内存缓存作为降级方案
    this.memoryCache.set(key, {
      value: serializedValue,
      expiry: Date.now() + ttl * 1000,
    });
  }

  /**
   * 获取缓存值
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (this.isRedisAvailable && this.redis) {
      try {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Redis get error:', error);
        // 降级到内存缓存
      }
    }

    // 使用内存缓存作为降级方案
    const cached = this.memoryCache.get(key);
    if (cached) {
      if (Date.now() > cached.expiry) {
        this.memoryCache.delete(key);
        return null;
      }
      return JSON.parse(cached.value);
    }

    return null;
  }

  /**
   * 删除缓存值
   */
  async del(key: string): Promise<void> {
    if (this.isRedisAvailable && this.redis) {
      try {
        await this.redis.del(key);
        return;
      } catch (error) {
        console.error('Redis del error:', error);
      }
    }

    this.memoryCache.delete(key);
  }

  /**
   * 删除匹配模式的缓存键
   */
  async delPattern(pattern: string): Promise<void> {
    if (this.isRedisAvailable && this.redis) {
      try {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
        return;
      } catch (error) {
        console.error('Redis delPattern error:', error);
      }
    }

    // 内存缓存模式匹配删除
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    Array.from(this.memoryCache.keys()).forEach(key => {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
      }
    });
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    if (this.isRedisAvailable && this.redis) {
      try {
        const result = await this.redis.exists(key);
        return result === 1;
      } catch (error) {
        console.error('Redis exists error:', error);
      }
    }

    const cached = this.memoryCache.get(key);
    if (cached && Date.now() <= cached.expiry) {
      return true;
    }
    return false;
  }

  /**
   * 设置键的过期时间
   */
  async expire(key: string, ttl: number): Promise<void> {
    if (this.isRedisAvailable && this.redis) {
      try {
        await this.redis.expire(key, ttl);
        return;
      } catch (error) {
        console.error('Redis expire error:', error);
      }
    }

    const cached = this.memoryCache.get(key);
    if (cached) {
      cached.expiry = Date.now() + ttl * 1000;
    }
  }

  /**
   * 获取所有匹配模式的键
   */
  async keys(pattern: string): Promise<string[]> {
    if (this.isRedisAvailable && this.redis) {
      try {
        return await this.redis.keys(pattern);
      } catch (error) {
        console.error('Redis keys error:', error);
      }
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return Array.from(this.memoryCache.keys()).filter(key => regex.test(key));
  }

  /**
   * 清理过期的内存缓存
   */
  private cleanupMemoryCache(): void {
    const now = Date.now();
    Array.from(this.memoryCache.entries()).forEach(([key, cached]) => {
      if (now > cached.expiry) {
        this.memoryCache.delete(key);
      }
    });
  }

  /**
   * 获取缓存统计信息
   */
  async getStats(): Promise<{
    type: 'redis' | 'memory';
    keys: number;
    memoryUsage?: number;
  }> {
    if (this.isRedisAvailable && this.redis) {
      try {
        const info = await this.redis.info('memory');
        const memoryUsage = parseInt(info.match(/used_memory:(\d+)/)?.[1] || '0');
        const dbSize = await this.redis.dbsize();
        return {
          type: 'redis',
          keys: dbSize,
          memoryUsage,
        };
      } catch (error) {
        console.error('Redis stats error:', error);
      }
    }

    this.cleanupMemoryCache();
    return {
      type: 'memory',
      keys: this.memoryCache.size,
    };
  }

  /**
   * 清空所有缓存
   */
  async flush(): Promise<void> {
    if (this.isRedisAvailable && this.redis) {
      try {
        await this.redis.flushdb();
        return;
      } catch (error) {
        console.error('Redis flush error:', error);
      }
    }

    this.memoryCache.clear();
  }

  /**
   * 关闭连接
   */
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.disconnect();
      this.redis = null;
      this.isRedisAvailable = false;
    }
    this.memoryCache.clear();
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; type: 'redis' | 'memory' }> {
    if (this.isRedisAvailable && this.redis) {
      try {
        await this.redis.ping();
        return { status: 'healthy', type: 'redis' };
      } catch (error) {
        return { status: 'unhealthy', type: 'redis' };
      }
    }

    return { status: 'healthy', type: 'memory' };
  }
}

/**
 * 缓存装饰器
 */
export function cached(
  keyPrefix: string,
  ttl: number = CACHE_TTL.calculation
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
      
      // 尝试从缓存获取
      const cached = await cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // 执行原方法
      const result = await method.apply(this, args);
      
      // 缓存结果
      await cache.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

/**
 * 缓存工具函数
 */
export const cacheUtils = {
  /**
   * 生成计算结果缓存键
   */
  getCalculationKey(input: any): string {
    const hash = Buffer.from(JSON.stringify(input)).toString('base64');
    return `${CACHE_KEYS.calculation}:${hash}`;
  },

  /**
   * 生成用户历史缓存键
   */
  getUserHistoryKey(userId: string): string {
    return `${CACHE_KEYS.history}:${userId}`;
  },

  /**
   * 生成汇率缓存键
   */
  getExchangeRateKey(from: string, to: string): string {
    return `${CACHE_KEYS.rates}:${from}:${to}`;
  },

  /**
   * 生成行业基准缓存键
   */
  getBenchmarkKey(niche: string, region: string): string {
    return `${CACHE_KEYS.benchmarks}:${niche}:${region}`;
  },
};

// 导出缓存实例
export const cache = new CacheService();

// 在应用启动时初始化缓存清理定时器
if (env.isServer) {
  setInterval(() => {
    cache['cleanupMemoryCache']();
  }, 5 * 60 * 1000); // 每5分钟清理一次
}

// 在进程退出时清理资源
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    await cache.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await cache.disconnect();
    process.exit(0);
  });
}