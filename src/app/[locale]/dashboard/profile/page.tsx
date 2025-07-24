import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { AccountSettings } from '@/components/dashboard/AccountSettings';
import { SecuritySettings } from '@/components/dashboard/SecuritySettings';
import { PreferencesSettings } from '@/components/dashboard/PreferencesSettings';
import { DangerZone } from '@/components/dashboard/DangerZone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  Shield, 
  Palette, 
  AlertTriangle,
  Calendar,
  Mail,
  MapPin,
  Globe,
  Camera,
  Edit
} from 'lucide-react';
import { userRepository } from '@/lib/db';
import { getUserStats } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: '个人资料',
  description: '管理您的个人资料、账户设置和偏好。',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/dashboard/profile');
  }
  
  const t = await getTranslations('profile');
  
  // 获取完整的用户信息
  const user = await userRepository.findById(session.user.id);
  
  if (!user) {
    redirect('/auth/signin');
  }
  
  // 获取用户统计信息
  const userStats = await getUserStats(session.user.id);
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('description')}
        </p>
      </div>
      
      {/* 用户信息卡片 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* 头像 */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            {/* 用户信息 */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">
                  {user.name || t('noName')}
                </h2>
                {user.emailVerified && (
                  <Badge variant="secondary" className="text-green-600">
                    {t('verified')}
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                
                {/* Location field not available in user object */}
                
                {/* Website field not available in user object */}
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t('memberSince')} {formatDate(user.createdAt)}
                </div>
              </div>
              
              {/* Bio field not available in user object */}
            </div>
            
            {/* 编辑按钮 */}
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              {t('editProfile')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('stats.calculations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.stats?.historyRecords || 0}</div>
            <p className="text-sm text-muted-foreground">
              {t('stats.thisMonth')}: 0
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('stats.saved')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.stats?.savedCalculations || 0}</div>
            <p className="text-sm text-muted-foreground">
              {t('stats.maxAllowed')}: 50
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('stats.accountAge')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('stats.days')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* 设置标签页 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
          <CardDescription>
            {t('settings.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t('tabs.profile')}</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">{t('tabs.account')}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">{t('tabs.security')}</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">{t('tabs.preferences')}</span>
              </TabsTrigger>
              <TabsTrigger value="danger" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">{t('tabs.danger')}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="account" className="mt-6">
              <AccountSettings />
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <SecuritySettings />
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-6">
              <PreferencesSettings />
            </TabsContent>
            
            <TabsContent value="danger" className="mt-6">
              <div className="space-y-6">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-destructive">
                      {t('danger.warning')}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('danger.description')}
                  </p>
                </div>
                
                <Separator />
                
                <DangerZone />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}