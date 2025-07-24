// 主翻译入口文件
export { en } from './en';
export { zh } from './zh';
export * from './types';

import { en } from './en';
import { zh } from './zh';
import type { Locale, Messages } from './types';

// 翻译映射
export const messages: Record<Locale, Messages> = {
  en,
  zh
} as const;

// 获取翻译函数
export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages.en;
}

// 支持的语言列表
export const supportedLocales: Locale[] = ['en', 'zh'];

// 默认语言
export const defaultLocale: Locale = 'en';

// 验证语言是否支持
export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

// 语言配置
export const localeConfigs = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr' as const,
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US'
  },
  zh: {
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr' as const,
    currency: 'CNY',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: 'zh-CN'
  }
} as const;