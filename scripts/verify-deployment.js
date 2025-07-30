#!/usr/bin/env node

/**
 * 部署验证脚本
 * 验证应用是否正确部署并运行
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.DEPLOYMENT_URL || 'http://localhost:3000';
const TIMEOUT = 10000; // 10 seconds

console.log('🔍 Verifying deployment...');
console.log(`📍 Target URL: ${BASE_URL}`);

// 测试端点列表
const endpoints = [
  { path: '/api/health', method: 'GET', expectedStatus: 200 },
  { path: '/api/calculator', method: 'GET', expectedStatus: 200 },
  { path: '/', method: 'GET', expectedStatus: 200 },
  { path: '/robots.txt', method: 'GET', expectedStatus: 200 },
];

// HTTP请求函数
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Deployment-Verifier/1.0'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// 验证单个端点
async function verifyEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`;
  
  try {
    console.log(`  Testing ${endpoint.method} ${endpoint.path}...`);
    
    const response = await makeRequest(url, endpoint.method);
    
    if (response.statusCode === endpoint.expectedStatus) {
      console.log(`  ✅ ${endpoint.path} - OK (${response.statusCode})`);
      return true;
    } else {
      console.log(`  ❌ ${endpoint.path} - Expected ${endpoint.expectedStatus}, got ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ ${endpoint.path} - Error: ${error.message}`);
    return false;
  }
}

// 验证健康检查
async function verifyHealth() {
  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);
    
    if (response.statusCode === 200) {
      try {
        const health = JSON.parse(response.data);
        console.log('📊 Health Check Details:');
        console.log(`  Status: ${health.status || 'unknown'}`);
        console.log(`  Timestamp: ${health.timestamp || 'unknown'}`);
        console.log(`  Uptime: ${health.uptime || 'unknown'}`);
        return true;
      } catch (parseError) {
        console.log('⚠️  Health endpoint responded but data is not JSON');
        return true; // Still consider it working
      }
    }
    return false;
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    return false;
  }
}

// 性能测试
async function performanceTest() {
  console.log('⚡ Running performance test...');
  
  const start = Date.now();
  try {
    await makeRequest(`${BASE_URL}/`);
    const duration = Date.now() - start;
    
    console.log(`  Response time: ${duration}ms`);
    
    if (duration < 3000) {
      console.log('  ✅ Performance: Good');
      return true;
    } else if (duration < 5000) {
      console.log('  ⚠️  Performance: Acceptable');
      return true;
    } else {
      console.log('  ❌ Performance: Slow');
      return false;
    }
  } catch (error) {
    console.log(`  ❌ Performance test failed: ${error.message}`);
    return false;
  }
}

// 主验证函数
async function main() {
  console.log('🚀 Starting deployment verification...\n');
  
  let passed = 0;
  let total = 0;
  
  // 验证基本端点
  console.log('📋 Testing endpoints:');
  for (const endpoint of endpoints) {
    total++;
    if (await verifyEndpoint(endpoint)) {
      passed++;
    }
  }
  
  console.log('');
  
  // 详细健康检查
  console.log('🏥 Detailed health check:');
  total++;
  if (await verifyHealth()) {
    passed++;
  }
  
  console.log('');
  
  // 性能测试
  total++;
  if (await performanceTest()) {
    passed++;
  }
  
  console.log('');
  console.log('📊 Verification Summary:');
  console.log(`  Passed: ${passed}/${total} tests`);
  console.log(`  Success Rate: ${Math.round((passed / total) * 100)}%`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Deployment is healthy.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please check the deployment.');
    process.exit(1);
  }
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});

// 运行验证
main().catch((error) => {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
});
