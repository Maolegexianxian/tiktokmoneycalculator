// 主翻译入口文件
export { en } from './en';
export { zh } from './zh';
export { default as es } from './es';
export { default as fr } from './fr';
export { default as ja } from './ja';
export { default as ko } from './ko';
export { default as de } from './de';
export * from './types';

import { en } from './en';
import { zh } from './zh';
import es from './es';
import fr from './fr';
import ja from './ja';
import ko from './ko';
import de from './de';
import type { Locale, Messages } from './types';

// 翻译映射
export const messages: Record<Locale, Messages> = {
  en,
  zh,
  es,
  fr,
  ja,
  ko,
  de
} as const;

// 获取翻译函数
export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages.en;
}

// 支持的语言列表
export const supportedLocales: Locale[] = ['en', 'zh', 'es', 'fr', 'ja', 'ko', 'de'];

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
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr' as const,
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'es-ES'
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr' as const,
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'fr-FR'
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr' as const,
    currency: 'JPY',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: 'ja-JP'
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr' as const,
    currency: 'KRW',
    dateFormat: 'yyyy.MM.dd',
    numberFormat: 'ko-KR'
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr' as const,
    currency: 'EUR',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: 'de-DE'
  }
} as const;