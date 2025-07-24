"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bookmark, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  Target,
  Award
} from 'lucide-react';

interface SavedStatsProps {
  stats: {
    totalSaved: number;
    avgMonthlyEarnings: number;
    maxMonthlyEarnings: number;
    totalFollowers: number;
    avgEngagementRate: number;
    topNiche: string;
    topLocation: string;
    savedThisMonth: number;
    savedLastMonth: number;
    earningsGrowth: number;
    mostUsedPlatform: string;
    lastSavedDate: Date;
  };
}

export function SavedStats({ stats }: SavedStatsProps) {
  const t = useTranslations('dashboard.saved.stats');

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
      {/* Total Saved */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('totalSaved')}
          </CardTitle>
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalSaved)}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {stats.savedThisMonth} {t('thisMonth')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Average Earnings */}
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

      {/* Max Earnings */}
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
            {t('bestCalculation')}
          </div>
        </CardContent>
      </Card>

      {/* Average Engagement */}
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

      {/* Total Followers */}
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
            {t('acrossAllCalculations')}
          </div>
        </CardContent>
      </Card>

      {/* Top Platform */}
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

      {/* Top Niche */}
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

      {/* Top Location */}
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
