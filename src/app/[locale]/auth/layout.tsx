import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  
  return {
    title: {
      template: `%s - ${t('title')} - TikTok收益计算器`,
      default: `${t('title')} - TikTok收益计算器`,
    },
    description: t('description'),
    robots: 'noindex, nofollow', // 认证页面不需要被搜索引擎索引
  };
}

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // 检查用户是否已登录
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect('/dashboard');
  }
  
  const t = await getTranslations('auth');
  
  const features = [
    {
      icon: Calculator,
      title: t('features.calculator.title'),
      description: t('features.calculator.description'),
    },
    {
      icon: Shield,
      title: t('features.secure.title'),
      description: t('features.secure.description'),
    },
    {
      icon: Users,
      title: t('features.community.title'),
      description: t('features.community.description'),
    },
    {
      icon: Zap,
      title: t('features.fast.title'),
      description: t('features.fast.description'),
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* 返回首页按钮 */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('backToHome')}
          </Link>
        </Button>
      </div>
      
      <Container className="min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 左侧：品牌信息和特性 */}
          <div className="hidden lg:flex flex-col justify-center space-y-8">
            {/* 品牌标题 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Calculator className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    TikTok {t('brandTitle')}
                  </h1>
                  <p className="text-muted-foreground">
                    {t('brandSubtitle')}
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('brandDescription')}
              </p>
            </div>
            
            {/* 特性列表 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                {t('whyChooseUs')}
              </h2>
              
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">
                  {t('stats.users')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100K+</div>
                <div className="text-sm text-muted-foreground">
                  {t('stats.calculations')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">
                  {t('stats.accuracy')}
                </div>
              </div>
            </div>
            
            {/* 用户评价 */}
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="flex-1">
                    <blockquote className="text-sm italic mb-2">
                      "{t('testimonial.quote')}"
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-semibold">{t('testimonial.author')}</div>
                      <div className="text-muted-foreground">{t('testimonial.role')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 右侧：认证表单 */}
          <div className="flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              {/* 移动端品牌信息 */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2 bg-primary rounded-lg">
                    <Calculator className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h1 className="text-xl font-bold">
                    TikTok {t('brandTitle')}
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {t('brandSubtitle')}
                </p>
              </div>
              
              {/* 认证表单 */}
              <Card className="shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  {children}
                </CardContent>
              </Card>
              
              {/* 帮助链接 */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  {t('help.needHelp')}{' '}
                  <a 
                    href="mailto:support@tiktokmoneycalculator.com" 
                    className="text-primary hover:underline"
                  >
                    {t('help.contactSupport')}
                  </a>
                </p>
              </div>
              
              {/* 法律链接 */}
              <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
                <Link href="/privacy" className="hover:text-primary">
                  {t('legal.privacy')}
                </Link>
                <Link href="/terms" className="hover:text-primary">
                  {t('legal.terms')}
                </Link>
                <Link href="/cookies" className="hover:text-primary">
                  {t('legal.cookies')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}