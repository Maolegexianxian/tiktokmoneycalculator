# TikTok Money Calculator - Production Deployment Script (PowerShell)

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Check if required environment variables are set
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️  DATABASE_URL not set. Using default PostgreSQL configuration." -ForegroundColor Yellow
    $env:DATABASE_URL = "postgresql://postgres:defaultpassword@postgres:5432/tiktok_calculator"
}

if (-not $env:NEXTAUTH_URL) {
    Write-Host "⚠️  NEXTAUTH_URL not set. Please set this for production." -ForegroundColor Yellow
    $env:NEXTAUTH_URL = "http://localhost:3000"
}

if (-not $env:NEXTAUTH_SECRET) {
    Write-Host "⚠️  NEXTAUTH_SECRET not set. Generating a random secret." -ForegroundColor Yellow
    $env:NEXTAUTH_SECRET = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
}

# Clean up previous builds
Write-Host "🧹 Cleaning up previous builds..." -ForegroundColor Blue
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker system prune -f

# Build and start services
Write-Host "🔨 Building application..." -ForegroundColor Blue
docker-compose -f docker-compose.prod.yml build --no-cache

Write-Host "🚀 Starting services..." -ForegroundColor Blue
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check if services are running
$status = docker-compose -f docker-compose.prod.yml ps
if ($status -match "Up") {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Application is running at: http://localhost" -ForegroundColor Cyan
    Write-Host "📊 Health check: http://localhost/api/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Service status:" -ForegroundColor Blue
    docker-compose -f docker-compose.prod.yml ps
} else {
    Write-Host "❌ Deployment failed. Checking logs..." -ForegroundColor Red
    docker-compose -f docker-compose.prod.yml logs
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "💡 To view logs: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Cyan
Write-Host "🛑 To stop: docker-compose -f docker-compose.prod.yml down" -ForegroundColor Cyan
