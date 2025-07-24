# 代码质量提升建议

基于当前项目的国际化解决方案，以下是提升代码质量和可维护性的具体建议。

## 🚀 性能优化建议

### 1. 翻译文件懒加载

**当前状态**：所有翻译文件在应用启动时加载
**优化建议**：实现按需加载翻译文件

```typescript
// src/lib/i18n-lazy-loader.ts
export class I18nLazyLoader {
  private cache = new Map<string, any>();
  
  async loadNamespace(locale: string, namespace: string) {
    const key = `${locale}-${namespace}`;
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    try {
      const messages = await import(`../../messages/${locale}/${namespace}.json`);
      this.cache.set(key, messages.default);
      return messages.default;
    } catch (error) {
      console.warn(`Failed to load namespace ${namespace} for locale ${locale}`);
      return {};
    }
  }
  
  preloadNamespaces(locale: string, namespaces: string[]) {
    return Promise.all(
      namespaces.map(ns => this.loadNamespace(locale, ns))
    );
  }
}
```

### 2. 翻译缓存优化

```typescript
// src/lib/i18n-cache.ts
import { LRUCache } from 'lru-cache';

class TranslationCache {
  private cache = new LRUCache<string, string>({
    max: 1000, // 最多缓存1000个翻译结果
    ttl: 1000 * 60 * 30, // 30分钟过期
  });
  
  get(key: string, locale: string): string | undefined {
    return this.cache.get(`${locale}:${key}`);
  }
  
  set(key: string, locale: string, value: string): void {
    this.cache.set(`${locale}:${key}`, value);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const translationCache = new TranslationCache();
```

### 3. 构建时优化

```javascript
// scripts/optimize-translations.js
const fs = require('fs');
const path = require('path');

class TranslationOptimizer {
  // 移除未使用的翻译键
  removeUnusedKeys(translationFiles, usedKeys) {
    Object.keys(translationFiles).forEach(locale => {
      const optimized = this.filterUsedKeys(translationFiles[locale], usedKeys);
      fs.writeFileSync(
        path.join('messages', `${locale}.optimized.json`),
        JSON.stringify(optimized, null, 2)
      );
    });
  }
  
  // 压缩翻译文件
  compressTranslations() {
    const gzip = require('zlib');
    // 实现 gzip 压缩逻辑
  }
  
  // 分析翻译文件大小
  analyzeSize() {
    // 生成大小分析报告
  }
}
```

## 🔒 安全性增强

### 1. 翻译内容安全过滤

```typescript
// src/lib/i18n-security.ts
import DOMPurify from 'dompurify';

export class TranslationSecurity {
  // 过滤 HTML 内容
  static sanitizeHtml(content: string): string {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href', 'target']
    });
  }
  
  // 验证翻译键格式
  static validateKey(key: string): boolean {
    const keyPattern = /^[a-z0-9]+(?:\.[a-z0-9-]+)*$/;
    return keyPattern.test(key);
  }
  
  // 检测可疑内容
  static detectSuspiciousContent(content: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /data:text\/html/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(content));
  }
}
```

### 2. 翻译文件完整性验证

```typescript
// src/lib/i18n-integrity.ts
import crypto from 'crypto';

export class TranslationIntegrity {
  // 生成翻译文件哈希
  static generateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
  
  // 验证翻译文件完整性
  static verifyIntegrity(filePath: string, expectedHash: string): boolean {
    const content = fs.readFileSync(filePath, 'utf8');
    const actualHash = this.generateHash(content);
    return actualHash === expectedHash;
  }
  
  // 生成完整性清单
  static generateManifest(messagesDir: string): Record<string, string> {
    const manifest: Record<string, string> = {};
    const files = fs.readdirSync(messagesDir);
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(path.join(messagesDir, file), 'utf8');
        manifest[file] = this.generateHash(content);
      }
    });
    
    return manifest;
  }
}
```

## 📊 监控和分析

### 1. 翻译使用情况分析

```typescript
// src/lib/i18n-analytics.ts
export class TranslationAnalytics {
  private static instance: TranslationAnalytics;
  private usageStats = new Map<string, number>();
  
  static getInstance(): TranslationAnalytics {
    if (!this.instance) {
      this.instance = new TranslationAnalytics();
    }
    return this.instance;
  }
  
  // 记录翻译键使用
  trackUsage(key: string, locale: string): void {
    const trackingKey = `${locale}:${key}`;
    const current = this.usageStats.get(trackingKey) || 0;
    this.usageStats.set(trackingKey, current + 1);
  }
  
  // 获取使用统计
  getUsageStats(): Record<string, number> {
    return Object.fromEntries(this.usageStats);
  }
  
  // 生成使用报告
  generateReport(): {
    totalKeys: number;
    mostUsed: Array<{ key: string; count: number }>;
    leastUsed: Array<{ key: string; count: number }>;
    unusedKeys: string[];
  } {
    const entries = Array.from(this.usageStats.entries());
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    
    return {
      totalKeys: entries.length,
      mostUsed: sorted.slice(0, 10).map(([key, count]) => ({ key, count })),
      leastUsed: sorted.slice(-10).map(([key, count]) => ({ key, count })),
      unusedKeys: entries.filter(([, count]) => count === 0).map(([key]) => key)
    };
  }
}
```

