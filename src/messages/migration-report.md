# 翻译迁移报告

生成时间: 2025-07-23T17:16:42.301Z

## 统计信息

- 总翻译条目: 381
- 成功迁移: 381
- 跳过的条目: 0
- 迁移成功率: 100.00%

## 分类统计

- 短文本 (<20字符): 256
- 中等文本 (20-50字符): 91
- 长文本 (>50字符): 34

## 跳过的原因

- TODO标记: 0
- 空值: 0
- 缺少中文翻译: 0
- 其他: 0

## 使用方法

1. 导入新的翻译Hook:
   ```typescript
   import { useTranslation } from '@/hooks/useTranslation';
   ```

2. 在组件中使用:
   ```typescript
   const { t } = useTranslation();
   return <h1>{t('Your English Text Here')}</h1>;
   ```

3. 英文文本作为键，自动显示对应的中文翻译

## 注意事项

- 如果没有中文翻译，会自动显示英文原文
- 所有翻译键都有TypeScript类型检查
- 建议逐步迁移，先在新功能中使用
