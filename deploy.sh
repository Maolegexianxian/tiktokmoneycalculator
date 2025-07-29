#!/bin/bash

# TikTok Money Calculator - Production Deployment Script

set -e

echo "🚀 Starting deployment process..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Using default PostgreSQL configuration."
    export DATABASE_URL="postgresql://postgres:defaultpassword@postgres:5432/tiktok_calculator"
fi

if [ -z "$NEXTAUTH_URL" ]; then
    echo "⚠️  NEXTAUTH_URL not set. Please set this for production."
    export NEXTAUTH_URL="http://localhost:3000"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "⚠️  NEXTAUTH_SECRET not set. Generating a random secret."
    export NEXTAUTH_SECRET=$(openssl rand -base64 32)
fi

# Clean up previous builds
echo "🧹 Cleaning up previous builds..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker system prune -f

# Build and start services
echo "🔨 Building application..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "🌐 Application is running at: http://localhost"
    echo "📊 Health check: http://localhost/api/health"
    echo ""
    echo "📋 Service status:"
    docker-compose -f docker-compose.prod.yml ps
else
    echo "❌ Deployment failed. Checking logs..."
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "💡 To view logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 To stop: docker-compose -f docker-compose.prod.yml down"
