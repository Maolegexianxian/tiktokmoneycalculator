/**
 * 类型安全的国际化钩子
 * 提供编译时类型检查和自动补全
 */

import { useTranslations as useNextIntlTranslations } from 'next-intl';
import type { TranslationKey, TranslationNamespace } from './translations';

/**
 * 类型安全的翻译钩子
 * @param namespace 翻译命名空间
 * @returns 类型安全的翻译函数
 */
export function useTypedTranslations<T extends TranslationNamespace>(namespace: T) {
  const t = useNextIntlTranslations(namespace);
  
  return {
    /**
     * 获取翻译文本
     * @param key 翻译键，支持嵌套路径
     * @param values 插值参数
     */
    t: (key: string, values?: Record<string, any>) => {
      return t(key as any, values);
    },
    
    /**
     * 检查翻译键是否存在
     * @param key 翻译键
     */
    has: (key: string) => {
      try {
        t(key as any);
        return true;
      } catch {
        return false;
      }
    },
    
    /**
     * 获取原始翻译函数（用于动态键）
     */
    raw: t
  };
}

/**
 * 全局翻译钩子（不限制命名空间）
 * 用于跨命名空间的翻译
 */
export function useGlobalTranslations() {
  return {
    /**
     * 获取翻译文本
     * @param key 完整的翻译键路径
     * @param values 插值参数
     */
    t: (key: TranslationKey, values?: Record<string, any>) => {
      const [namespace, ...keyParts] = key.split('.');
      const t = useNextIntlTranslations(namespace);
      return t(keyParts.join('.'), values);
    }
  };
}

/**
 * 服务端翻译函数类型
 */
export type ServerTranslationFunction = {
  (key: string, values?: Record<string, any>): string;
  has: (key: string) => boolean;
  raw: (key: string, values?: Record<string, any>) => string;
};

/**
 * 翻译参数类型
 */
export interface TranslationValues {
  [key: string]: string | number | boolean | Date | null | undefined;
}

/**
 * 翻译配置类型
 */
export interface TranslationConfig {
  namespace: TranslationNamespace;
  fallback?: string;
  strict?: boolean; // 严格模式：缺失翻译时抛出错误
}

/**
 * 创建类型安全的翻译上下文
 */
export function createTranslationContext<T extends TranslationNamespace>(
  namespace: T,
  config?: Partial<TranslationConfig>
) {
  return {
    namespace,
    useTranslations: () => useTypedTranslations(namespace),
    config: { namespace, ...config }
  };
}

/**
 * 翻译键验证器
 */
export class TranslationKeyValidator {
  private static validKeys: Set<string> = new Set();
  
  /**
   * 初始化有效键集合
   */
  static initialize(keys: TranslationKey[]) {
    this.validKeys = new Set(keys);
  }
  
  /**
   * 验证翻译键是否有效
   */
  static validate(key: string): key is TranslationKey {
    return this.validKeys.has(key as TranslationKey);
  }
  
  /**
   * 获取所有有效键
   */
  static getValidKeys(): TranslationKey[] {
    return Array.from(this.validKeys) as TranslationKey[];
  }
  
  /**
   * 查找相似的键（用于错误提示）
   */
  static findSimilarKeys(key: string, threshold = 0.6): TranslationKey[] {
    const validKeys = this.getValidKeys();
    return validKeys.filter(validKey => {
      const similarity = this.calculateSimilarity(key, validKey);
      return similarity >= threshold;
    });
  }
  
  /**
   * 计算字符串相似度
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
  
  /**
   * 计算编辑距离
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(0)
    );

    for (let i = 0; i <= str1.length; i++) {
      (matrix[0] as number[])[i] = i;
    }
    for (let j = 0; j <= str2.length; j++) {
      (matrix[j] as number[])[0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = (str1[i - 1] || '') === (str2[j - 1] || '') ? 0 : 1;
        // @ts-ignore
        (matrix[j] as number[])[i] = Math.min(
          // @ts-ignore
          (matrix[j] as number[])[i - 1] + 1,
          // @ts-ignore
          (matrix[j - 1] as number[])[i] + 1,
          // @ts-ignore
          (matrix[j - 1] as number[])[i - 1] + indicator
        );
      }
    }

    return (matrix[str2.length] as number[])[str1.length] || 0;
  }
}

/**
 * 开发环境翻译调试工具
 */
export class TranslationDebugger {
  private static usedKeys: Set<string> = new Set();
  private static missingKeys: Set<string> = new Set();
  
  /**
   * 记录使用的翻译键
   */
  static recordUsage(key: string, found: boolean) {
    if (process.env.NODE_ENV === 'development') {
      if (found) {
        this.usedKeys.add(key);
      } else {
        this.missingKeys.add(key);
        console.warn(`🌐 Missing translation key: ${key}`);
      }
    }
  }
  
  /**
   * 获取使用统计
   */
  static getUsageStats() {
    return {
      usedKeys: Array.from(this.usedKeys),
      missingKeys: Array.from(this.missingKeys),
      totalUsed: this.usedKeys.size,
      totalMissing: this.missingKeys.size
    };
  }
  
  /**
   * 清除统计数据
   */
  static clearStats() {
    this.usedKeys.clear();
    this.missingKeys.clear();
  }
}
