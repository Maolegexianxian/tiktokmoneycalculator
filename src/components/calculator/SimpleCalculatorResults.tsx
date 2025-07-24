"use client";

import { useState } from 'react';
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

interface SimpleCalculatorResultsProps {
  results: CalculationResult;
  platform: string;
  onSave?: () => void;
  onDownload?: () => void;
}

export function SimpleCalculatorResults({ 
  results, 
  platform, 
  onSave, 
  onDownload 
}: SimpleCalculatorResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    monthlyEarnings,
    yearlyEarnings,
    perPostEarnings,
    perThousandViewsEarnings,
    breakdown,
    factors,
    tips,
  } = results;

  const getEarningsColor = (amount: number) => {
    if (amount >= 10000) return 'text-green-600';
    if (amount >= 5000) return 'text-blue-600';
    if (amount >= 1000) return 'text-yellow-600';
    return 'text-gray-600';
  };

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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getEarningsColor(monthlyEarnings)}`}>
                  {formatCurrency(monthlyEarnings)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Yearly Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getEarningsColor(yearlyEarnings)}`}>
                  {formatCurrency(yearlyEarnings)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Per Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getEarningsColor(perPostEarnings)}`}>
                  {formatCurrency(perPostEarnings)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Per 1K Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getEarningsColor(perThousandViewsEarnings)}`}>
                  {formatCurrency(perThousandViewsEarnings)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Earnings Breakdown Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(breakdown).map(([source, amount]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="capitalize">{source.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Factors Tab */}
        <TabsContent value="factors" className="space-y-6">
          <div className="grid gap-4">
            {Object.entries(factors).map(([factorName, factor]) => (
              <Card key={factorName}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">
                    {factorName.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span>Impact Level</span>
                    <Badge className={getImpactColor(factor.impact)}>
                      {factor.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Score</span>
                    <span className="font-semibold">
                      {'multiplier' in factor ? `${factor.multiplier}x` : factor.score}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {factor.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <Alert key={index}>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{tip}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
