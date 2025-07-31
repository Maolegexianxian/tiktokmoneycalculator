import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // 验证语言环境
  if (!locale || !['en', 'zh', 'es', 'fr', 'ja', 'ko', 'de'].includes(locale)) {
    locale = 'en';
  }

  // 动态导入消息 - 使用静态导入映射
  let messages;

  try {
    switch (locale) {
      case 'en':
        messages = (await import('./messages/en/index')).default;
        break;
      case 'zh':
        messages = (await import('./messages/zh/index')).default;
        break;
      case 'es':
        messages = (await import('./messages/es/index')).default;
        break;
      case 'fr':
        messages = (await import('./messages/fr/index')).default;
        break;
      case 'ja':
        messages = (await import('./messages/ja/index')).default;
        break;
      case 'ko':
        messages = (await import('./messages/ko/index')).default;
        break;
      case 'de':
        messages = (await import('./messages/de/index')).default;
        break;
      default:
        messages = (await import('./messages/en/index')).default;
    }
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // 回退到英文
    messages = (await import('./messages/en/index')).default;
  }

  return {
    locale,
    messages,
    timeZone: 'UTC',
    now: new Date(),
  };
});

export const locales = ['en', 'zh', 'es', 'fr', 'ja', 'ko', 'de'] as const;
export type Locale = typeof locales[number];