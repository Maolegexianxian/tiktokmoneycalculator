import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/Container';
import { Search, Home, ArrowLeft, Calculator, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: '页面未找到 - TikTok收益计算器',
  description: '抱歉，您访问的页面不存在。请检查URL或返回首页。',
  robots: 'noindex, nofollow',
};

export default async function NotFound() {
  const t = await getTranslations('notFound');
  
  // 推荐的页面链接
  const recommendedPages = [
    {
      title: t('recommendations.calculator'),
      description: t('recommendations.calculatorDesc'),
      href: '/#calculator',
      icon: Calculator,
    },
    {
      title: t('recommendations.faq'),
      description: t('recommendations.faqDesc'),
      href: '/#faq',
      icon: HelpCircle,
    },
  ];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Container className="max-w-4xl">
        <div className="text-center mb-8">
          {/* 404 大号显示 */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary/20 select-none">
              404
            </h1>
            <div className="-mt-8">
              <h2 className="text-3xl font-bold mb-4">
                {t('title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('description')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 搜索和导航 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('search.title')}
              </CardTitle>
              <CardDescription>
                {t('search.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 搜索框 */}
              <div className="flex gap-2">
                <Input 
                  placeholder={t('search.placeholder')}
                  className="flex-1"
                />
                <Button>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {/* 快速导航 */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t('quickNav.title')}</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/">
                      <Home className="h-4 w-4 mr-1" />
                      {t('quickNav.home')}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/#calculator">
                      <Calculator className="h-4 w-4 mr-1" />
                      {t('quickNav.calculator')}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/#faq">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      {t('quickNav.faq')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('actions.backHome')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* 推荐页面 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('recommendations.title')}</CardTitle>
              <CardDescription>
                {t('recommendations.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedPages.map((page, index) => {
                const Icon = page.icon;
                return (
                  <Link 
                    key={index}
                    href={page.href}
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {page.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {page.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
        
        {/* 常见原因 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">{t('causes.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-sm mb-2">{t('causes.common.title')}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t('causes.common.typo')}</li>
                  <li>• {t('causes.common.outdated')}</li>
                  <li>• {t('causes.common.moved')}</li>
                  <li>• {t('causes.common.deleted')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">{t('causes.solutions.title')}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t('causes.solutions.checkUrl')}</li>
                  <li>• {t('causes.solutions.useSearch')}</li>
                  <li>• {t('causes.solutions.goHome')}</li>
                  <li>• {t('causes.solutions.contact')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 联系信息 */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>{t('help.stillNeed')}</p>
          <p className="mt-1">
            {t('help.contact')}: 
            <a 
              href="mailto:support@tiktokmoneycalculator.com" 
              className="text-primary hover:underline ml-1"
            >
              support@tiktokmoneycalculator.com
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
}