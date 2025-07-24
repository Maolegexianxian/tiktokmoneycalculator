"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  DollarSign,
  Users,
  Clock,
  Target,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';

interface UserStats {
  totalCalculations: number;
  totalEarnings: number;
  averageEngagement: number;
  savedCalculations: number;
  lastCalculation?: Date;
  growthRate: number;
  platformBreakdown: {
    tiktok: number;
    instagram: number;
    youtube: number;
  };
}

interface DashboardOverviewProps {
  userStats: UserStats;
}

export function DashboardOverview({ userStats }: DashboardOverviewProps) {
  const t = useTranslations('dashboard.overview');

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
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4" />;
    if (growth < 0) return <ArrowDownRight className="h-4 w-4" />;
    return null;
  };

  const totalPlatformCalculations = 
    userStats.platformBreakdown.tiktok + 
    userStats.platformBreakdown.instagram + 
    userStats.platformBreakdown.youtube;

  const platformPercentages = {
    tiktok: totalPlatformCalculations > 0 ? (userStats.platformBreakdown.tiktok / totalPlatformCalculations) * 100 : 0,
    instagram: totalPlatformCalculations > 0 ? (userStats.platformBreakdown.instagram / totalPlatformCalculations) * 100 : 0,
    youtube: totalPlatformCalculations > 0 ? (userStats.platformBreakdown.youtube / totalPlatformCalculations) * 100 : 0,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('welcome.title')}
            </h2>
            <p className="text-gray-600">
              {t('welcome.subtitle')}
            </p>
          </div>
          <div className="hidden sm:block">
            <Button asChild>
              <Link href="/#calculator">
                <Calculator className="h-4 w-4 mr-2" />
                {t('welcome.newCalculation')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Calculations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalCalculations')}
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(userStats.totalCalculations)}
            </div>
            <div className={`flex items-center text-xs ${getGrowthColor(userStats.growthRate)}`}>
              {getGrowthIcon(userStats.growthRate)}
              <span className="ml-1">
                {formatPercentage(Math.abs(userStats.growthRate))} {t('stats.fromLastMonth')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalEarnings')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(userStats.totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('stats.estimatedEarnings')}
            </p>
          </CardContent>
        </Card>

        {/* Average Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.avgEngagement')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(userStats.averageEngagement)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('stats.acrossAllPlatforms')}
            </p>
          </CardContent>
        </Card>

        {/* Saved Calculations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.savedCalculations')}
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(userStats.savedCalculations)}
            </div>
            <p className="text-xs text-muted-foreground">
              <Link href="/dashboard/saved" className="text-blue-600 hover:text-blue-500">
                {t('stats.viewSaved')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('platformBreakdown.title')}</CardTitle>
          <CardDescription>
            {t('platformBreakdown.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TikTok */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <span className="text-sm font-medium">TikTok</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {formatNumber(userStats.platformBreakdown.tiktok)}
                </span>
                <Badge variant="secondary">
                  {formatPercentage(platformPercentages.tiktok)}
                </Badge>
              </div>
            </div>
            <Progress value={platformPercentages.tiktok} className="h-2" />
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <span className="text-sm font-medium">Instagram</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {formatNumber(userStats.platformBreakdown.instagram)}
                </span>
                <Badge variant="secondary">
                  {formatPercentage(platformPercentages.instagram)}
                </Badge>
              </div>
            </div>
            <Progress value={platformPercentages.instagram} className="h-2" />
          </div>

          {/* YouTube */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">YouTube</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {formatNumber(userStats.platformBreakdown.youtube)}
                </span>
                <Badge variant="secondary">
                  {formatPercentage(platformPercentages.youtube)}
                </Badge>
              </div>
            </div>
            <Progress value={platformPercentages.youtube} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions.title')}</CardTitle>
          <CardDescription>
            {t('quickActions.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/#calculator" className="flex flex-col items-center space-y-2">
                <Calculator className="h-6 w-6" />
                <span className="text-sm font-medium">{t('quickActions.newCalculation')}</span>
                <span className="text-xs text-gray-500">{t('quickActions.newCalculationDesc')}</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/dashboard/history" className="flex flex-col items-center space-y-2">
                <Clock className="h-6 w-6" />
                <span className="text-sm font-medium">{t('quickActions.viewHistory')}</span>
                <span className="text-xs text-gray-500">{t('quickActions.viewHistoryDesc')}</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/dashboard/saved" className="flex flex-col items-center space-y-2">
                <Star className="h-6 w-6" />
                <span className="text-sm font-medium">{t('quickActions.savedCalculations')}</span>
                <span className="text-xs text-gray-500">{t('quickActions.savedCalculationsDesc')}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t('insights.title')}</CardTitle>
          <CardDescription>
            {t('insights.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStats.averageEngagement > 5 && (
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    {t('insights.highEngagement.title')}
                  </p>
                  <p className="text-sm text-green-700">
                    {t('insights.highEngagement.description')}
                  </p>
                </div>
              </div>
            )}
            
            {userStats.totalCalculations > 10 && (
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {t('insights.activeUser.title')}
                  </p>
                  <p className="text-sm text-blue-700">
                    {t('insights.activeUser.description')}
                  </p>
                </div>
              </div>
            )}
            
            {userStats.savedCalculations === 0 && (
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    {t('insights.saveCalculations.title')}
                  </p>
                  <p className="text-sm text-yellow-700">
                    {t('insights.saveCalculations.description')}
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