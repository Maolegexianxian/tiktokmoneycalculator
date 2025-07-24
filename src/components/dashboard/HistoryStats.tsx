"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  Target,
  Award
} from 'lucide-react';

interface HistoryStatsProps {
  stats: {
    totalCalculations: number;
    avgMonthlyEarnings: number;
    maxMonthlyEarnings: number;
    totalFollowers: number;
    avgEngagementRate: number;
    topNiche: string;
    topLocation: string;
    calculationsThisMonth: number;
    calculationsLastMonth: number;
    earningsGrowth: number;
    mostUsedPlatform: string;
    lastCalculationDate: Date;
  };
}

export function HistoryStats({ stats }: HistoryStatsProps) {
  const t = useTranslations('history.stats');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 总计算次数 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('totalCalculations')}
          </CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalCalculations)}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {stats.calculationsThisMonth} {t('thisMonth')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 平均月收益 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('avgEarnings')}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.avgMonthlyEarnings)}</div>
          <div className="flex items-center gap-1 text-xs">
            {getGrowthIcon(stats.earningsGrowth)}
            <span className={getGrowthColor(stats.earningsGrowth)}>
              {stats.earningsGrowth > 0 ? '+' : ''}{formatPercentage(stats.earningsGrowth)} {t('fromLastMonth')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 最高月收益 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('maxEarnings')}
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.maxMonthlyEarnings)}</div>
          <div className="text-xs text-muted-foreground">
            {t('personalBest')}
          </div>
        </CardContent>
      </Card>

      {/* 平均互动率 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('avgEngagement')}
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercentage(stats.avgEngagementRate)}</div>
          <div className="text-xs text-muted-foreground">
            {stats.avgEngagementRate >= 4 ? t('excellent') : 
             stats.avgEngagementRate >= 2 ? t('good') : t('needsImprovement')}
          </div>
        </CardContent>
      </Card>

      {/* 总粉丝数 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('totalFollowers')}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalFollowers)}</div>
          <div className="text-xs text-muted-foreground">
            {t('acrossAllPlatforms')}
          </div>
        </CardContent>
      </Card>

      {/* 最常用平台 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('topPlatform')}
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{stats.mostUsedPlatform}</div>
          <div className="text-xs text-muted-foreground">
            {t('mostCalculations')}
          </div>
        </CardContent>
      </Card>

      {/* 热门细分领域 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('topNiche')}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {stats.topNiche}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {t('mostPopularCategory')}
          </div>
        </CardContent>
      </Card>

      {/* 主要地区 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('topLocation')}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {stats.topLocation}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {t('primaryAudience')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
