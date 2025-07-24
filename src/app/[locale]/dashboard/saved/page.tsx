import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SavedCalculationsGrid } from '@/components/dashboard/SavedCalculationsGrid';
import { SavedCalculationsTable } from '@/components/dashboard/SavedCalculationsTable';
import { SavedFilters } from '@/components/dashboard/SavedFilters';
import { SavedStats } from '@/components/dashboard/SavedStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Star, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download, 
  Trash2, 
  Plus,
  Calculator,
  Heart,
  Bookmark,
  Share2
} from 'lucide-react';
import { savedCalculationRepository } from '@/lib/db';
import { formatCurrency, formatNumber } from '@/lib/utils';

export const metadata: Metadata = {
  title: '保存的计算',
  description: '查看和管理您保存的TikTok收益计算结果。',
};

interface SavedPageProps {
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
    view?: string;
  };
}

export default async function SavedPage({ searchParams }: SavedPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/dashboard/saved');
  }
  
  const t = await getTranslations('saved');
  
  // 解析查询参数
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '12');
  const search = searchParams.search || '';
  const niche = searchParams.niche || '';
  const location = searchParams.location || '';
  const dateFrom = searchParams.dateFrom || '';
  const dateTo = searchParams.dateTo || '';
  const sortBy = searchParams.sortBy || 'createdAt';
  const sortOrder = (searchParams.sortOrder || 'desc') as 'asc' | 'desc';
  const view = searchParams.view || 'grid';
  
  // 构建过滤器
  const filters: any = {};
  if (search) filters.search = search;
  if (niche) filters.niche = niche;
  if (location) filters.location = location;
  if (dateFrom) filters.dateFrom = new Date(dateFrom);
  if (dateTo) filters.dateTo = new Date(dateTo);
  
  // 获取保存的计算
  const savedData = await savedCalculationRepository.findByUserId(session.user.id, limit);
  
  // 获取统计信息 - 使用默认统计数据
  const stats = {
    totalSaved: savedData.length,
    avgMonthlyEarnings: 0,
    maxMonthlyEarnings: 0,
    totalFollowers: 0,
    avgEngagementRate: 0,
    topNiche: 'lifestyle',
    topLocation: 'us',
    savedThisMonth: 0,
    savedLastMonth: 0,
    earningsGrowth: 0,
    mostUsedPlatform: 'tiktok',
    lastSavedDate: new Date()
  };
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Star className="h-8 w-8" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('description')}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">
              {savedData.length} / 50 {t('saved')}
            </Badge>
            {savedData.length >= 45 && (
              <Badge variant="destructive">
                {t('nearLimit')}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild>
            <a href="/#calculator">
              <Plus className="h-4 w-4 mr-2" />
              {t('actions.newCalculation')}
            </a>
          </Button>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <SavedStats stats={stats} />
      
      {/* 搜索和过滤器 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('search.title')}
              </CardTitle>
              <CardDescription>
                {t('search.description')}
              </CardDescription>
            </div>
            
            {/* 视图切换 */}
            <ToggleGroup type="single" value={view} className="justify-start">
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search.placeholder')}
                defaultValue={search}
                className="pl-10"
                name="search"
              />
            </div>
            
            {/* 过滤器按钮 */}
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t('actions.filter')}
            </Button>
            
            {/* 导出按钮 */}
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('actions.export')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
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
              <SavedFilters
                currentFilters={{
                  search,
                  platform: '',
                  niche,
                  location,
                  dateFrom,
                  dateTo,
                  sortBy,
                  sortOrder,
                }}
                onFiltersChange={() => {}}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* 保存的计算列表 */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5" />
                    {t('list.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('list.showing', {
                      start: (page - 1) * limit + 1,
                      end: Math.min(page * limit, savedData.length),
                      total: savedData.length,
                    })}
                  </CardDescription>
                </div>
                
                {/* 排序选项 */}
                <div className="flex items-center gap-2">
                  <select 
                    className="text-sm border rounded px-2 py-1"
                    defaultValue={`${sortBy}-${sortOrder}`}
                  >
                    <option value="createdAt-desc">{t('sort.newest')}</option>
                    <option value="createdAt-asc">{t('sort.oldest')}</option>
                    <option value="title-asc">{t('sort.titleAZ')}</option>
                    <option value="title-desc">{t('sort.titleZA')}</option>
                    <option value="earnings-desc">{t('sort.earningsHigh')}</option>
                    <option value="earnings-asc">{t('sort.earningsLow')}</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {savedData.length > 0 ? (
                <Tabs value={view} className="w-full">
                  <TabsContent value="grid">
                    <SavedCalculationsGrid
                      calculations={savedData}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onDuplicate={() => {}}
                    />
                  </TabsContent>
                  
                  <TabsContent value="list">
                    <SavedCalculationsTable
                      calculations={savedData}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onDuplicate={() => {}}
                      onSort={() => {}}
                      sorting={{
                        sortBy,
                        sortOrder,
                      }}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {search || niche || location || dateFrom || dateTo 
                      ? t('empty.noResults')
                      : t('empty.noSaved')
                    }
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {search || niche || location || dateFrom || dateTo 
                      ? t('empty.tryDifferentFilters')
                      : t('empty.startSaving')
                    }
                  </p>
                  {!(search || niche || location || dateFrom || dateTo) && (
                    <Button asChild>
                      <a href="/#calculator">
                        <Calculator className="h-4 w-4 mr-2" />
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
      
      {/* 使用提示 */}
      {savedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('tips.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Share2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">{t('tips.share.title')}</h4>
                  <p className="text-muted-foreground">{t('tips.share.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">{t('tips.compare.title')}</h4>
                  <p className="text-muted-foreground">{t('tips.compare.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">{t('tips.export.title')}</h4>
                  <p className="text-muted-foreground">{t('tips.export.description')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}