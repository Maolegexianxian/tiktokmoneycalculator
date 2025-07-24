"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Share2,
} from 'lucide-react';
import { useState } from 'react';

interface ChartDataPoint {
  date: string;
  earnings: number;
  calculations: number;
  platform: string;
}

interface EarningsChartProps {
  data?: ChartDataPoint[];
  onExport?: () => void;
  onShare?: () => void;
}

export function EarningsChart({ data, onExport, onShare }: EarningsChartProps) {
  const t = useTranslations('dashboard.earningsChart');
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('earnings');

  // Sample data if none provided
  const sampleData: ChartDataPoint[] = data || [
    { date: '2024-01-01', earnings: 1200, calculations: 3, platform: 'TikTok' },
    { date: '2024-01-02', earnings: 1800, calculations: 5, platform: 'Instagram' },
    { date: '2024-01-03', earnings: 2200, calculations: 4, platform: 'TikTok' },
    { date: '2024-01-04', earnings: 1600, calculations: 2, platform: 'YouTube' },
    { date: '2024-01-05', earnings: 2800, calculations: 6, platform: 'TikTok' },
    { date: '2024-01-06', earnings: 2400, calculations: 4, platform: 'Instagram' },
    { date: '2024-01-07', earnings: 3200, calculations: 8, platform: 'TikTok' },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTotalEarnings = () => {
    return sampleData.reduce((sum, item) => sum + item.earnings, 0);
  };

  const getTotalCalculations = () => {
    return sampleData.reduce((sum, item) => sum + item.calculations, 0);
  };

  const getAverageEarnings = () => {
    return getTotalEarnings() / sampleData.length;
  };

  const getGrowthRate = () => {
    if (sampleData.length < 2) return 0;
    const firstDay = sampleData[0]?.earnings || 0;
    const lastDay = sampleData[sampleData.length - 1]?.earnings || 0;
    if (firstDay === 0) return 0;
    return ((lastDay - firstDay) / firstDay) * 100;
  };

  const getPlatformBreakdown = () => {
    const breakdown = sampleData.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + item.earnings;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(breakdown).map(([platform, earnings]) => ({
      platform,
      earnings,
      percentage: (earnings / getTotalEarnings()) * 100,
    }));
  };

  const getMaxEarnings = () => {
    return Math.max(...sampleData.map(item => item.earnings));
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'TikTok': return 'bg-black';
      case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'YouTube': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const SimpleBarChart = ({ data }: { data: ChartDataPoint[] }) => {
    const maxValue = getMaxEarnings();
    
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-64 px-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <div className="relative w-full max-w-12 mx-auto">
                <div 
                  className="bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
                  style={{ 
                    height: `${(item.earnings / maxValue) * 200}px`,
                    minHeight: '4px'
                  }}
                  title={`${formatCurrency(item.earnings)} on ${formatDate(item.date)}`}
                ></div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                {formatDate(item.date)}
              </div>
              <div className="text-xs font-medium text-center">
                {formatCurrency(item.earnings)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PlatformPieChart = () => {
    const breakdown = getPlatformBreakdown();
    
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            {/* Simple pie chart representation */}
            <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
              {breakdown.map((item, index) => {
                const rotation = breakdown.slice(0, index).reduce((sum, prev) => sum + (prev.percentage * 3.6), 0);
                const angle = item.percentage * 3.6;
                
                return (
                  <div
                    key={item.platform}
                    className={`absolute inset-0 ${getPlatformColor(item.platform).replace('bg-', 'border-')} border-8`}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((rotation + angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation + angle - 90) * Math.PI / 180)}%)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {breakdown.map((item) => (
            <div key={item.platform} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getPlatformColor(item.platform)}`}></div>
                <span className="text-sm font-medium">{item.platform}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{formatCurrency(item.earnings)}</div>
                <div className="text-xs text-gray-600">{item.percentage.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{t('timeRange.7d')}</SelectItem>
                <SelectItem value="30d">{t('timeRange.30d')}</SelectItem>
                <SelectItem value="90d">{t('timeRange.90d')}</SelectItem>
                <SelectItem value="1y">{t('timeRange.1y')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              {t('export')}
            </Button>
            
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              {t('share')}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(getTotalEarnings())}
            </div>
            <div className="text-sm text-gray-600">{t('totalEarnings')}</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {getTotalCalculations()}
            </div>
            <div className="text-sm text-gray-600">{t('totalCalculations')}</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(getAverageEarnings())}
            </div>
            <div className="text-sm text-gray-600">{t('avgDaily')}</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              <div className="text-2xl font-bold text-gray-900">
                {getGrowthRate() > 0 ? '+' : ''}{getGrowthRate().toFixed(1)}%
              </div>
              {getGrowthRate() > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="text-sm text-gray-600">{t('growth')}</div>
          </div>
        </div>

        {/* Chart Tabs */}
        <Tabs value={chartType} onValueChange={setChartType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="earnings" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>{t('earningsChart')}</span>
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>{t('platformBreakdown')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="earnings" className="mt-6">
            <SimpleBarChart data={sampleData} />
          </TabsContent>
          
          <TabsContent value="platform" className="mt-6">
            <PlatformPieChart />
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">{t('insights.title')}</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>{t('insights.bestDay')}: {formatDate(sampleData.reduce((max, item) => item.earnings > max.earnings ? item : max).date)} ({formatCurrency(getMaxEarnings())})</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>{t('insights.topPlatform')}: {getPlatformBreakdown()[0]?.platform} ({getPlatformBreakdown()[0]?.percentage.toFixed(1)}% {t('insights.ofEarnings')})</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>{t('insights.avgPerCalculation')}: {formatCurrency(getTotalEarnings() / getTotalCalculations())}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}