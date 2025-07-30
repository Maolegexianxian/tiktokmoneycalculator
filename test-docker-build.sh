#!/bin/bash

# Test Docker Build Script for TikTok Money Calculator

set -e

echo "🧪 Testing Docker build for TikTok Money Calculator..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not available. Please install Docker first."
    exit 1
fi

echo "✅ Docker is available"

# Test enterprise Dockerfile
echo "🔨 Testing enterprise Dockerfile build..."

# Build with enterprise Dockerfile
if docker build -f Dockerfile.enterprise -t tiktok-calculator-test .; then
    echo "✅ Enterprise Dockerfile build successful!"
    
    # Test the built image
    echo "🧪 Testing the built image..."
    
    # Run container in background
    container_id=$(docker run -d -p 3001:3000 --name tiktok-test tiktok-calculator-test)
    
    if [ $? -eq 0 ]; then
        echo "✅ Container started successfully"
        echo "Container ID: $container_id"
        
        # Wait for container to be ready
        echo "⏳ Waiting for container to be ready..."
        sleep 10
        
        # Test health endpoint
        if curl -f http://localhost:3001/api/health --max-time 10 > /dev/null 2>&1; then
            echo "✅ Health check passed!"
        else
            echo "⚠️ Health check failed"
        fi
        
        # Show container logs
        echo "📋 Container logs:"
        docker logs tiktok-test --tail 20
        
        # Cleanup
        echo "🧹 Cleaning up test container..."
        docker stop tiktok-test > /dev/null
        docker rm tiktok-test > /dev/null
        
    else
        echo "❌ Failed to start container"
        exit 1
    fi
    
    # Cleanup test image
    echo "🧹 Cleaning up test image..."
    docker rmi tiktok-calculator-test > /dev/null
    
else
    echo "❌ Enterprise Dockerfile build failed!"
    exit 1
fi

echo ""
echo "🎉 Docker build test completed!"
echo "💡 To deploy: docker-compose -f docker-compose.prod.yml up -d"
