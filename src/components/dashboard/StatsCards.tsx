"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  Eye,
  Heart,
  BarChart3,
  Target,
  Clock,
  Award,
} from 'lucide-react';

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ReactNode;
  description?: string;
  progress?: {
    value: number;
    max: number;
    label: string;
  };
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  color: string;
}

interface StatsCardsProps {
  userStats?: {
    totalCalculations: number;
    totalEarnings: number;
    avgEngagement: number;
    savedCalculations: number;
    monthlyCalculations: number;
    weeklyGrowth: number;
    topPlatform: string;
    accuracy: number;
  };
}

export function StatsCards({ userStats }: StatsCardsProps) {
  const t = useTranslations('dashboard.stats');

  // Default stats if no user stats provided
  const stats = userStats || {
    totalCalculations: 24,
    totalEarnings: 15420,
    avgEngagement: 4.2,
    savedCalculations: 8,
    monthlyCalculations: 12,
    weeklyGrowth: 15.3,
    topPlatform: 'TikTok',
    accuracy: 94.5,
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getChangeIcon = (type: 'increase' | 'decrease') => {
    return type === 'increase' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (type: 'increase' | 'decrease') => {
    return type === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  const statCards: StatCard[] = [
    {
      id: 'total-calculations',
      title: t('totalCalculations.title'),
      value: formatNumber(stats.totalCalculations),
      change: {
        value: 12,
        type: 'increase',
        period: t('thisMonth'),
      },
      icon: <Calculator className="h-6 w-6" />,
      description: t('totalCalculations.description'),
      color: 'text-blue-600',
      badge: {
        text: t('active'),
        variant: 'default',
      },
    },
    {
      id: 'total-earnings',
      title: t('totalEarnings.title'),
      value: formatCurrency(stats.totalEarnings),
      change: {
        value: stats.weeklyGrowth,
        type: 'increase',
        period: t('thisWeek'),
      },
      icon: <DollarSign className="h-6 w-6" />,
      description: t('totalEarnings.description'),
      color: 'text-green-600',
      progress: {
        value: stats.totalEarnings,
        max: 20000,
        label: t('monthlyGoal'),
      },
    },
    {
      id: 'avg-engagement',
      title: t('avgEngagement.title'),
      value: formatPercentage(stats.avgEngagement),
      change: {
        value: 0.8,
        type: 'increase',
        period: t('thisWeek'),
      },
      icon: <Heart className="h-6 w-6" />,
      description: t('avgEngagement.description'),
      color: 'text-pink-600',
      badge: {
        text: stats.avgEngagement > 3 ? t('excellent') : t('good'),
        variant: stats.avgEngagement > 3 ? 'default' : 'secondary',
      },
    },
    {
      id: 'saved-calculations',
      title: t('savedCalculations.title'),
      value: formatNumber(stats.savedCalculations),
      icon: <Star className="h-6 w-6" />,
      description: t('savedCalculations.description'),
      color: 'text-yellow-600',
    },
    {
      id: 'monthly-calculations',
      title: t('monthlyCalculations.title'),
      value: formatNumber(stats.monthlyCalculations),
      change: {
        value: 25,
        type: 'increase',
        period: t('vsLastMonth'),
      },
      icon: <BarChart3 className="h-6 w-6" />,
      description: t('monthlyCalculations.description'),
      color: 'text-purple-600',
      progress: {
        value: stats.monthlyCalculations,
        max: 30,
        label: t('monthlyTarget'),
      },
    },
    {
      id: 'accuracy',
      title: t('accuracy.title'),
      value: formatPercentage(stats.accuracy),
      icon: <Target className="h-6 w-6" />,
      description: t('accuracy.description'),
      color: 'text-indigo-600',
      badge: {
        text: stats.accuracy > 90 ? t('highAccuracy') : t('goodAccuracy'),
        variant: stats.accuracy > 90 ? 'default' : 'secondary',
      },
      progress: {
        value: stats.accuracy,
        max: 100,
        label: t('accuracyTarget'),
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.id} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 bg-gray-100 rounded-md ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.badge && (
                    <Badge variant={stat.badge.variant}>
                      {stat.badge.text}
                    </Badge>
                  )}
                </div>
                
                {stat.change && (
                  <div className="flex items-center space-x-2 text-sm">
                    {getChangeIcon(stat.change.type)}
                    <span className={getChangeColor(stat.change.type)}>
                      {stat.change.type === 'increase' ? '+' : '-'}{stat.change.value}%
                    </span>
                    <span className="text-gray-600">{stat.change.period}</span>
                  </div>
                )}
                
                {stat.progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{stat.progress.label}</span>
                      <span className="font-medium">
                        {typeof stat.value === 'string' ? stat.progress.value : stat.value}/{stat.progress.max}
                      </span>
                    </div>
                    <Progress 
                      value={(stat.progress.value / stat.progress.max) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
                
                {stat.description && (
                  <p className="text-xs text-gray-600">
                    {stat.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('platformBreakdown.title')}</CardTitle>
          <CardDescription>{t('platformBreakdown.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-sm font-medium">TikTok</span>
                </div>
                <Badge variant={stats.topPlatform === 'TikTok' ? 'default' : 'secondary'}>
                  {stats.topPlatform === 'TikTok' ? t('primary') : '45%'}
                </Badge>
              </div>
              <Progress value={65} className="h-2" />
              <div className="text-xs text-gray-600">
                {t('calculations')}: 16 • {t('avgEarnings')}: $8,200
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span className="text-sm font-medium">Instagram</span>
                </div>
                <Badge variant="secondary">30%</Badge>
              </div>
              <Progress value={30} className="h-2" />
              <div className="text-xs text-gray-600">
                {t('calculations')}: 6 • {t('avgEarnings')}: $4,800
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">YouTube</span>
                </div>
                <Badge variant="secondary">25%</Badge>
              </div>
              <Progress value={25} className="h-2" />
              <div className="text-xs text-gray-600">
                {t('calculations')}: 2 • {t('avgEarnings')}: $2,420
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Section */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t('achievements.title')}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                {t('achievements.description')}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white">
                  <Star className="h-3 w-3 mr-1" />
                  {t('achievements.firstCalculation')}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  <Users className="h-3 w-3 mr-1" />
                  {t('achievements.powerUser')}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {t('achievements.earlyAdopter')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}