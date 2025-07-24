import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { RecentCalculations } from '@/components/dashboard/RecentCalculations';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { SavedCalculations } from '@/components/dashboard/SavedCalculations';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  Clock,
  Star,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { userRepository, historyRepository, savedCalculationRepository } from '@/lib/db';
import { getUserStats } from '@/lib/auth';
import { formatCurrency, formatNumber } from '@/lib/utils';

export const metadata: Metadata = {
  title: '仪表板概览',
  description: '查看您的TikTok收益计算历史、保存的计算结果和个人统计数据。',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }
  
  const t = await getTranslations('dashboard');
  
  // 获取用户统计数据
  const [userStats, recentCalculations, savedCalculations] = await Promise.all([
    getUserStats(session.user.id),
    historyRepository.getHistory(session.user.id, { limit: 5 }),
    savedCalculationRepository.findByUserId(session.user.id, 5),
  ]);
  
  // 计算一些额外的统计信息
  const totalEarningsEstimated = recentCalculations.data.reduce(
    (sum, calc) => sum + (calc.result?.monthlyEarnings || 0),
    0
  );
  
  const averageFollowers = recentCalculations.data.length > 0
    ? recentCalculations.data.reduce((sum, calc) => sum + (calc.input.metrics?.followers || calc.input.metrics?.subscribers || 0), 0) / recentCalculations.data.length
    : 0;
  
  const mostUsedNiche = recentCalculations.data.length > 0
    ? recentCalculations.data.reduce((acc, calc) => {
        const niche = calc.input.profile?.contentNiche || 'other';
        acc[niche] = (acc[niche] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};
  
  const topNiche = Object.entries(mostUsedNiche).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
  
  // 用户等级计算（基于计算次数）
  const getUserLevel = (calculationCount: number) => {
    if (calculationCount >= 100) return { level: 'Expert', progress: 100, color: 'text-purple-600' };
    if (calculationCount >= 50) return { level: 'Advanced', progress: (calculationCount / 100) * 100, color: 'text-blue-600' };
    if (calculationCount >= 20) return { level: 'Intermediate', progress: (calculationCount / 50) * 100, color: 'text-green-600' };
    if (calculationCount >= 5) return { level: 'Beginner', progress: (calculationCount / 20) * 100, color: 'text-yellow-600' };
    return { level: 'Newcomer', progress: (calculationCount / 5) * 100, color: 'text-gray-600' };
  };
  
  const userLevel = getUserLevel(userStats?.stats?.savedCalculations || 0);
  
  return (
    <div className="space-y-6">
      {/* 欢迎卡片 */}
      <WelcomeCard userStats={{
        totalCalculations: userStats?.stats?.savedCalculations || 0,
        joinDate: userStats?.user?.createdAt?.toISOString() || new Date().toISOString(),
      }} />
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalCalculations')}
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(userStats?.stats?.historyRecords || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {t('stats.thisMonth')}: {formatNumber(recentCalculations.data.length)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.savedCalculations')}
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(userStats?.stats?.savedCalculations || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {t('stats.maxAllowed')}: 50
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.estimatedEarnings')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEarningsEstimated)}</div>
            <p className="text-xs text-muted-foreground">
              {t('stats.basedOnCalculations')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.averageFollowers')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(Math.round(averageFollowers))}</div>
            <p className="text-xs text-muted-foreground">
              {t('stats.mostUsedNiche')}: {topNiche}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* 用户等级和进度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t('level.title')}
          </CardTitle>
          <CardDescription>
            {t('level.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={userLevel.color}>
                {userLevel.level}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {userStats?.stats?.savedCalculations || 0} {t('level.calculations')}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(userLevel.progress)}%
            </div>
          </div>
          <Progress value={userLevel.progress} className="h-2" />
          <div className="mt-2 text-xs text-muted-foreground">
            {userLevel.level === 'Expert' 
              ? t('level.maxLevel')
              : t('level.nextLevel', {
                  remaining: userLevel.level === 'Advanced' ? 100 - (userStats?.stats?.savedCalculations || 0) :
                            userLevel.level === 'Intermediate' ? 50 - (userStats?.stats?.savedCalculations || 0) :
                            userLevel.level === 'Beginner' ? 20 - (userStats?.stats?.savedCalculations || 0) :
                            5 - (userStats?.stats?.savedCalculations || 0)
                })
            }
          </div>
        </CardContent>
      </Card>
      
      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：最近计算和图表 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 收益趋势图表 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('charts.earningsTrend')}
              </CardTitle>
              <CardDescription>
                {t('charts.earningsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EarningsChart data={[]} />
            </CardContent>
          </Card>
          
          {/* 最近计算 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('recent.title')}
              </CardTitle>
              <CardDescription>
                {t('recent.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentCalculations calculations={[]} />
            </CardContent>
          </Card>
        </div>
        
        {/* 右侧：快速操作和活动 */}
        <div className="space-y-6">
          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {t('quickActions.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActions />
            </CardContent>
          </Card>
          
          {/* 保存的计算 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                {t('saved.title')}
              </CardTitle>
              <CardDescription>
                {t('saved.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SavedCalculations calculations={[]} />
            </CardContent>
          </Card>
          
          {/* 活动动态 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t('activity.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 详细统计标签页 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detailed.title')}</CardTitle>
          <CardDescription>
            {t('detailed.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
              <TabsTrigger value="insights">{t('tabs.insights')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <DashboardOverview
                userStats={{
                  totalCalculations: userStats?.stats?.historyRecords || 0,
                  totalEarnings: totalEarningsEstimated,
                  averageEngagement: 0,
                  savedCalculations: userStats?.stats?.savedCalculations || 0,
                  growthRate: 0,
                  platformBreakdown: { tiktok: 0, instagram: 0, youtube: 0 }
                }}
              />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <StatsCards
                userStats={{
                  totalCalculations: userStats?.stats?.historyRecords || 0,
                  totalEarnings: totalEarningsEstimated,
                  avgEngagement: 0,
                  savedCalculations: userStats?.stats?.savedCalculations || 0,
                  monthlyCalculations: recentCalculations.data.length,
                  weeklyGrowth: 0,
                  topPlatform: 'tiktok',
                  accuracy: 95
                }}
              />
            </TabsContent>
            
            <TabsContent value="insights" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('insights.performance')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">{t('insights.calculationFrequency')}</span>
                          <span className="text-sm font-medium">
                            {((userStats?.stats?.historyRecords || 0) / Math.max(1, Math.ceil((Date.now() - new Date(userStats?.user?.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1)}/day
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('insights.saveRate')}</span>
                          <span className="text-sm font-medium">
                            {(userStats?.stats?.historyRecords || 0) > 0 ? Math.round(((userStats?.stats?.savedCalculations || 0) / (userStats?.stats?.historyRecords || 1)) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('insights.memberSince')}</span>
                          <span className="text-sm font-medium">
                            {new Date(userStats?.user?.createdAt || new Date()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('insights.recommendations')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {(userStats?.stats?.historyRecords || 0) < 5 && (
                          <p className="text-muted-foreground">
                            • {t('insights.tips.moreCalculations')}
                          </p>
                        )}
                        {(userStats?.stats?.savedCalculations || 0) === 0 && (
                          <p className="text-muted-foreground">
                            • {t('insights.tips.saveCalculations')}
                          </p>
                        )}
                        {recentCalculations.data.length > 0 && (
                          <p className="text-muted-foreground">
                            • {t('insights.tips.compareResults')}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          • {t('insights.tips.regularUpdates')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}