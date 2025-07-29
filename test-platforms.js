/**
 * 多平台测试脚本
 * 测试TikTok、Instagram、YouTube的breakdown结构
 */

const platforms = [
  {
    name: 'TikTok',
    data: {
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
    },
  },
  {
    name: 'Instagram',
    data: {
      platform: 'instagram',
      metrics: {
        followers: 85000,
        avgViews: 35000,
        engagementRate: 4.1,
      },
      profile: {
        contentNiche: 'beauty',
        audienceLocation: 'uk',
        postFrequency: 6,
      },
    },
  },
  {
    name: 'YouTube',
    data: {
      platform: 'youtube',
      metrics: {
        subscribers: 50000,
        avgViews: 30000,
        engagementRate: 4.5,
      },
      profile: {
        contentNiche: 'education',
        audienceLocation: 'ca',
        uploadFrequency: 3,
      },
    },
  },
];

async function testPlatform(platform) {
  try {
    console.log(`\n🧪 Testing ${platform.name}...`);
    console.log('📊 Test data:', JSON.stringify(platform.data, null, 2));
    
    const response = await fetch('http://localhost:3000/api/calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(platform.data),
    });
    
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ ${platform.name} test successful!`);
      console.log('💰 Monthly earnings:', result.data.result.monthlyEarnings);
      console.log('📈 Breakdown structure:');
      
      const breakdown = result.data.result.breakdown;
      Object.entries(breakdown).forEach(([key, value]) => {
        console.log(`  - ${key}: $${value}`);
      });
      
      console.log('🔍 Request ID:', result.metadata.requestId);
      console.log('⏱️ Performance:', result.data.performance.totalTime + 'ms');
      
      // 验证breakdown结构完整性
      const requiredFields = ['creatorFund', 'liveGifts', 'brandPartnerships', 'affiliateMarketing', 'merchandise', 'other'];
      const missingFields = requiredFields.filter(field => !(field in breakdown));
      
      if (missingFields.length === 0) {
        console.log('✅ Breakdown structure is complete');
      } else {
        console.log('❌ Missing breakdown fields:', missingFields);
      }
      
      // 验证数值合理性
      const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
      const calculatedTotal = result.data.result.monthlyEarnings;
      const difference = Math.abs(total - calculatedTotal);
      
      if (difference < 0.01) {
        console.log('✅ Breakdown totals match monthly earnings');
      } else {
        console.log(`❌ Breakdown total mismatch: ${total} vs ${calculatedTotal} (diff: ${difference})`);
      }
      
    } else {
      const error = await response.json();
      console.log(`❌ ${platform.name} test failed!`);
      console.log('🚨 Error:', JSON.stringify(error, null, 2));
    }
    
  } catch (error) {
    console.error(`💥 ${platform.name} test failed with exception:`, error);
  }
}

async function runAllPlatformTests() {
  console.log('🚀 Starting Multi-Platform Tests...');
  
  for (const platform of platforms) {
    await testPlatform(platform);
  }
  
  console.log('\n🎉 All platform tests completed!');
}

// 运行测试
runAllPlatformTests();
