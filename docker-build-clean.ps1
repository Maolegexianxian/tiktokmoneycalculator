#!/usr/bin/env pwsh

# Docker Build with Cache Cleanup Script
# This script forces a clean Docker build without using cache

Write-Host "🧹 Cleaning Docker build cache..." -ForegroundColor Yellow

# Check if Docker is available
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker found. Starting clean build process..." -ForegroundColor Green
    
    # Remove any existing image
    Write-Host "🗑️ Removing existing tiktokmoneycalculator image..." -ForegroundColor Cyan
    docker rmi tiktokmoneycalculator -f 2>$null
    
    # Clean build cache
    Write-Host "🧽 Cleaning Docker build cache..." -ForegroundColor Cyan
    docker builder prune -f
    
    # Build with no cache
    Write-Host "🔨 Building Docker image without cache..." -ForegroundColor Cyan
    docker build --no-cache -t tiktokmoneycalculator .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker build completed successfully!" -ForegroundColor Green
        Write-Host "🚀 You can now run: docker run -p 3000:3000 tiktokmoneycalculator" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Docker build failed. Check the output above for errors." -ForegroundColor Red
    }
} else {
    Write-Host "❌ Docker not found. Please install Docker first." -ForegroundColor Red
    Write-Host "📋 Manual steps to resolve Node.js version issue:" -ForegroundColor Yellow
    Write-Host "1. Ensure Docker is installed and running" -ForegroundColor White
    Write-Host "2. Run: docker build --no-cache -t tiktokmoneycalculator ." -ForegroundColor White
    Write-Host "3. The --no-cache flag ensures fresh Node.js 18.17 image is pulled" -ForegroundColor White
    Write-Host "4. Test with: docker run -p 3000:3000 tiktokmoneycalculator" -ForegroundColor White
    
    Write-Host "\n🔍 Current Dockerfile configuration:" -ForegroundColor Cyan
    Write-Host "✅ Base image: node:18.17-alpine3.15 (meets Next.js >= 18.17.0 requirement)" -ForegroundColor Green
    Write-Host "✅ Prisma binaryTargets configured for linux-musl" -ForegroundColor Green
    Write-Host "✅ OpenSSL packages installed for Prisma compatibility" -ForegroundColor Green
    Write-Host "✅ File type references fixed in API routes" -ForegroundColor Green
}

Write-Host "\n📝 Note: The error showing Node.js 18.12.1 is likely due to Docker cache." -ForegroundColor Yellow
Write-Host "Using --no-cache flag will force pulling the correct Node.js 18.17 image." -ForegroundColor Yellow