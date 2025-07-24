import { useTranslations } from 'next-intl';
import type { Messages, Locale, NestedKeyOf } from '../messages/types';
import { getMessages, localeConfigs } from '../messages';

// 类型安全的翻译钩子
export function useTypedTranslations<T extends keyof Messages>(namespace: T) {
  return useTranslations(namespace);
}

// 获取嵌套翻译值的辅助函数
export function getNestedTranslation(
  messages: Messages,
  key: NestedKeyOf<Messages>
): string {
  const keys = key.split('.');
  let value: any = messages;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // 返回键名作为后备
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// 格式化货币的辅助函数
export function formatCurrency(
  amount: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const config = localeConfigs[locale];
  return new Intl.NumberFormat(config.numberFormat, {
    style: 'currency',
    currency: config.currency,
    ...options
  }).format(amount);
}

// 格式化数字的辅助函数
export function formatNumber(
  number: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const config = localeConfigs[locale];
  return new Intl.NumberFormat(config.numberFormat, options).format(number);
}

// 格式化日期的辅助函数
export function formatDate(
  date: Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const config = localeConfigs[locale];
  return new Intl.DateTimeFormat(config.numberFormat, options).format(date);
}

// 获取语言方向
export function getTextDirection(locale: Locale): 'ltr' | 'rtl' {
  return localeConfigs[locale].direction;
}

// 翻译键验证函数（开发环境使用）
export function validateTranslationKey(
  messages: Messages,
  key: string
): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return true;
  }
  
  const keys = key.split('.');
  let value: any = messages;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key "${key}" not found`);
      return false;
    }
  }
  
  return typeof value === 'string';
}

// 获取所有可用的翻译键（开发工具）
export function getAllTranslationKeys(
  obj: any,
  prefix = ''
): string[] {
  const keys: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllTranslationKeys(value, fullKey));
    } else if (typeof value === 'string') {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// 翻译完整性检查（开发工具）
export function checkTranslationCompleteness(
  baseLocale: Locale,
  targetLocale: Locale
): {
  missing: string[];
  extra: string[];
  total: number;
  coverage: number;
} {
  const baseMessages = getMessages(baseLocale);
  const targetMessages = getMessages(targetLocale);
  
  const baseKeys = getAllTranslationKeys(baseMessages);
  const targetKeys = getAllTranslationKeys(targetMessages);
  
  const missing = baseKeys.filter(key => !targetKeys.includes(key));
  const extra = targetKeys.filter(key => !baseKeys.includes(key));
  
  const coverage = ((baseKeys.length - missing.length) / baseKeys.length) * 100;
  
  return {
    missing,
    extra,
    total: baseKeys.length,
    coverage: Math.round(coverage * 100) / 100
  };
}
// 临时调试代码：输出中英文缺失翻译键
if (process.env.NODE_ENV !== 'production') {
  const reportZh = checkTranslationCompleteness('en', 'zh');
  const reportEn = checkTranslationCompleteness('zh', 'en');
  console.log('【英文缺失的翻译键】:', reportEn.missing);
  console.log('【中文缺失的翻译键】:', reportZh.missing);
}