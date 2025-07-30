# Test Docker Build Script for TikTok Money Calculator

Write-Host "🧪 Testing Docker build for TikTok Money Calculator..." -ForegroundColor Green

# Check if Docker is available
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not available. Please install Docker first." -ForegroundColor Red
    exit 1
}

# Test enterprise Dockerfile
Write-Host "🔨 Testing enterprise Dockerfile build..." -ForegroundColor Blue

try {
    # Build with enterprise Dockerfile
    docker build -f Dockerfile.enterprise -t tiktok-calculator-test .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Enterprise Dockerfile build successful!" -ForegroundColor Green
        
        # Test the built image
        Write-Host "🧪 Testing the built image..." -ForegroundColor Blue
        
        # Run container in background
        $containerId = docker run -d -p 3001:3000 --name tiktok-test tiktok-calculator-test
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Container started successfully" -ForegroundColor Green
            Write-Host "Container ID: $containerId" -ForegroundColor Cyan
            
            # Wait for container to be ready
            Write-Host "⏳ Waiting for container to be ready..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
            
            # Test health endpoint
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 10
                if ($response.StatusCode -eq 200) {
                    Write-Host "✅ Health check passed!" -ForegroundColor Green
                } else {
                    Write-Host "⚠️ Health check returned status: $($response.StatusCode)" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "⚠️ Health check failed: $($_.Exception.Message)" -ForegroundColor Yellow
            }
            
            # Show container logs
            Write-Host "📋 Container logs:" -ForegroundColor Blue
            docker logs tiktok-test --tail 20
            
            # Cleanup
            Write-Host "🧹 Cleaning up test container..." -ForegroundColor Blue
            docker stop tiktok-test | Out-Null
            docker rm tiktok-test | Out-Null
            
        } else {
            Write-Host "❌ Failed to start container" -ForegroundColor Red
        }
        
        # Cleanup test image
        Write-Host "🧹 Cleaning up test image..." -ForegroundColor Blue
        docker rmi tiktok-calculator-test | Out-Null
        
    } else {
        Write-Host "❌ Enterprise Dockerfile build failed!" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Docker build test failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Docker build test completed!" -ForegroundColor Green
Write-Host "💡 To deploy: docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor Cyan
