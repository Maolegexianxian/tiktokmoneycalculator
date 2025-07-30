# Docker 构建错误修复总结

## 问题描述

项目在 Docker 构建过程中遇到两个主要问题：

1. **Prisma OpenSSL 兼容性问题**：
   - 错误：`Error loading shared library libssl.so.1.1: No such file or directory`
   - 原因：Prisma 需要 OpenSSL 1.1.x，但较新的 Alpine 版本默认使用 OpenSSL 3.x

2. **Node.js API 路由中的 File 类型引用错误**：
   - 错误：`ReferenceError: File is not defined`
   - 原因：在 Node.js 服务器环境中，`File` 类型不是全局可用的

## 解决方案

### 1. Dockerfile 重构

#### 基础镜像更改
```dockerfile
# 从 Alpine 3.18 更改为 Alpine 3.15，提供稳定的 OpenSSL 支持
# 同时更新 Node.js 版本到 18.17 以满足 Next.js 要求
FROM node:18.17-alpine3.15 AS base
```

#### OpenSSL 兼容性包安装
在所有构建阶段添加标准 OpenSSL 包：

```dockerfile
# deps 阶段
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    vips-dev \
    build-base \
    python3 \
    make \
    g++

# builder 阶段
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    vips-dev \
    build-base \
    python3 \
    make \
    g++ \
    tiff-dev

# runner 阶段
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    vips \
    tiff
```

#### Prisma 二进制目标配置
更新 `prisma/schema.prisma` 添加正确的二进制目标：

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-musl", "linux-musl-openssl-3.0.x"]
}
```

#### 优化改进
- 移除了重复的 `apk add` 命令
- 使用标准 OpenSSL 包而非兼容性包，提供更好的稳定性
- 添加了 Prisma 二进制目标配置，支持 Alpine Linux musl 环境
- 简化了包安装逻辑

### 2. API 路由修复

#### 文件：`src/app/api/user/avatar/route.ts`

**问题**：使用了 `File` 类型和 `instanceof File` 检查

**修复前**：
```typescript
const file = formData.get('image') as File;

if (!file || !(file instanceof File)) {
  // 错误处理
}

const fileExtension = file.name.split('.').pop() || 'jpg';
```

**修复后**：
```typescript
const file = formData.get('image');

// 检查文件是否存在且具有必需的属性
if (!file || typeof file === 'string' || !file.type || !file.size || !file.arrayBuffer) {
  return NextResponse.json(
    { error: 'Validation Error', message: 'No image file provided' },
    { status: 400 }
  );
}

// 安全地获取文件扩展名
const fileExtension = (file.name && typeof file.name === 'string') 
  ? file.name.split('.').pop() || 'jpg'
  : 'jpg';
```

## 验证结果

### ✅ 本地构建测试
```bash
npm run build
```
- 状态：**成功**
- 结果：所有页面和 API 路由编译成功，无错误
- Node.js 版本：18.17，满足 Next.js >= 18.17.0 的要求

### 🔄 Docker 构建测试
由于当前环境未安装 Docker，需要手动验证：

```bash
# 构建镜像
docker build -t tiktokmoneycalculator .

# 运行容器
docker run -p 3000:3000 tiktokmoneycalculator
```

## 技术细节

### Alpine Linux 版本选择
- **Alpine 3.16**：提供稳定的 `openssl1.1-compat` 包支持
- **Alpine 3.17+**：开始移除 OpenSSL 1.1 支持，可能导致兼容性问题
- **Alpine 3.19+**：完全移除 `openssl1.1-compat` 包

### Prisma 兼容性
Prisma 的二进制引擎需要特定的 OpenSSL 版本：
- `libquery_engine-linux-musl.so.node` 依赖 `libssl.so.1.1`
- 通过安装 `openssl1.1-compat` 包提供向后兼容性

### FormData 文件处理
在 Node.js 环境中，`FormData.get()` 返回的文件对象：
- 不是标准的 `File` 类型
- 具有 `type`、`size`、`arrayBuffer()` 等方法
- `name` 属性可能不存在或为 undefined

## 最佳实践

1. **Docker 多阶段构建**：确保所有阶段都安装必要的依赖
2. **类型安全**：避免在服务器端代码中使用浏览器特定的类型
3. **错误处理**：对文件上传进行全面的验证和错误处理
4. **版本固定**：使用特定的 Alpine 版本以确保一致性

## 后续建议

1. **监控**：在生产环境中监控 Prisma 连接和文件上传功能
2. **测试**：添加针对文件上传 API 的集成测试
3. **文档**：更新部署文档，说明 Docker 构建要求
4. **升级路径**：考虑未来迁移到 Prisma 6.x 版本，以获得更好的 OpenSSL 3.x 支持