// 基础类型定义
export type Locale = 'en' | 'zh' | 'es' | 'fr' | 'ja' | 'ko' | 'de';

// 消息结构类型
export interface Messages {
  metadata: {
    title: string;
    description: string;
    keywords: string;
    home: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
    search: {
      title: string;
      description: string;
      placeholder: string;
    };
    quickNav: {
      title: string;
      home: string;
      calculator: string;
      faq: string;
    };
    actions: {
      backHome: string;
    };
    recommendations: {
      title: string;
      description: string;
      calculator: string;
      calculatorDesc: string;
      faq: string;
      faqDesc: string;
    };
    causes: {
      title: string;
      common: {
        title: string;
        typo: string;
        outdated: string;
        moved: string;
        deleted: string;
      };
      solutions: {
        title: string;
        checkUrl: string;
        useSearch: string;
        goHome: string;
        contact: string;
      };
    };
    help: {
      stillNeed: string;
      contact: string;
    };
  };
  header: {
    nav: {
      home: string;
      calculator: string;
      dashboard: string;
      blog: string;
      about: string;
      contact: string;
    };
    auth: {
      signIn: string;
      signUp: string;
      signOut: string;
      profile: string;
    };
    languageSwitcher: {
      label: string;
      english: string;
      chinese: string;
    };
  };
  hero: Record<string, any>;
  calculator: Record<string, any>;
  dashboard: Record<string, any>;
  auth: Record<string, any>;
  common: Record<string, any>;
  faq: Record<string, any>;
  features: Record<string, any>;
  testimonials: Record<string, any>;
  platforms: Record<string, any>;
}

// 翻译键类型
export type TranslationKeys = {
  [K in keyof Messages]: Messages[K] extends Record<string, any>
    ? {
        [P in keyof Messages[K]]: Messages[K][P] extends Record<string, any>
          ? {
              [Q in keyof Messages[K][P]]: Messages[K][P][Q] extends Record<string, any>
                ? {
                    [R in keyof Messages[K][P][Q]]: `${K & string}.${P & string}.${Q & string}.${R & string}`
                  }[keyof Messages[K][P][Q]]
                : `${K & string}.${P & string}.${Q & string}`
            }[keyof Messages[K][P]]
          : `${K & string}.${P & string}`
      }[keyof Messages[K]]
    : K & string
}[keyof Messages];

// 嵌套键类型辅助
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)];

// 翻译函数类型
export type TranslationFunction = {
  <Key extends NestedKeyOf<Messages>>(
    key: Key,
    values?: Record<string, string | number>
  ): string;
  rich<Key extends NestedKeyOf<Messages>>(
    key: Key,
    values?: Record<string, React.ReactNode>
  ): React.ReactNode;
};

// 语言环境配置
export interface LocaleConfig {
  locale: Locale;
  messages: Messages;
  direction: 'ltr' | 'rtl';
  currency: string;
  dateFormat: string;
  numberFormat: string;
}

// 导出所有翻译
// 注意：这里不直接导入，而是在需要时动态导入
// export const translations = {
//   en,
//   zh
// } as const;

// 验证翻译完整性的类型
type ValidateTranslations<T extends Record<Locale, any>> = {
  [K in keyof T]: T[K] extends Messages ? T[K] : never;
};

// 注意：验证检查在运行时进行，而不是编译时
// type _ValidationCheck = ValidateTranslations<typeof translations>;