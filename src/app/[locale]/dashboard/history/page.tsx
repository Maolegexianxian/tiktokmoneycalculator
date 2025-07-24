import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HistoryTable } from '@/components/dashboard/HistoryTable';
import { HistoryFilters } from '@/components/dashboard/HistoryFilters';
import { HistoryStats } from '@/components/dashboard/HistoryStats';
import { ExportHistory } from '@/components/dashboard/ExportHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Calendar,
  BarChart3,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { historyRepository } from '@/lib/db';
import { CONTENT_NICHES, AUDIENCE_LOCATIONS } from '@/lib/constants';

export const metadata: Metadata = {
  title: '计算历史',
  description: '查看和管理您的TikTok收益计算历史记录。',
};

interface HistoryPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    niche?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/dashboard/history');
  }
  
  const t = await getTranslations('history');
  
  // 解析查询参数
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '20');
  const search = searchParams.search || '';
  const niche = searchParams.niche || '';
  const location = searchParams.location || '';
  const dateFrom = searchParams.dateFrom || '';
  const dateTo = searchParams.dateTo || '';
  const sortBy = searchParams.sortBy || 'createdAt';
  const sortOrder = (searchParams.sortOrder || 'desc') as 'asc' | 'desc';
  
  // 构建过滤器
  const filters: any = {};
  if (search) filters.search = search;
  if (niche) filters.niche = niche;
  if (location) filters.location = location;
  if (dateFrom) filters.dateFrom = new Date(dateFrom);
  if (dateTo) filters.dateTo = new Date(dateTo);
  
  // 获取历史记录
  const historyData = await historyRepository.getHistory(session.user.id, {
    page,
    limit,
    sortBy,
    sortOrder,
    ...filters,
  });
  
  // 获取统计信息
  const stats = await historyRepository.getHistoryStats(session.user.id, filters);
  
  // 获取趋势数据（最近30天）
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const trendData = await historyRepository.getHistory(session.user.id, {
    dateFrom: thirtyDaysAgo,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'asc',
  });
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('description')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <ExportHistory userId={session.user.id} filters={filters} />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t('actions.filter')}
          </Button>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <HistoryStats stats={stats} />
      
      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 过滤器侧边栏 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t('filters.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HistoryFilters 
                currentFilters={{
                  search,
                  niche,
                  location,
                  dateFrom,
                  dateTo,
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* 历史记录表格 */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {t('table.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('table.showing', {
                      start: (page - 1) * limit + 1,
                      end: Math.min(page * limit, historyData.total),
                      total: historyData.total,
                    })}
                  </CardDescription>
                </div>
                
                {/* 搜索框 */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('search.placeholder')}
                      defaultValue={search}
                      className="pl-10 w-64"
                      name="search"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {historyData.data.length > 0 ? (
                <HistoryTable 
                  data={historyData.data}
                  pagination={{
                    page,
                    limit,
                    total: historyData.total,
                    totalPages: Math.ceil(historyData.total / limit),
                  }}
                  sorting={{
                    sortBy,
                    sortOrder,
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {search || niche || location || dateFrom || dateTo 
                      ? t('empty.noResults')
                      : t('empty.noHistory')
                    }
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {search || niche || location || dateFrom || dateTo 
                      ? t('empty.tryDifferentFilters')
                      : t('empty.startCalculating')
                    }
                  </p>
                  {!(search || niche || location || dateFrom || dateTo) && (
                    <Button asChild>
                      <a href="/#calculator">
                        {t('empty.goToCalculator')}
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 趋势分析 */}
      {trendData.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('trends.title')}
            </CardTitle>
            <CardDescription>
              {t('trends.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart" className="w-full">
              <TabsList>
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('trends.chart')}
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t('trends.insights')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="mt-6">
                {/* 这里可以添加图表组件 */}
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    {t('trends.chartPlaceholder')}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{t('insights.avgFollowers')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round(
                          trendData.data.reduce((sum, item) => sum + (item.input.metrics?.followers || item.input.metrics?.subscribers || 0), 0) / trendData.data.length
                        ).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{t('insights.avgEarnings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${
                          Math.round(
                            trendData.data.reduce((sum, item) => sum + (item.result?.monthlyEarnings || 0), 0) / trendData.data.length
                          ).toLocaleString()
                        }
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{t('insights.topNiche')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-semibold">
                        {(() => {
                          const nicheCounts = trendData.data.reduce((acc, item) => {
                            const niche = item.input.profile?.contentNiche || 'other';
                            acc[niche] = (acc[niche] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          
                          const topNiche = Object.entries(nicheCounts)
                            .sort(([,a], [,b]) => b - a)[0];
                          
                          return topNiche ? topNiche[0] : 'N/A';
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}