/**
 * 算法验证测试
 * 验证优化后算法的准确性和合理性
 */

import { calculateEarnings } from '../calculator';
import type { CalculatorInput } from '@/types';

describe('算法准确性验证', () => {
  // 真实案例测试数据
  const realWorldCases = [
    {
      name: 'Tech微型创作者',
      input: {
        platform: 'tiktok',
        metrics: {
          followers: 15000,
          avgViews: 8000,
          engagementRate: 6.2,
        },
        profile: {
          contentNiche: 'tech',
          audienceLocation: 'us',
          postFrequency: 5,
        },
      } as CalculatorInput,
      expectedRange: { min: 200, max: 800 }, // 预期月收入范围
    },
    {
      name: 'Beauty中型创作者',
      input: {
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
      } as CalculatorInput,
      expectedRange: { min: 1500, max: 4000 },
    },
    {
      name: 'Education大型创作者',
      input: {
        platform: 'youtube',
        metrics: {
          subscribers: 250000,
          avgViews: 120000,
          engagementRate: 3.8,
        },
        profile: {
          contentNiche: 'education',
          audienceLocation: 'ca',
          uploadFrequency: 4,
        },
      } as CalculatorInput,
      expectedRange: { min: 3000, max: 8000 },
    },
    {
      name: 'Lifestyle超大型创作者',
      input: {
        platform: 'tiktok',
        metrics: {
          followers: 1200000,
          avgViews: 800000,
          engagementRate: 4.5,
        },
        profile: {
          contentNiche: 'lifestyle',
          audienceLocation: 'us',
          postFrequency: 8,
        },
      } as CalculatorInput,
      expectedRange: { min: 15000, max: 40000 },
    },
  ];

  describe('真实案例验证', () => {
    realWorldCases.forEach(({ name, input, expectedRange }) => {
      it(`应该为${name}返回合理的收益预测`, () => {
        const result = calculateEarnings(input);
        
        expect(result.monthlyEarnings).toBeGreaterThanOrEqual(expectedRange.min);
        expect(result.monthlyEarnings).toBeLessThanOrEqual(expectedRange.max);
        
        // 验证数据结构完整性
        expect(result).toHaveProperty('monthlyEarnings');
        expect(result).toHaveProperty('yearlyEarnings');
        expect(result).toHaveProperty('breakdown');
        expect(result).toHaveProperty('factors');
        expect(result).toHaveProperty('tips');
        
        // 验证年收入计算正确
        expect(result.yearlyEarnings).toBe(result.monthlyEarnings * 12);
        
        console.log(`${name}: $${result.monthlyEarnings.toFixed(2)}/月`);
      });
    });
  });

  describe('算法一致性验证', () => {
    const baseInput: CalculatorInput = {
      platform: 'tiktok',
      metrics: {
        followers: 50000,
        avgViews: 25000,
        engagementRate: 4.0,
      },
      profile: {
        contentNiche: 'tech',
        audienceLocation: 'us',
        postFrequency: 5,
      },
    };

    it('相同输入应该产生相同结果', () => {
      const result1 = calculateEarnings(baseInput);
      const result2 = calculateEarnings(baseInput);
      
      expect(result1.monthlyEarnings).toBe(result2.monthlyEarnings);
      expect(result1.yearlyEarnings).toBe(result2.yearlyEarnings);
    });

    it('粉丝数量增加应该提高收益', () => {
      const smallAccount = { ...baseInput };
      smallAccount.metrics.followers = 10000;
      
      const largeAccount = { ...baseInput };
      largeAccount.metrics.followers = 100000;
      
      const smallResult = calculateEarnings(smallAccount);
      const largeResult = calculateEarnings(largeAccount);
      
      expect(largeResult.monthlyEarnings).toBeGreaterThan(smallResult.monthlyEarnings);
    });

    it('互动率提高应该增加收益', () => {
      const lowEngagement = { ...baseInput };
      lowEngagement.metrics.engagementRate = 2.0;
      
      const highEngagement = { ...baseInput };
      highEngagement.metrics.engagementRate = 8.0;
      
      const lowResult = calculateEarnings(lowEngagement);
      const highResult = calculateEarnings(highEngagement);
      
      expect(highResult.monthlyEarnings).toBeGreaterThan(lowResult.monthlyEarnings);
    });

    it('高价值细分领域应该有更高收益', () => {
      const techNiche = { ...baseInput };
      techNiche.profile.contentNiche = 'tech';
      
      const lifestyleNiche = { ...baseInput };
      lifestyleNiche.profile.contentNiche = 'lifestyle';
      
      const techResult = calculateEarnings(techNiche);
      const lifestyleResult = calculateEarnings(lifestyleNiche);
      
      expect(techResult.monthlyEarnings).toBeGreaterThan(lifestyleResult.monthlyEarnings);
    });

    it('高价值地区应该有更高收益', () => {
      const usMarket = { ...baseInput };
      usMarket.profile.audienceLocation = 'us';
      
      const otherMarket = { ...baseInput };
      otherMarket.profile.audienceLocation = 'other';
      
      const usResult = calculateEarnings(usMarket);
      const otherResult = calculateEarnings(otherMarket);
      
      expect(usResult.monthlyEarnings).toBeGreaterThan(otherResult.monthlyEarnings);
    });
  });

  describe('边界值测试', () => {
    it('应该处理最小值输入', () => {
      const minInput: CalculatorInput = {
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
      
      const result = calculateEarnings(minInput);
      
      expect(result.monthlyEarnings).toBeGreaterThanOrEqual(0);
      expect(result.monthlyEarnings).toBeLessThan(100); // 小账户收益应该很低
    });

    it('应该处理极大值输入', () => {
      const maxInput: CalculatorInput = {
        platform: 'tiktok',
        metrics: {
          followers: 50000000,
          avgViews: 25000000,
          engagementRate: 15.0,
        },
        profile: {
          contentNiche: 'tech',
          audienceLocation: 'us',
          postFrequency: 10,
        },
      };
      
      const result = calculateEarnings(maxInput);
      
      expect(result.monthlyEarnings).toBeGreaterThan(10000);
      expect(result.monthlyEarnings).toBeLessThan(1000000); // 设置合理上限
    });
  });

  describe('性能测试', () => {
    it('应该在合理时间内完成计算', () => {
      const testInput: CalculatorInput = {
        platform: 'tiktok',
        metrics: {
          followers: 100000,
          avgViews: 50000,
          engagementRate: 5.0,
        },
        profile: {
          contentNiche: 'tech',
          audienceLocation: 'us',
          postFrequency: 7,
        },
      };
      
      const startTime = Date.now();
      
      // 执行100次计算
      for (let i = 0; i < 100; i++) {
        calculateEarnings(testInput);
      }
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // 100次计算应该在500ms内完成
      expect(executionTime).toBeLessThan(500);
      
      console.log(`性能测试: 100次计算耗时 ${executionTime}ms`);
    });
  });

  describe('数据完整性验证', () => {
    const testInput: CalculatorInput = {
      platform: 'tiktok',
      metrics: {
        followers: 75000,
        avgViews: 40000,
        engagementRate: 4.5,
      },
      profile: {
        contentNiche: 'beauty',
        audienceLocation: 'uk',
        postFrequency: 6,
      },
    };

    it('收益明细应该加总到总收益', () => {
      const result = calculateEarnings(testInput);
      
      const breakdownTotal = Object.values(result.breakdown)
        .reduce((sum, value) => sum + value, 0);
      
      // 允许小数点精度误差
      expect(Math.abs(breakdownTotal - result.monthlyEarnings)).toBeLessThan(0.01);
    });

    it('应该返回有意义的建议', () => {
      const result = calculateEarnings(testInput);
      
      expect(Array.isArray(result.tips)).toBe(true);
      expect(result.tips.length).toBeGreaterThan(0);
      
      result.tips.forEach(tip => {
        expect(typeof tip).toBe('string');
        expect(tip.length).toBeGreaterThan(10); // 建议应该有实际内容
      });
    });

    it('影响因素应该有合理的评分', () => {
      const result = calculateEarnings(testInput);
      
      expect(result.factors).toHaveProperty('engagement');
      expect(result.factors).toHaveProperty('niche');
      expect(result.factors).toHaveProperty('location');
      expect(result.factors).toHaveProperty('consistency');
      expect(result.factors).toHaveProperty('quality');
      
      // 检查评分范围
      expect(result.factors.engagement.score).toBeGreaterThan(0);
      expect(result.factors.niche.multiplier).toBeGreaterThan(0);
      expect(result.factors.location.multiplier).toBeGreaterThan(0);
    });
  });
});
