import { getRequestConfig } from 'next-intl/server';
import { getMessages, isValidLocale, localeConfigs } from './messages';
import type { Locale } from './messages/types';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // 验证语言环境
  if (!isValidLocale(locale)) {
    locale = 'en';
  }

  const config = localeConfigs[locale as Locale];
  
  return {
    locale,
    messages: getMessages(locale as Locale),
    timeZone: 'UTC',
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        medium: {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        },
        long: {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      },
      number: {
        precise: {
          maximumFractionDigits: 2
        },
        currency: {
          style: 'currency',
          currency: config.currency
        },
        percent: {
          style: 'percent',
          maximumFractionDigits: 1
        }
      }
    }
  };
});

export const locales = ['en', 'zh'] as const;
export type { Locale };