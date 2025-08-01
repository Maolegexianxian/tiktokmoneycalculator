"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Download,
  Save,
  Info,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { CalculationResult } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface CalculatorResultsProps {
  results: CalculationResult;
  platform: string;
  onSave?: () => void;
  onDownload?: () => void;
}

export function CalculatorResults({ results, platform, onSave, onDownload }: CalculatorResultsProps) {
  const t = useTranslations('calculator.results');
  const [activeTab, setActiveTab] = useState('overview');

  // 安全地解构results，提供默认值并处理NaN
  const safeNumber = (value: any): number => {
    const num = Number(value);
    return (typeof num === 'number' && !isNaN(num) && isFinite(num)) ? num : 0;
  };

  const {
    monthlyEarnings = 0,
    yearlyEarnings = 0,
    perPostEarnings = 0,
    perThousandViewsEarnings = 0,
    breakdown = {
      creatorFund: 0,
      liveGifts: 0,
      brandPartnerships: 0,
      affiliateMarketing: 0,
      merchandise: 0,
      other: 0,
    },
    factors = {
      engagement: { score: 0, impact: 'low' as const, description: '' },
      niche: { multiplier: 1, impact: 'medium' as const, description: '' },
      location: { multiplier: 1, impact: 'medium' as const, description: '' },
      consistency: { score: 0, impact: 'medium' as const, description: '' },
      quality: { score: 0, impact: 'medium' as const, description: '' },
    },
    tips = [],
  } = results;

  // 确保所有数值都是安全的
  const safeMonthlyEarnings = safeNumber(monthlyEarnings);
  const safeYearlyEarnings = safeNumber(yearlyEarnings);
  const safePerPostEarnings = safeNumber(perPostEarnings);
  const safePerThousandViewsEarnings = safeNumber(perThousandViewsEarnings);

  const getEarningsColor = (amount: number) => {
    if (amount >= 10000) return 'text-green-600';
    if (amount >= 5000) return 'text-blue-600';
    if (amount >= 1000) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getGrowthColor = (percentage: number) => {
    if (percentage >= 50) return 'bg-green-500';
    if (percentage >= 25) return 'bg-blue-500';
    if (percentage >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 安全地获取breakdown值，提供默认值并处理NaN
  const safeBreakdownValue = (key: keyof typeof breakdown): number => {
    const value = breakdown?.[key] ?? 0;
    return safeNumber(value);
  };

  // 根据平台获取收益项目标签
  const getBreakdownLabels = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return {
          creatorFund: 'Creator Fund',
          liveGifts: 'Live Gifts',
          brandPartnerships: 'Brand Partnerships',
          affiliateMarketing: 'Affiliate Marketing',
          merchandise: 'Merchandise',
          other: 'Other Revenue',
        };
      case 'instagram':
        return {
          creatorFund: 'Creator Fund',
          liveGifts: 'Reels Play Bonus',
          brandPartnerships: 'Brand Partnerships',
          affiliateMarketing: 'Affiliate Marketing',
          merchandise: 'Merchandise',
          other: 'Other Revenue',
        };
      case 'youtube':
        return {
          creatorFund: 'Ad Revenue',
          liveGifts: 'Memberships & Super Chat',
          brandPartnerships: 'Brand Partnerships',
          affiliateMarketing: 'Affiliate Marketing',
          merchandise: 'Merchandise',
          other: 'Other Revenue',
        };
      default:
        return {
          creatorFund: 'Platform Revenue',
          liveGifts: 'Interactive Revenue',
          brandPartnerships: 'Brand Partnerships',
          affiliateMarketing: 'Affiliate Marketing',
          merchandise: 'Merchandise',
          other: 'Other Revenue',
        };
    }
  };

  const labels = getBreakdownLabels(platform);

  const getPlatformIcon = () => {
    switch (platform) {
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📷';
      case 'youtube':
        return '📺';
      default:
        return '📱';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getPlatformIcon()}</span>
              <div>
                <CardTitle className="text-2xl">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)} Earnings Calculator
                </CardTitle>
                <CardDescription>
                  Generated on {new Date().toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {onSave && (
                <Button variant="outline" size="sm" onClick={onSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Results
                </Button>
              )}
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="factors">Factors</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Monthly Earnings
                    </p>
                    <p className={`text-2xl font-bold ${getEarningsColor(safeMonthlyEarnings)}`}>
                      {formatCurrency(safeMonthlyEarnings)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Yearly Earnings
                    </p>
                    <p className={`text-2xl font-bold ${getEarningsColor(safeYearlyEarnings)}`}>
                      {formatCurrency(safeYearlyEarnings)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Per Post Earnings
                    </p>
                    <p className={`text-2xl font-bold ${getEarningsColor(safePerPostEarnings)}`}>
                      {formatCurrency(safePerPostEarnings)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Per 1K Views
                    </p>
                    <p className={`text-2xl font-bold ${getEarningsColor(safePerThousandViewsEarnings)}`}>
                      {formatCurrency(safePerThousandViewsEarnings)}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Earnings Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Potential</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getEarningsColor(monthlyEarnings)}`}>
                      {formatCurrency(monthlyEarnings)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Yearly Potential</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getEarningsColor(yearlyEarnings)}`}>
                      {formatCurrency(yearlyEarnings)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Per Content Piece</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getEarningsColor(perPostEarnings)}`}>
                      {formatCurrency(perPostEarnings)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{labels.creatorFund}</span>
                  <span className="font-semibold">
                    {formatCurrency(safeBreakdownValue('creatorFund'))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">{labels.liveGifts}</span>
                  <span className="font-semibold">
                    {formatCurrency(safeBreakdownValue('liveGifts'))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">{labels.brandPartnerships}</span>
                  <span className="font-semibold">
                    {formatCurrency(safeBreakdownValue('brandPartnerships'))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">{labels.affiliateMarketing}</span>
                  <span className="font-semibold">
                    {formatCurrency(safeBreakdownValue('affiliateMarketing'))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">{labels.merchandise}</span>
                  <span className="font-semibold">
                    {formatCurrency(safeBreakdownValue('merchandise'))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">{labels.other}</span>
                  <span className="font-semibold">
                    {formatCurrency(safeBreakdownValue('other'))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Monthly Total</span>
                  <span className={getEarningsColor(monthlyEarnings)}>
                    {formatCurrency(monthlyEarnings)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Annual Projection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Annual Projections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Conservative (80%)</span>
                  <span className="font-semibold">
                    {formatCurrency(yearlyEarnings * 0.8)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Realistic (100%)</span>
                  <span className="font-semibold">
                    {formatCurrency(yearlyEarnings)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Optimistic (120%)</span>
                  <span className="font-semibold">
                    {formatCurrency(yearlyEarnings * 1.2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Expected Average</span>
                  <span className={getEarningsColor(yearlyEarnings)}>
                    {formatCurrency(yearlyEarnings)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Revenue Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {monthlyEarnings > 0 ? Math.round((safeBreakdownValue('brandPartnerships') / monthlyEarnings) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">{labels.brandPartnerships}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {monthlyEarnings > 0 ? Math.round((safeBreakdownValue('creatorFund') / monthlyEarnings) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">{labels.creatorFund}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {monthlyEarnings > 0 ? Math.round((safeBreakdownValue('affiliateMarketing') / monthlyEarnings) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">{labels.affiliateMarketing}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {monthlyEarnings > 0 ? Math.round((safeBreakdownValue('merchandise') / monthlyEarnings) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">{labels.merchandise}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {monthlyEarnings > 0 ? Math.round((safeBreakdownValue('liveGifts') / monthlyEarnings) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">{labels.liveGifts}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {monthlyEarnings > 0 ? Math.round((safeBreakdownValue('other') / monthlyEarnings) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">{labels.other}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Factors Tab */}
        <TabsContent value="factors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(factors || {}).map(([factorName, factor]) => {
              // 安全地处理factor对象，提供默认值
              const safeFactor = factor || {
                impact: 'medium',
                score: 0,
                multiplier: 1,
                description: 'No description available'
              };

              const getImpactColor = (impact: string) => {
                switch (impact) {
                  case 'high':
                    return 'bg-green-100 text-green-800 border-green-200';
                  case 'medium':
                    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                  case 'low':
                    return 'bg-red-100 text-red-800 border-red-200';
                  default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
                }
              };

              const getFactorIcon = (name: string) => {
                switch (name) {
                  case 'engagement':
                    return <Heart className="h-5 w-5" />;
                  case 'niche':
                    return <Target className="h-5 w-5" />;
                  case 'location':
                    return <Users className="h-5 w-5" />;
                  case 'consistency':
                    return <Calendar className="h-5 w-5" />;
                  case 'quality':
                    return <BarChart3 className="h-5 w-5" />;
                  default:
                    return <Info className="h-5 w-5" />;
                }
              };

              return (
                <Card key={factorName}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {getFactorIcon(factorName)}
                      {factorName.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Impact Level</span>
                      <Badge className={getImpactColor(safeFactor.impact)}>
                        {safeFactor.impact.charAt(0).toUpperCase() + safeFactor.impact.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Score/Multiplier</span>
                      <span className="font-semibold">
                        {'multiplier' in safeFactor ? `${safeFactor.multiplier}x` : safeFactor.score}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">
                        {safeFactor.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Optimization Tips & Recommendations
              </CardTitle>
              <CardDescription>
                Personalized suggestions to improve your earnings potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(tips || []).map((tip, index) => (
                  <Alert key={index} className="border-l-4 border-l-blue-500">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                      <span className="font-medium">Tip {index + 1}:</span> {tip}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Content Strategy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Post consistently during peak hours</li>
                    <li>• Use trending hashtags and sounds</li>
                    <li>• Engage with your audience regularly</li>
                    <li>• Collaborate with other creators</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Monetization</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Diversify revenue streams</li>
                    <li>• Build an email list</li>
                    <li>• Create premium content</li>
                    <li>• Develop your personal brand</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t('growth.recommendations.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(tips || []).map((tip, index) => (
                  <Alert key={index}>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium mb-1">Tip {index + 1}</p>
                          <p className="text-sm text-muted-foreground">{tip}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          High
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Growth Strategies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('growth.strategies.content.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {t('growth.strategies.content.consistency')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {t('growth.strategies.content.trending')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    {t('growth.strategies.content.engagement')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {t('growth.strategies.content.collaboration')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('growth.strategies.monetization.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {t('growth.strategies.monetization.diversify')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {t('growth.strategies.monetization.brandPartnerships')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    {t('growth.strategies.monetization.products')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {t('growth.strategies.monetization.courses')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {t('disclaimer')}
        </AlertDescription>
      </Alert>
    </div>
  );
}