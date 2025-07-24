import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Container } from '@/components/ui/Container';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('dashboard');
  
  return {
    title: {
      template: `%s - ${t('title')} - TikTok收益计算器`,
      default: `${t('title')} - TikTok收益计算器`,
    },
    description: t('description'),
    robots: 'noindex, nofollow', // 仪表板页面不需要被搜索引擎索引
  };
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // 检查用户认证状态
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }
  
  const t = await getTranslations('dashboard');
  
  return (
    <div className="min-h-screen bg-background">
      {/* 仪表板头部 */}
      <DashboardHeader />
      
      <Separator />
      
      <div className="flex">
        {/* 侧边栏 */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16 lg:z-40">
          <div className="flex flex-col flex-1 min-h-0 bg-card border-r">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <DashboardSidebar />
            </div>
          </div>
        </aside>
        
        {/* 主内容区域 */}
        <main className="flex-1 lg:pl-64">
          <div className="py-6">
            <Container>
              {/* 移动端导航 */}
              <div className="lg:hidden mb-6">
                <DashboardNav />
              </div>
              
              {/* 页面内容 */}
              <div className="space-y-6">
                {children}
              </div>
            </Container>
          </div>
        </main>
      </div>
    </div>
  );
}