"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  Zap,
  Globe,
} from 'lucide-react';
import { CalculationResult } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface PlatformComparisonProps {
  results: CalculationResult[];
  platforms?: string[];
}

interface PlatformMetrics {
  platform: string;
  icon: string;
  color: string;
  earnings: number;
  engagementRate: number;
  followers: number;
  avgViews: number;
  growthPotential: number;
  difficulty: number;
  timeToMonetize: number;
}

export function PlatformComparison({ results, platforms = ['tiktok'] }: PlatformComparisonProps) {
  const t = useTranslations('calculator.comparison');

  const getPlatformMetrics = (result: CalculationResult, platform: string): PlatformMetrics => {
    const platformConfig = {
      tiktok: { icon: '🎵', color: 'bg-black' },
      instagram: { icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
      youtube: { icon: '📺', color: 'bg-red-500' },
    };

    const config = platformConfig[platform as keyof typeof platformConfig] ||
                  { icon: '📱', color: 'bg-gray-500' };

    return {
      platform: platform,
      icon: config.icon,
      color: config.color,
      earnings: result.monthlyEarnings,
      engagementRate: result.factors.engagement.score,
      followers: 10000, // Default value since we don't have this in our result
      avgViews: 50000, // Default value since we don't have this in our result
      growthPotential: 25, // Default growth potential
      difficulty: getDifficultyScore(result),
      timeToMonetize: getTimeToMonetize(result),
    };
  };

  const getDifficultyScore = (result: CalculationResult): number => {
    // Calculate difficulty based on earnings potential
    const baseScore = 50;
    const earningsFactor = result.monthlyEarnings > 5000 ? -20 :
                          result.monthlyEarnings > 1000 ? -10 : 10;

    return Math.max(10, Math.min(100, baseScore + earningsFactor));
  };

  const getTimeToMonetize = (result: CalculationResult): number => {
    // Estimate time to monetization in months based on earnings
    if (result.monthlyEarnings >= 1000) return 1;
    if (result.monthlyEarnings >= 500) return 2;
    if (result.monthlyEarnings >= 100) return 3;
    return 6;
  };

  const platformMetrics = results.map((result, index) =>
    getPlatformMetrics(result, platforms[index] || 'tiktok')
  );
  const maxEarnings = Math.max(...platformMetrics.map(p => p.earnings));
  const maxFollowers = Math.max(...platformMetrics.map(p => p.followers));
  const maxViews = Math.max(...platformMetrics.map(p => p.avgViews));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return 'text-red-600';
    if (difficulty >= 50) return 'text-yellow-600';
    if (difficulty >= 30) return 'text-blue-600';
    return 'text-green-600';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty >= 70) return t('difficulty.hard');
    if (difficulty >= 50) return t('difficulty.medium');
    if (difficulty >= 30) return t('difficulty.easy');
    return t('difficulty.veryEasy');
  };

  if (platformMetrics.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t('noData')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            {t('title')}
          </CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {platformMetrics.map((platform, index) => (
          <Card key={platform.platform} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${platform.color}`}></div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <CardTitle className="capitalize">
                      {platform.platform}
                    </CardTitle>
                    <CardDescription>
                      {t('platforms.' + platform.platform + '.tagline')}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  #{index + 1}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Earnings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {t('metrics.monthlyEarnings')}
                  </span>
                  <span className="font-bold text-lg">
                    {formatCurrency(platform.earnings)}
                  </span>
                </div>
                <Progress 
                  value={(platform.earnings / maxEarnings) * 100} 
                  className="h-2"
                />
              </div>

              <Separator />

              {/* Engagement Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t('metrics.engagementRate')}
                  </span>
                  <Badge variant="secondary">
                    {platform.engagementRate.toFixed(2)}%
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(platform.engagementRate * 10, 100)} 
                  className="h-2"
                />
              </div>

              <Separator />

              {/* Followers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('metrics.followers')}
                  </span>
                  <span className="font-semibold">
                    {formatNumber(platform.followers)}
                  </span>
                </div>
                <Progress 
                  value={(platform.followers / maxFollowers) * 100} 
                  className="h-2"
                />
              </div>

              <Separator />

              {/* Average Views */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {t('metrics.avgViews')}
                  </span>
                  <span className="font-semibold">
                    {formatNumber(platform.avgViews)}
                  </span>
                </div>
                <Progress 
                  value={(platform.avgViews / maxViews) * 100} 
                  className="h-2"
                />
              </div>

              <Separator />

              {/* Growth Potential */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {t('metrics.growthPotential')}
                  </span>
                  <Badge className={getScoreColor(platform.growthPotential)}>
                    +{platform.growthPotential}%
                  </Badge>
                </div>
                <Progress 
                  value={platform.growthPotential} 
                  className="h-2"
                />
              </div>

              <Separator />

              {/* Difficulty */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('metrics.difficulty')}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={getDifficultyColor(platform.difficulty)}
                  >
                    {getDifficultyLabel(platform.difficulty)}
                  </Badge>
                </div>
                <Progress 
                  value={100 - platform.difficulty} 
                  className="h-2"
                />
              </div>

              <Separator />

              {/* Time to Monetize */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('metrics.timeToMonetize')}
                </span>
                <span className="font-semibold">
                  {platform.timeToMonetize} {t('months')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('summary.title')}</CardTitle>
          <CardDescription>
            {t('summary.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t('table.platform')}</th>
                  <th className="text-right p-2">{t('table.earnings')}</th>
                  <th className="text-right p-2">{t('table.engagement')}</th>
                  <th className="text-right p-2">{t('table.growth')}</th>
                  <th className="text-right p-2">{t('table.difficulty')}</th>
                  <th className="text-right p-2">{t('table.timeToMonetize')}</th>
                </tr>
              </thead>
              <tbody>
                {platformMetrics
                  .sort((a, b) => b.earnings - a.earnings)
                  .map((platform, index) => (
                  <tr key={platform.platform} className="border-b">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span>{platform.icon}</span>
                        <span className="font-medium capitalize">
                          {platform.platform}
                        </span>
                        {index === 0 && (
                          <Badge variant="default">
                            {t('table.best')}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="text-right p-2 font-semibold">
                      {formatCurrency(platform.earnings)}
                    </td>
                    <td className="text-right p-2">
                      {platform.engagementRate.toFixed(2)}%
                    </td>
                    <td className="text-right p-2">
                      <span className={getScoreColor(platform.growthPotential)}>
                        +{platform.growthPotential}%
                      </span>
                    </td>
                    <td className="text-right p-2">
                      <span className={getDifficultyColor(platform.difficulty)}>
                        {getDifficultyLabel(platform.difficulty)}
                      </span>
                    </td>
                    <td className="text-right p-2">
                      {platform.timeToMonetize} {t('months')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recommendations.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformMetrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">
                    {platformMetrics.reduce((best, current) => 
                      current.earnings > best.earnings ? current : best
                    ).icon}
                  </div>
                  <h4 className="font-semibold text-green-800">
                    {t('recommendations.highestEarnings')}
                  </h4>
                  <p className="text-sm text-green-600 capitalize">
                    {platformMetrics.reduce((best, current) => 
                      current.earnings > best.earnings ? current : best
                    ).platform}
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">
                    {platformMetrics.reduce((best, current) => 
                      current.growthPotential > best.growthPotential ? current : best
                    ).icon}
                  </div>
                  <h4 className="font-semibold text-blue-800">
                    {t('recommendations.bestGrowth')}
                  </h4>
                  <p className="text-sm text-blue-600 capitalize">
                    {platformMetrics.reduce((best, current) => 
                      current.growthPotential > best.growthPotential ? current : best
                    ).platform}
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-2">
                    {platformMetrics.reduce((best, current) => 
                      current.difficulty < best.difficulty ? current : best
                    ).icon}
                  </div>
                  <h4 className="font-semibold text-purple-800">
                    {t('recommendations.easiest')}
                  </h4>
                  <p className="text-sm text-purple-600 capitalize">
                    {platformMetrics.reduce((best, current) => 
                      current.difficulty < best.difficulty ? current : best
                    ).platform}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}