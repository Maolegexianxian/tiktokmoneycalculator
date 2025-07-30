# Docker 构建 Node.js 版本问题修复指南

## 问题描述

Docker 构建过程中遇到 Node.js 版本不兼容的问题：
```
You are using Node.js 18.12.1. For Next.js, Node.js version >= v18.17.0 is required.
```

## 原因分析

1. **版本不匹配**：Next.js 要求 Node.js 版本 >= v18.17.0，但构建环境使用的是 18.12.1
2. **构建缓存**：即使更新了 Dockerfile 中的 Node.js 版本，Docker 可能仍在使用缓存的旧版本层

## 解决方案

### 1. Dockerfile 修复
已完成以下修改：
- 删除了重复的 `FROM base` 指令
- 统一所有构建阶段使用 `node:18.17-alpine3.15`：
  ```dockerfile
  # deps 阶段
  FROM node:18.17-alpine3.15 AS deps
  
  # builder 阶段
  FROM node:18.17-alpine3.15 AS builder
  
  # runner 阶段
  FROM node:18.17-alpine3.15 AS runner
  ```

### 2. 构建命令
为确保使用新的 Node.js 版本，在执行 Docker 构建时需要：
1. 清除 Docker 构建缓存
2. 强制重新构建所有层

```bash
# 清除构建缓存并重新构建
docker build --no-cache -t tiktokmoneycalculator .
```

## 验证步骤

1. **本地环境验证**
   ```bash
   # 检查 Node.js 版本
   node -v  # 应该显示 v18.17.0 或更高版本
   
   # 运行本地构建
   npm run build
   ```

2. **Docker 环境验证**
   ```bash
   # 清除旧的构建缓存
   docker builder prune -f
   
   # 使用 --no-cache 标志构建
   docker build --no-cache -t tiktokmoneycalculator .
   
   # 运行容器并检查版本
   docker run -it tiktokmoneycalculator node -v
   ```

## 注意事项

1. **缓存清理**：如果更新 Node.js 版本后仍然遇到问题，请确保：
   - 使用 `--no-cache` 标志进行构建
   - 或者完全清除 Docker 构建缓存

2. **版本检查**：在每个构建阶段都确保使用正确的 Node.js 版本：
   - deps 阶段：`node:18.17-alpine3.15`
   - builder 阶段：`node:18.17-alpine3.15`
   - runner 阶段：`node:18.17-alpine3.15`

3. **兼容性**：确保所有依赖都兼容 Node.js 18.17：
   - 检查 `package.json` 中的依赖版本
   - 特别注意 Next.js 和其他核心依赖的版本要求

## 后续建议

1. 考虑在 `package.json` 中添加 `engines` 字段来明确指定 Node.js 版本要求：
   ```json
   {
     "engines": {
       "node": ">=18.17.0"
     }
   }
   ```

2. 在 CI/CD 流程中添加 Node.js 版本检查步骤

3. 定期更新依赖以确保与最新的 Node.js LTS 版本兼容