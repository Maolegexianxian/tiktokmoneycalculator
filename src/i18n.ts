import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // 验证语言环境
  if (!locale || !['en', 'zh', 'es', 'fr'].includes(locale)) {
    locale = 'en';
  }

  // 动态导入消息
  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'UTC',
    now: new Date(),
  };
});

export const locales = ['en', 'zh', 'es', 'fr'] as const;
export type Locale = typeof locales[number];