/**
 * 优化计算器测试
 * 验证2024年优化算法的准确性和性能
 */

import { OptimizedCalculator } from '../optimized-calculator';
import type { CalculatorInput } from '@/types';

describe('OptimizedCalculator', () => {
  // 测试数据
  const testInputTikTok: CalculatorInput = {
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

  const testInputInstagram: CalculatorInput = {
    platform: 'instagram',
    metrics: {
      followers: 75000,
      avgViews: 25000,
      engagementRate: 3.8,
    },
    profile: {
      contentNiche: 'beauty',
      audienceLocation: 'uk',
      postFrequency: 5,
    },
  };

  const testInputYouTube: CalculatorInput = {
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
  };

  describe('TikTok计算', () => {
    it('应该正确计算TikTok收益', () => {
      const calculator = new OptimizedCalculator(testInputTikTok, 'tiktok');
      const result = calculator.calculate();

      expect(result.monthlyEarnings).toBeGreaterThan(0);
      expect(result.yearlyEarnings).toBe(result.monthlyEarnings * 12);
      expect(result.breakdown).toHaveProperty('creatorFund');
      expect(result.breakdown).toHaveProperty('brandPartnerships');
      expect(result.breakdown).toHaveProperty('liveGifts');
      expect(result.breakdown).toHaveProperty('affiliateMarketing');
      expect(result.breakdown).toHaveProperty('merchandise');
      expect(result.breakdown).toHaveProperty('other');
    });

    it('应该基于粉丝数量调整收益', () => {
      const smallAccount = { ...testInputTikTok };
      smallAccount.metrics.followers = 5000;
      
      const largeAccount = { ...testInputTikTok };
      largeAccount.metrics.followers = 500000;

      const smallResult = new OptimizedCalculator(smallAccount, 'tiktok').calculate();
      const largeResult = new OptimizedCalculator(largeAccount, 'tiktok').calculate();

      expect(largeResult.monthlyEarnings).toBeGreaterThan(smallResult.monthlyEarnings);
    });

    it('应该基于互动率调整收益', () => {
      const lowEngagement = { ...testInputTikTok };
      lowEngagement.metrics.engagementRate = 1.5;
      
      const highEngagement = { ...testInputTikTok };
      highEngagement.metrics.engagementRate = 8.0;

      const lowResult = new OptimizedCalculator(lowEngagement, 'tiktok').calculate();
      const highResult = new OptimizedCalculator(highEngagement, 'tiktok').calculate();

      expect(highResult.monthlyEarnings).toBeGreaterThan(lowResult.monthlyEarnings);
    });

    it('应该基于细分领域调整收益', () => {
      const techNiche = { ...testInputTikTok };
      techNiche.profile.contentNiche = 'tech';
      
      const lifestyleNiche = { ...testInputTikTok };
      lifestyleNiche.profile.contentNiche = 'lifestyle';

      const techResult = new OptimizedCalculator(techNiche, 'tiktok').calculate();
      const lifestyleResult = new OptimizedCalculator(lifestyleNiche, 'tiktok').calculate();

      // Tech领域应该有更高的收益倍数
      expect(techResult.monthlyEarnings).toBeGreaterThan(lifestyleResult.monthlyEarnings);
    });

    it('应该基于地理位置调整收益', () => {
      const usLocation = { ...testInputTikTok };
      usLocation.profile.audienceLocation = 'us';
      
      const otherLocation = { ...testInputTikTok };
      otherLocation.profile.audienceLocation = 'other';

      const usResult = new OptimizedCalculator(usLocation, 'tiktok').calculate();
      const otherResult = new OptimizedCalculator(otherLocation, 'tiktok').calculate();

      // 美国市场应该有更高的收益
      expect(usResult.monthlyEarnings).toBeGreaterThan(otherResult.monthlyEarnings);
    });
  });

  describe('Instagram计算', () => {
    it('应该正确计算Instagram收益', () => {
      const calculator = new OptimizedCalculator(testInputInstagram, 'instagram');
      const result = calculator.calculate();

      expect(result.monthlyEarnings).toBeGreaterThan(0);
      expect(result.breakdown).toHaveProperty('creatorFund');
      expect(result.breakdown).toHaveProperty('brandPartnerships');
      expect(result.breakdown).toHaveProperty('affiliateMarketing');
      expect(result.breakdown).toHaveProperty('merchandise');
    });

    it('Instagram收益应该与TikTok不同', () => {
      const tiktokResult = new OptimizedCalculator(testInputTikTok, 'tiktok').calculate();
      
      const instagramInput = { ...testInputTikTok };
      instagramInput.platform = 'instagram';
      const instagramResult = new OptimizedCalculator(instagramInput, 'instagram').calculate();

      // 不同平台应该有不同的收益结构
      expect(instagramResult.monthlyEarnings).not.toBe(tiktokResult.monthlyEarnings);
    });
  });

  describe('YouTube计算', () => {
    it('应该正确计算YouTube收益', () => {
      const calculator = new OptimizedCalculator(testInputYouTube, 'youtube');
      const result = calculator.calculate();

      expect(result.monthlyEarnings).toBeGreaterThan(0);
      expect(result.breakdown).toHaveProperty('adRevenue');
      expect(result.breakdown).toHaveProperty('brandPartnerships');
      expect(result.breakdown).toHaveProperty('memberships');
      expect(result.breakdown).toHaveProperty('superChat');
      expect(result.breakdown).toHaveProperty('affiliateMarketing');
    });
  });

  describe('性能测试', () => {
    it('应该在合理时间内完成计算', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const calculator = new OptimizedCalculator(testInputTikTok, 'tiktok');
        calculator.calculate();
      }
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // 100次计算应该在1秒内完成
      expect(executionTime).toBeLessThan(1000);
    });
  });

  describe('边界值测试', () => {
    it('应该处理最小值输入', () => {
      const minInput: CalculatorInput = {
        platform: 'tiktok',
        metrics: {
          followers: 100,
          avgViews: 100,
          engagementRate: 0.1,
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
      expect(result.yearlyEarnings).toBeGreaterThanOrEqual(0);
    });

    it('应该处理最大值输入', () => {
      const maxInput: CalculatorInput = {
        platform: 'tiktok',
        metrics: {
          followers: 100000000,
          avgViews: 50000000,
          engagementRate: 20.0,
        },
        profile: {
          contentNiche: 'tech',
          audienceLocation: 'us',
          postFrequency: 50,
        },
      };

      const calculator = new OptimizedCalculator(maxInput, 'tiktok');
      const result = calculator.calculate();

      expect(result.monthlyEarnings).toBeGreaterThan(0);
      expect(result.monthlyEarnings).toBeLessThan(10000000); // 合理上限
    });
  });

  describe('数据验证', () => {
    it('应该返回正确的数据结构', () => {
      const calculator = new OptimizedCalculator(testInputTikTok, 'tiktok');
      const result = calculator.calculate();

      expect(result).toHaveProperty('monthlyEarnings');
      expect(result).toHaveProperty('yearlyEarnings');
      expect(result).toHaveProperty('perPostEarnings');
      expect(result).toHaveProperty('perThousandViewsEarnings');
      expect(result).toHaveProperty('breakdown');
      expect(result).toHaveProperty('factors');
      expect(result).toHaveProperty('tips');

      expect(typeof result.monthlyEarnings).toBe('number');
      expect(typeof result.yearlyEarnings).toBe('number');
      expect(Array.isArray(result.tips)).toBe(true);
    });

    it('应该返回合理的数值', () => {
      const calculator = new OptimizedCalculator(testInputTikTok, 'tiktok');
      const result = calculator.calculate();

      // 检查数值的合理性
      expect(result.monthlyEarnings).toBeGreaterThan(0);
      expect(result.yearlyEarnings).toBe(result.monthlyEarnings * 12);
      expect(result.perPostEarnings).toBeGreaterThan(0);
      
      // 检查收益明细总和
      const breakdownTotal = Object.values(result.breakdown).reduce((sum, val) => sum + val, 0);
      expect(Math.abs(breakdownTotal - result.monthlyEarnings)).toBeLessThan(0.01); // 允许小数点误差
    });
  });
});