### 2. 性能监控

```typescript
// src/lib/i18n-performance.ts
export class TranslationPerformance {
  private static metrics = {
    translationTime: [] as number[],
    cacheHitRate: 0,
    totalRequests: 0,
    cacheHits: 0
  };
  
  static startTimer(): () => number {
    const start = performance.now();
    return () => performance.now() - start;
  }
  
  static recordTranslationTime(duration: number): void {
    this.metrics.translationTime.push(duration);
    // 只保留最近1000次记录
    if (this.metrics.translationTime.length > 1000) {
      this.metrics.translationTime.shift();
    }
  }
  
  static recordCacheHit(isHit: boolean): void {
    this.metrics.totalRequests++;
    if (isHit) {
      this.metrics.cacheHits++;
    }
    this.metrics.cacheHitRate = this.metrics.cacheHits / this.metrics.totalRequests;
  }
  
  static getMetrics() {
    const times = this.metrics.translationTime;
    return {
      averageTranslationTime: times.reduce((a, b) => a + b, 0) / times.length,
      maxTranslationTime: Math.max(...times),
      minTranslationTime: Math.min(...times),
      cacheHitRate: this.metrics.cacheHitRate,
      totalRequests: this.metrics.totalRequests
    };
  }
}
```

## 🧪 测试策略增强

### 1. 翻译完整性测试

