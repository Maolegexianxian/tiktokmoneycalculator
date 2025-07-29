/**
 * API测试脚本
 * 测试修复后的计算器API
 */

const testData = {
  platform: 'tiktok',
  metrics: {
    followers: 100000,
    avgViews: 50000,
    engagementRate: 5.2,
  },
  profile: {
    contentNiche: 'tech',
    audienceLocation: 'us',
    postFrequency: 7,
  },
};

async function testCalculatorAPI() {
  try {
    console.log('🧪 Testing Calculator API...');
    console.log('📊 Test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API test successful!');
      console.log('💰 Monthly earnings:', result.data.result.monthlyEarnings);
      console.log('📈 Yearly earnings:', result.data.result.yearlyEarnings);
      console.log('🔍 Request ID:', result.metadata.requestId);
      console.log('⏱️ Performance:', result.data.performance);
      console.log('📋 Full result:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ API test failed!');
      console.log('🚨 Error:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Test failed with exception:', error);
  }
}

async function testHealthCheck() {
  try {
    console.log('\n🏥 Testing Health Check...');
    
    const response = await fetch('http://localhost:3000/api/calculator?type=health');
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Health check passed!');
      console.log('📊 Status:', result.data.status);
      console.log('🔢 Version:', result.data.version);
      console.log('⏰ Uptime:', result.data.uptime, 'seconds');
    } else {
      console.log('❌ Health check failed!');
      console.log('🚨 Error:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Health check failed with exception:', error);
  }
}

async function testInvalidData() {
  try {
    console.log('\n🧪 Testing Invalid Data Handling...');
    
    const invalidData = {
      platform: 'invalid_platform',
      metrics: {
        followers: 'not_a_number',
        avgViews: -1000,
        engagementRate: 'invalid',
      },
      profile: {
        contentNiche: '',
        audienceLocation: null,
        postFrequency: 0,
      },
    };
    
    const response = await fetch('http://localhost:3000/api/calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData),
    });
    
    const result = await response.json();
    
    if (response.status === 400) {
      console.log('✅ Invalid data handling works correctly!');
      console.log('🚨 Error code:', result.error.code);
      console.log('📝 Error message:', result.error.message);
      console.log('🔍 Request ID:', result.error.requestId);
    } else {
      console.log('❌ Invalid data handling failed!');
      console.log('📊 Unexpected response:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Invalid data test failed with exception:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  await testCalculatorAPI();
  await testHealthCheck();
  await testInvalidData();
  
  console.log('\n🎉 All tests completed!');
}

// 运行测试
runAllTests();
