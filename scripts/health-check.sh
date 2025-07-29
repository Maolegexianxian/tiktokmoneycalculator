#!/bin/bash

# Health Check Script for TikTok Money Calculator

set -e

BASE_URL=${1:-"http://localhost"}
TIMEOUT=${2:-10}

echo "🏥 Running health checks for $BASE_URL..."

# Function to check HTTP status
check_endpoint() {
    local endpoint=$1
    local expected_status=${2:-200}
    local description=$3
    
    echo -n "Checking $description... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$BASE_URL$endpoint" || echo "000")
    
    if [ "$status" = "$expected_status" ]; then
        echo "✅ OK ($status)"
        return 0
    else
        echo "❌ FAILED ($status)"
        return 1
    fi
}

# Function to check response content
check_content() {
    local endpoint=$1
    local expected_content=$2
    local description=$3
    
    echo -n "Checking $description... "
    
    response=$(curl -s --max-time $TIMEOUT "$BASE_URL$endpoint" || echo "")
    
    if echo "$response" | grep -q "$expected_content"; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        echo "Expected: $expected_content"
        echo "Got: $response"
        return 1
    fi
}

# Start health checks
failed=0

# Basic connectivity
check_endpoint "/" 200 "Main page" || ((failed++))

# API health endpoint
check_endpoint "/api/health" 200 "Health API" || ((failed++))

# API health content
check_content "/api/health" "healthy" "Health API content" || ((failed++))

# Calculator API (should return 405 for GET)
check_endpoint "/api/calculator" 405 "Calculator API" || ((failed++))

# Static assets
check_endpoint "/robots.txt" 200 "Robots.txt" || ((failed++))
check_endpoint "/sitemap.xml" 200 "Sitemap" || ((failed++))

# Performance check
echo -n "Checking response time... "
response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time $TIMEOUT "$BASE_URL/" || echo "999")
if (( $(echo "$response_time < 3.0" | bc -l) )); then
    echo "✅ OK (${response_time}s)"
else
    echo "⚠️  SLOW (${response_time}s)"
    ((failed++))
fi

# Summary
echo ""
if [ $failed -eq 0 ]; then
    echo "🎉 All health checks passed!"
    exit 0
else
    echo "❌ $failed health check(s) failed!"
    exit 1
fi