```typescript
// tests/i18n/translation-completeness.test.ts
import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Translation Completeness', () => {
  const messagesDir = path.resolve('messages');
  const supportedLocales = ['en', 'zh'];
  
  it('should have all required translation files', () => {
    supportedLocales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
  
  it('should have consistent keys across all locales', () => {
    const translations = {};
    
    supportedLocales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`);
      translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    });
    
    const baseKeys = extractKeys(translations['en']);
    
    supportedLocales.slice(1).forEach(locale => {
      const keys = extractKeys(translations[locale]);
      expect(keys).toEqual(baseKeys);
    });
  });
  
  it('should not have empty translations', () => {
    supportedLocales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`);
      const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const emptyKeys = findEmptyValues(translations);
      expect(emptyKeys).toEqual([]);
    });
  });
});

function extractKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  });
  return keys.sort();
}

function findEmptyValues(obj: any, prefix = ''): string[] {
  const emptyKeys: string[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      emptyKeys.push(...findEmptyValues(value, fullKey));
    } else if (!value || value.toString().trim() === '') {
      emptyKeys.push(fullKey);
    }
  });
  return emptyKeys;
}
```

### 2. 组件翻译测试

```typescript
// tests/components/i18n-component.test.tsx
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { MyButton } from '@/components/example/MyButton';

const mockMessages = {
  example: {
    title: 'Test Title',
    'button-text': 'Test Button',
    description: 'Test Description'
  }
};

function renderWithI18n(component: React.ReactElement, locale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={mockMessages}>
      {component}
    </NextIntlClientProvider>
  );
}

describe('MyButton Component', () => {
  it('should render with correct translations', () => {
    renderWithI18n(<MyButton />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
  
  it('should handle missing translations gracefully', () => {
    renderWithI18n(<MyButton />, 'fr'); // 不支持的语言
    
    // 应该显示键名或默认值
    expect(screen.getByText(/title|Test Title/)).toBeInTheDocument();
  });
});
```

## 📈 CI/CD 集成优化

### 1. GitHub Actions 工作流

```yaml
# .github/workflows/i18n-quality.yml
name: I18n Quality Check

on:
  pull_request:
    paths:
      - 'src/**'
      - 'messages/**'
      - 'scripts/**'

jobs:
  i18n-quality:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Extract translation keys
        run: npm run i18n:extract
      
      - name: Sync translations
        run: npm run i18n:sync
      
      - name: Generate types
        run: npm run i18n:types
      
      - name: Validate translations
        run: npm run i18n:validate
      
      - name: Check for hardcoded strings
        run: npm run lint -- --ext .ts,.tsx src/
      
      - name: Run i18n tests
        run: npm test -- tests/i18n/
      
      - name: Generate coverage report
        run: npm run i18n:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/i18n-coverage.json
      
      - name: Comment PR with i18n stats
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('i18n-report.json', 'utf8'));
            
            const comment = `## 🌍 I18n Quality Report
            
            - **Total Keys**: ${report.totalKeys}
            - **Coverage**: ${report.coverage}%
            - **Missing Translations**: ${report.missingCount}
            - **Unused Keys**: ${report.unusedCount}
            
            ${report.warnings.length > 0 ? '⚠️ **Warnings**:\n' + report.warnings.map(w => `- ${w}`).join('\n') : '✅ No warnings'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### 2. 预提交钩子优化

```bash
#!/bin/sh
# .git/hooks/pre-commit (优化版)

echo "🔍 Running enhanced pre-commit checks..."

# 检查是否有翻译文件变更
if git diff --cached --name-only | grep -q "messages/\|src/.*\.(ts|tsx)$"; then
  echo "📝 Translation-related files changed, running full i18n check..."
  
  # 运行完整的 i18n 检查
  npm run i18n:all
  if [ $? -ne 0 ]; then
    echo "❌ I18n validation failed"
    exit 1
  fi
  
  # 检查翻译覆盖率
  npm run i18n:coverage
  coverage=$(cat coverage/i18n-coverage.json | jq '.coverage')
  if [ "$coverage" -lt 90 ]; then
    echo "⚠️ Translation coverage is below 90% ($coverage%)"
    echo "Consider adding missing translations before committing."
  fi
  
  # 自动添加生成的文件
  git add src/types/i18n-generated.ts messages/
fi

# 运行其他检查
npm run lint
npm run type-check

echo "✅ All pre-commit checks passed!"
```

## 🔧 开发工具增强

### 1. VS Code 扩展配置

```json
// .vscode/settings.json
{
  "i18n-ally.localesPaths": ["messages"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.defaultNamespace": "common",
  "i18n-ally.enabledFrameworks": ["next-intl"],
  "i18n-ally.namespace": true,
  "i18n-ally.pathMatcher": "{locale}.json",
  "i18n-ally.sourceLanguage": "en",
  "i18n-ally.displayLanguage": "zh",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.options": {
    "overrideConfigFile": ".eslintrc.i18n.js"
  }
}
```

### 2. 开发环境调试工具

```typescript
// src/lib/i18n-dev-tools.ts
export class I18nDevTools {
  private static isEnabled = process.env.NODE_ENV === 'development';
  
  // 在开发环境显示翻译键
  static wrapTranslation(key: string, value: string): string {
    if (!this.isEnabled) return value;
    
    const showKeys = localStorage.getItem('i18n-show-keys') === 'true';
    return showKeys ? `[${key}] ${value}` : value;
  }
  
  // 高亮缺失的翻译
  static highlightMissing(key: string, value: string): string {
    if (!this.isEnabled) return value;
    
    if (value.startsWith('[TODO:') || value === key) {
      return `<span style="background: yellow; color: red;">${value}</span>`;
    }
    return value;
  }
  
  // 添加调试面板
  static addDebugPanel(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    
    const panel = document.createElement('div');
    panel.innerHTML = `
      <div style="position: fixed; top: 10px; right: 10px; background: white; border: 1px solid #ccc; padding: 10px; z-index: 9999;">
        <h4>I18n Debug Panel</h4>
        <label>
          <input type="checkbox" id="show-keys"> Show Translation Keys
        </label><br>
        <label>
          <input type="checkbox" id="highlight-missing"> Highlight Missing
        </label><br>
        <button id="export-usage">Export Usage Stats</button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // 绑定事件
    document.getElementById('show-keys')?.addEventListener('change', (e) => {
      localStorage.setItem('i18n-show-keys', (e.target as HTMLInputElement).checked.toString());
      window.location.reload();
    });
    
    document.getElementById('export-usage')?.addEventListener('click', () => {
      const stats = TranslationAnalytics.getInstance().getUsageStats();
      const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'i18n-usage-stats.json';
      a.click();
    });
  }
}
```

## 📋 总结和行动计划

### 立即实施（高优先级）

1. **设置 Git Hooks**
   ```bash
   node scripts/setup-git-hooks.js install
   ```

2. **配置 ESLint 规则**
   ```bash
   # 在 .eslintrc.json 中添加
   "extends": ["./.eslintrc.i18n.js"]
   ```

3. **添加翻译完整性测试**
   - 创建测试文件确保翻译一致性
   - 集成到 CI/CD 流程

### 中期实施（中优先级）

1. **性能优化**
   - 实现翻译缓存
   - 添加性能监控
   - 优化构建流程

2. **安全性增强**
   - 添加内容过滤
   - 实现完整性验证
   - 安全审计流程

### 长期规划（低优先级）

1. **高级功能**
   - 翻译文件懒加载
   - 使用情况分析
   - 自动化翻译建议

2. **工具生态**
   - VS Code 扩展集成
   - 开发调试工具
   - 翻译管理平台

这些建议将显著提升项目的国际化质量、性能和可维护性。建议按优先级逐步实施，确保每个阶段都有明显的改进效果。