import { TikTokCalculator, YouTubeCalculator, InstagramCalculator } from '../calculator';

describe('TikTokCalculator', () => {
  const calculator = new TikTokCalculator();

  describe('calculateEarnings', () => {
    it('should calculate earnings for basic input', () => {
      const input = {
        followers: 100000,
        avgViews: 50000,
        engagementRate: 5.0,
        profile: {
          contentNiche: 'entertainment',
          audienceLocation: 'US',
        },
      };

      const result = calculator.calculateEarnings(input);

      expect(result).toHaveProperty('monthlyEarnings');
      expect(result).toHaveProperty('yearlyEarnings');
      expect(result).toHaveProperty('breakdown');
      expect(result.monthlyEarnings).toBeGreaterThan(0);
      expect(result.yearlyEarnings).toBe(result.monthlyEarnings * 12);
    });

    it('should handle zero followers', () => {
      const input = {
        followers: 0,
        avgViews: 0,
        engagementRate: 0,
        profile: {
          contentNiche: 'entertainment',
          audienceLocation: 'US',
        },
      };

      const result = calculator.calculateEarnings(input);

      expect(result.monthlyEarnings).toBe(0);
      expect(result.yearlyEarnings).toBe(0);
    });

    it('should apply niche multipliers correctly', () => {
      const baseInput = {
        followers: 100000,
        avgViews: 50000,
        engagementRate: 5.0,
        profile: {
          contentNiche: 'entertainment',
          audienceLocation: 'US',
        },
      };

      const techInput = {
        ...baseInput,
        profile: {
          ...baseInput.profile,
          contentNiche: 'technology',
        },
      };

      const baseResult = calculator.calculateEarnings(baseInput);
      const techResult = calculator.calculateEarnings(techInput);

      // Technology niche typically has higher earning potential
      expect(techResult.monthlyEarnings).toBeGreaterThanOrEqual(baseResult.monthlyEarnings);
    });

    it('should apply location multipliers correctly', () => {
      const usInput = {
        followers: 100000,
        avgViews: 50000,
        engagementRate: 5.0,
        profile: {
          contentNiche: 'entertainment',
          audienceLocation: 'US',
        },
      };

      const inInput = {
        ...usInput,
        profile: {
          ...usInput.profile,
          audienceLocation: 'IN',
        },
      };

      const usResult = calculator.calculateEarnings(usInput);
      const inResult = calculator.calculateEarnings(inInput);

      // US typically has higher CPM rates
      expect(usResult.monthlyEarnings).toBeGreaterThan(inResult.monthlyEarnings);
    });
  });

  describe('validateInput', () => {
    it('should validate correct input', () => {
      const input = {
        followers: 100000,
        avgViews: 50000,
        engagementRate: 5.0,
        profile: {
          contentNiche: 'entertainment',
          audienceLocation: 'US',
        },
      };

      expect(() => calculator.validateInput(input)).not.toThrow();
    });

    it('should throw error for negative followers', () => {
      const input = {
        followers: -1000,
        avgViews: 50000,
        engagementRate: 5.0,
        profile: {
          contentNiche: 'entertainment',
          audienceLocation: 'US',
        },
      };

      expect(() => calculator.validateInput(input)).toThrow();
    });

    it('should throw error for invalid engagement rate', () => {
      const input = {
        followers: 100000,
        avgViews: 50000,
        engagementRate: 150, // Invalid: > 100%
        profile: {
          contentNiche: 'entertainment',
          audienceLocation: 'US',
        },
      };

      expect(() => calculator.validateInput(input)).toThrow();
    });
  });
});

describe('YouTubeCalculator', () => {
  const calculator = new YouTubeCalculator();

  describe('calculateEarnings', () => {
    it('should calculate earnings for basic input', () => {
      const input = {
        subscribers: 50000,
        avgViews: 25000,
        engagementRate: 4.0,
        profile: {
          contentNiche: 'education',
          audienceLocation: 'US',
        },
      };

      const result = calculator.calculateEarnings(input);

      expect(result).toHaveProperty('monthlyEarnings');
      expect(result).toHaveProperty('yearlyEarnings');
      expect(result).toHaveProperty('breakdown');
      expect(result.monthlyEarnings).toBeGreaterThan(0);
    });

    it('should handle monetization requirements', () => {
      const smallChannelInput = {
        subscribers: 500, // Below 1000 threshold
        avgViews: 100,
        engagementRate: 5.0,
        profile: {
          contentNiche: 'entertainment',
          audienceLocation: 'US',
        },
      };

      const result = calculator.calculateEarnings(smallChannelInput);

      // Should have very low or zero ad revenue due to monetization requirements
      expect(result.breakdown.adRevenue).toBeLessThan(100);
    });
  });
});

describe('InstagramCalculator', () => {
  const calculator = new InstagramCalculator();

  describe('calculateEarnings', () => {
    it('should calculate earnings for basic input', () => {
      const input = {
        followers: 75000,
        avgViews: 15000,
        engagementRate: 6.0,
        profile: {
          contentNiche: 'lifestyle',
          audienceLocation: 'US',
        },
      };

      const result = calculator.calculateEarnings(input);

      expect(result).toHaveProperty('monthlyEarnings');
      expect(result).toHaveProperty('yearlyEarnings');
      expect(result).toHaveProperty('breakdown');
      expect(result.monthlyEarnings).toBeGreaterThan(0);
    });

    it('should prioritize brand partnerships for lifestyle content', () => {
      const lifestyleInput = {
        followers: 100000,
        avgViews: 20000,
        engagementRate: 5.0,
        profile: {
          contentNiche: 'lifestyle',
          audienceLocation: 'US',
        },
      };

      const result = calculator.calculateEarnings(lifestyleInput);

      // Lifestyle content typically has high brand partnership potential
      expect(result.breakdown.brandPartnerships).toBeGreaterThan(0);
    });
  });
});
