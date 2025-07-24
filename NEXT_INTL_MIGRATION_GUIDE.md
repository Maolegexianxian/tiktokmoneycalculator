# Next-intl 模块化翻译系统迁移指南

## 概述

本项目已成功从传统的 JSON 翻译文件迁移到模块化的 TypeScript 翻译系统，提供了更好的类型安全、开发体验和维护性。

## 新的文件结构

```
src/messages/
├── index.ts              # 主入口文件
├── types.ts              # 类型定义
├── en/                   # 英文翻译模块
│   ├── index.ts          # 英文入口
│   ├── metadata.ts       # 元数据翻译
│   ├── not-found.ts      # 404页面翻译
│   ├── header.ts         # 头部翻译
│   ├── hero.ts           # 首页英雄区翻译
│   ├── calculator.ts     # 计算器翻译
│   ├── dashboard.ts      # 仪表板翻译
│   ├── auth.ts           # 认证翻译
│   ├── common.ts         # 通用翻译
│   ├── faq.ts            # FAQ翻译
│   ├── features.ts       # 功能特性翻译
│   ├── testimonials.ts   # 用户评价翻译
│   └── platforms.ts      # 平台翻译
└── zh/                   # 中文翻译模块
    ├── index.ts          # 中文入口
    └── ...               # 与英文相同的模块结构
```

## 主要改进

### 1. 类型安全
- 完整的 TypeScript 类型支持
- 编译时翻译键验证
- 自动补全和错误检查

### 2. 模块化结构
- 按功能模块组织翻译
- 更好的代码组织和维护
- 支持按需加载

### 3. 开发体验
- 更好的 IDE 支持
- 自动补全翻译键
- 重构时的安全性

## 使用方法

### 基本用法

```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('header.nav');
  
  return (
    <nav>
      <a href="/">{t('home')}</a>
      <a href="/dashboard">{t('dashboard')}</a>
    </nav>
  );
}
```

### 类型安全的翻译

```typescript
import { useTypedTranslations } from '@/lib/i18n-utils';

function TypedComponent() {
  // 获得完整的类型支持
  const t = useTypedTranslations('calculator');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 服务端使用

```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('metadata');
  
  return (
    <div>
      <title>{t('title')}</title>
      <meta name="description" content={t('description')} />
    </div>
  );
}
```

### 格式化工具

```typescript
import { formatCurrency, formatNumber, formatDate } from '@/lib/i18n-utils';

// 货币格式化
const price = formatCurrency(1234.56, 'en'); // "$1,234.56"
const priceZh = formatCurrency(1234.56, 'zh'); // "¥1,234.56"

// 数字格式化
const number = formatNumber(1234567, 'en'); // "1,234,567"

// 日期格式化
const date = formatDate(new Date(), 'en'); // "12/25/2023"
```

## 配置更新

### i18n.ts 配置

```typescript
import { getRequestConfig } from 'next-intl/server';
import { getMessages, isValidLocale, localeConfigs } from './messages';

export default getRequestConfig(async ({ locale }) => {
  if (!isValidLocale(locale)) {
    locale = 'en';
  }

  const config = localeConfigs[locale];
  
  return {
    messages: getMessages(locale),
    // ... 其他配置
  };
});
```

### routing.ts 配置

```typescript
import { defineRouting } from 'next-intl/routing';
import { supportedLocales, defaultLocale } from './messages';

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale,
  // ... 其他配置
});
```

## 开发工具

### 翻译完整性检查

```typescript
import { checkTranslationCompleteness } from '@/lib/i18n-utils';

// 检查中文翻译的完整性
const report = checkTranslationCompleteness('en', 'zh');
console.log(`翻译覆盖率: ${report.coverage}%`);
console.log(`缺失翻译: ${report.missing.length}`);
```

### 获取所有翻译键

```typescript
import { getAllTranslationKeys } from '@/lib/i18n-utils';
import { en } from '@/messages';

const allKeys = getAllTranslationKeys(en);
console.log('所有翻译键:', allKeys);
```

## 最佳实践

### 1. 模块组织
- 按功能模块组织翻译
- 保持模块大小适中
- 使用描述性的键名

### 2. 类型安全
- 使用 `useTypedTranslations` 获得类型支持
- 避免使用字符串字面量作为翻译键
- 利用 TypeScript 的自动补全

### 3. 性能优化
- 翻译文件会被自动代码分割
- 只加载当前语言的翻译
- 使用 `const` 断言确保类型推断

### 4. 维护性
- 定期检查翻译完整性
- 使用一致的命名约定
- 添加适当的注释和文档

## 迁移检查清单

- [x] 创建模块化翻译文件结构
- [x] 更新 i18n 配置
- [x] 更新路由配置
- [x] 创建类型定义
- [x] 创建实用工具函数
- [x] 创建迁移指南
- [ ] 更新组件以使用新的翻译系统
- [ ] 测试所有翻译功能
- [ ] 删除旧的 JSON 翻译文件

## 故障排除

### 常见问题

1. **翻译键未找到**
   - 检查键名是否正确
   - 确保模块已正确导出
   - 使用开发工具验证翻译键

2. **类型错误**
   - 确保使用正确的翻译命名空间
   - 检查类型定义是否最新
   - 重启 TypeScript 服务

3. **运行时错误**
   - 检查语言环境配置
   - 确保所有翻译模块都已导入
   - 验证翻译文件语法

## 下一步

1. 逐步更新现有组件使用新的翻译系统
2. 添加更多语言支持
3. 集成翻译管理工具
4. 添加自动化测试
5. 优化构建性能

---

这个新的翻译系统为项目提供了更好的类型安全、开发体验和维护性。通过模块化的结构，我们可以更好地组织和管理翻译内容，同时保持代码的可读性和可维护性。