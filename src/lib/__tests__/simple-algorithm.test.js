/**
 * 简单的算法验证测试（不依赖复杂设置）
 */

// 直接导入优化的计算器
const { OptimizedCalculator } = require('../optimized-calculator');

describe('优化算法验证', () => {
  const testInput = {
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

  test('基本计算功能', () => {
    const calculator = new OptimizedCalculator(testInput, 'tiktok');
    const result = calculator.calculate();

    // 基本验证
    expect(result.monthlyEarnings).toBeGreaterThan(0);
    expect(result.yearlyEarnings).toBe(result.monthlyEarnings * 12);
    expect(typeof result.monthlyEarnings).toBe('number');
    expect(typeof result.yearlyEarnings).toBe('number');
  });

  test('收益明细结构', () => {
    const calculator = new OptimizedCalculator(testInput, 'tiktok');
    const result = calculator.calculate();

    expect(result.breakdown).toBeDefined();
    expect(typeof result.breakdown).toBe('object');
    
    // TikTok应该有这些收益来源
    expect(result.breakdown.creatorFund).toBeDefined();
    expect(result.breakdown.brandPartnerships).toBeDefined();
    expect(result.breakdown.liveGifts).toBeDefined();
    expect(result.breakdown.affiliateMarketing).toBeDefined();
    expect(result.breakdown.merchandise).toBeDefined();
    expect(result.breakdown.other).toBeDefined();
  });

  test('粉丝数量影响', () => {
    const smallAccount = { ...testInput };
    smallAccount.metrics.followers = 10000;
    
    const largeAccount = { ...testInput };
    largeAccount.metrics.followers = 500000;

    const smallResult = new OptimizedCalculator(smallAccount, 'tiktok').calculate();
    const largeResult = new OptimizedCalculator(largeAccount, 'tiktok').calculate();

    expect(largeResult.monthlyEarnings).toBeGreaterThan(smallResult.monthlyEarnings);
  });

  test('互动率影响', () => {
    const lowEngagement = { ...testInput };
    lowEngagement.metrics.engagementRate = 1.5;
    
    const highEngagement = { ...testInput };
    highEngagement.metrics.engagementRate = 8.0;

    const lowResult = new OptimizedCalculator(lowEngagement, 'tiktok').calculate();
    const highResult = new OptimizedCalculator(highEngagement, 'tiktok').calculate();

    expect(highResult.monthlyEarnings).toBeGreaterThan(lowResult.monthlyEarnings);
  });

  test('细分领域影响', () => {
    const techNiche = { ...testInput };
    techNiche.profile.contentNiche = 'tech';
    
    const lifestyleNiche = { ...testInput };
    lifestyleNiche.profile.contentNiche = 'lifestyle';

    const techResult = new OptimizedCalculator(techNiche, 'tiktok').calculate();
    const lifestyleResult = new OptimizedCalculator(lifestyleNiche, 'tiktok').calculate();

    // Tech领域应该有更高的收益倍数
    expect(techResult.monthlyEarnings).toBeGreaterThan(lifestyleResult.monthlyEarnings);
  });

  test('地理位置影响', () => {
    const usLocation = { ...testInput };
    usLocation.profile.audienceLocation = 'us';
    
    const otherLocation = { ...testInput };
    otherLocation.profile.audienceLocation = 'other';

    const usResult = new OptimizedCalculator(usLocation, 'tiktok').calculate();
    const otherResult = new OptimizedCalculator(otherLocation, 'tiktok').calculate();

    // 美国市场应该有更高的收益
    expect(usResult.monthlyEarnings).toBeGreaterThan(otherResult.monthlyEarnings);
  });

  test('Instagram平台计算', () => {
    const instagramInput = { ...testInput };
    instagramInput.platform = 'instagram';
    
    const calculator = new OptimizedCalculator(instagramInput, 'instagram');
    const result = calculator.calculate();

    expect(result.monthlyEarnings).toBeGreaterThan(0);
    expect(result.breakdown).toBeDefined();
    expect(result.breakdown.creatorFund).toBeDefined();
    expect(result.breakdown.brandPartnerships).toBeDefined();
    expect(result.breakdown.affiliateMarketing).toBeDefined();
    expect(result.breakdown.merchandise).toBeDefined();
  });

  test('YouTube平台计算', () => {
    const youtubeInput = {
      platform: 'youtube',
      metrics: {
        subscribers: 100000,
        avgViews: 50000,
        engagementRate: 4.5,
      },
      profile: {
        contentNiche: 'education',
        audienceLocation: 'us',
        uploadFrequency: 3,
      },
    };
    
    const calculator = new OptimizedCalculator(youtubeInput, 'youtube');
    const result = calculator.calculate();

    expect(result.monthlyEarnings).toBeGreaterThan(0);
    expect(result.breakdown).toBeDefined();
    expect(result.breakdown.adRevenue).toBeDefined();
    expect(result.breakdown.brandPartnerships).toBeDefined();
    expect(result.breakdown.memberships).toBeDefined();
    expect(result.breakdown.superChat).toBeDefined();
    expect(result.breakdown.affiliateMarketing).toBeDefined();
  });

  test('边界值处理', () => {
    const minInput = {
      platform: 'tiktok',
      metrics: {
        followers: 100,
        avgViews: 50,
        engagementRate: 0.5,
      },
      profile: {
        contentNiche: 'other',
        audienceLocation: 'other',
        postFrequency: 1,
      },
    };

    const calculator = new OptimizedCalculator(minInput, 'tiktok');
    const result = calculator.calculate();

    expect(result.monthlyEarnings).toBeGreaterThanOrEqual(0);
    expect(result.monthlyEarnings).toBeLessThan(100); // 小账户收益应该很低
  });

  test('性能测试', () => {
    const startTime = Date.now();
    
    // 执行50次计算
    for (let i = 0; i < 50; i++) {
      const calculator = new OptimizedCalculator(testInput, 'tiktok');
      calculator.calculate();
    }
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    // 50次计算应该在500ms内完成
    expect(executionTime).toBeLessThan(500);
    
    console.log(`性能测试: 50次计算耗时 ${executionTime}ms`);
  });

  test('数据一致性', () => {
    const calculator = new OptimizedCalculator(testInput, 'tiktok');
    const result1 = calculator.calculate();
    const result2 = calculator.calculate();
    
    // 相同输入应该产生相同结果
    expect(result1.monthlyEarnings).toBe(result2.monthlyEarnings);
    expect(result1.yearlyEarnings).toBe(result2.yearlyEarnings);
  });

  test('收益明细总和验证', () => {
    const calculator = new OptimizedCalculator(testInput, 'tiktok');
    const result = calculator.calculate();
    
    const breakdownTotal = Object.values(result.breakdown)
      .reduce((sum, value) => sum + value, 0);
    
    // 允许小数点精度误差
    expect(Math.abs(breakdownTotal - result.monthlyEarnings)).toBeLessThan(0.01);
  });

  test('真实案例验证', () => {
    // 模拟真实的创作者数据
    const realCases = [
      {
        name: '微型科技创作者',
        input: {
          platform: 'tiktok',
          metrics: { followers: 15000, avgViews: 8000, engagementRate: 6.2 },
          profile: { contentNiche: 'tech', audienceLocation: 'us', postFrequency: 5 }
        },
        expectedMin: 200,
        expectedMax: 800
      },
      {
        name: '中型美妆创作者',
        input: {
          platform: 'instagram',
          metrics: { followers: 85000, avgViews: 35000, engagementRate: 4.1 },
          profile: { contentNiche: 'beauty', audienceLocation: 'uk', postFrequency: 6 }
        },
        expectedMin: 1500,
        expectedMax: 4000
      }
    ];

    realCases.forEach(({ name, input, expectedMin, expectedMax }) => {
      const calculator = new OptimizedCalculator(input, input.platform);
      const result = calculator.calculate();
      
      expect(result.monthlyEarnings).toBeGreaterThanOrEqual(expectedMin);
      expect(result.monthlyEarnings).toBeLessThanOrEqual(expectedMax);
      
      console.log(`${name}: $${result.monthlyEarnings.toFixed(2)}/月`);
    });
  });
});
