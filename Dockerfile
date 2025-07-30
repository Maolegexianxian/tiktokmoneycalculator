# Use the official Node.js 18 image as base with Alpine 3.18 for OpenSSL 1.1 compatibility
FROM node:18-alpine3.18 AS base

# Install dependencies only when needed
FROM base AS deps
# Install essential dependencies for Sharp
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    libc6-compat \
    vips-dev \
    build-base \
    python3 \
    make \
    g++

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Set platform-specific environment variables for Sharp
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

RUN \
  if [ -f package-lock.json ]; then \
    npm ci --omit=dev --include=optional; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Generate Prisma client in deps stage
RUN npx prisma generate

# Rebuild the source code only when needed
FROM base AS builder

# Install build dependencies
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    libc6-compat \
    vips-dev \
    build-base \
    python3 \
    make \
    g++ \
    tiff-dev \
    openssl1.1-compat


WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for build)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Set platform-specific environment variables for Sharp
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Install all dependencies including dev dependencies for build
RUN npm ci --include=optional

# Copy source code
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Generate Prisma client
RUN npx prisma generate

# Rebuild Sharp for the current platform to ensure compatibility
RUN npm rebuild sharp

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

# Install runtime dependencies for Sharp and image processing
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
    libc6-compat \
    vips \
    tiff \
    openssl1.1-compat


WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV RUNTIME=true

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy Sharp module with correct platform binaries
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp

# Copy other critical native modules
COPY --from=builder /app/node_modules/@next ./node_modules/@next

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]
