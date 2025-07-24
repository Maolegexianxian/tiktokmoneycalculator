import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { SocialSignIn } from '@/components/auth/SocialSignIn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  UserPlus, 
  Mail, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Info,
  Star,
  Users,
  TrendingUp,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '注册',
  description: '创建您的TikTok收益计算器账户，开始追踪和分析您的收益潜力。',
};

interface SignUpPageProps {
  searchParams: {
    callbackUrl?: string;
    error?: string;
    message?: string;
  };
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  // 检查用户是否已登录
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect(searchParams.callbackUrl || '/dashboard');
  }
  
  const t = await getTranslations('auth.signup');
  
  const { callbackUrl, error, message } = searchParams;
  
  // 错误消息映射
  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'EmailExists':
        return t('errors.emailExists');
      case 'WeakPassword':
        return t('errors.weakPassword');
      case 'InvalidEmail':
        return t('errors.invalidEmail');
      case 'TermsNotAccepted':
        return t('errors.termsNotAccepted');
      case 'AccountNotLinked':
        return t('errors.accountNotLinked');
      case 'OAuthAccountNotLinked':
        return t('errors.oauthNotLinked');
      case 'OAuthCallback':
        return t('errors.oauthCallback');
      case 'OAuthCreateAccount':
        return t('errors.oauthCreateAccount');
      case 'Default':
      default:
        return t('errors.default');
    }
  };
  
  const benefits = [
    {
      icon: Star,
      title: t('benefits.saveCalculations.title'),
      description: t('benefits.saveCalculations.description'),
    },
    {
      icon: TrendingUp,
      title: t('benefits.trackProgress.title'),
      description: t('benefits.trackProgress.description'),
    },
    {
      icon: Users,
      title: t('benefits.community.title'),
      description: t('benefits.community.description'),
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <UserPlus className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      
      {/* 状态消息 */}
      {message && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            {message}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {getErrorMessage(error)}
          </AlertDescription>
        </Alert>
      )}
      
      {/* 会员福利 */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            {t('memberBenefits.title')}
          </CardTitle>
          <CardDescription>
            {t('memberBenefits.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* 社交注册 */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t('socialSignup.title')}
          </p>
        </div>
        
        <SocialSignIn
          callbackUrl={callbackUrl || '/dashboard'}
          mode="signup"
        />
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('or')}
          </span>
        </div>
      </div>
      
      {/* 邮箱注册表单 */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t('emailSignup.title')}
          </p>
        </div>
        
        <SignUpForm callbackUrl={callbackUrl || '/dashboard'} />
      </div>
      
      {/* 登录链接 */}
      <div className="text-center space-y-4">
        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('hasAccount.text')}
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link href={`/auth/signin${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}>
              {t('hasAccount.signIn')}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* 服务条款和隐私政策 */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start gap-2">
              <Lock className="h-3 w-3 mt-0.5 text-primary" />
              <span>
                {t('terms.agreement')}{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  {t('terms.termsOfService')}
                </Link>
                {' '}{t('terms.and')}{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  {t('terms.privacyPolicy')}
                </Link>
                。
              </span>
            </p>
            
            <p className="flex items-start gap-2">
              <Shield className="h-3 w-3 mt-0.5 text-green-600" />
              <span>{t('terms.dataProtection')}</span>
            </p>
            
            <p className="flex items-start gap-2">
              <Mail className="h-3 w-3 mt-0.5 text-blue-600" />
              <span>{t('terms.emailVerification')}</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* 安全徽章 */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            {t('security.sslEncrypted')}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('security.gdprCompliant')}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('security.description')}
        </p>
      </div>
      
      {/* 统计信息 */}
      <div className="text-center pt-4 border-t">
        <p className="text-xs text-muted-foreground mb-2">
          {t('stats.joinCommunity')}
        </p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-primary" />
            <span className="font-semibold">10,000+</span>
            <span className="text-muted-foreground">{t('stats.creators')}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="font-semibold">$2M+</span>
            <span className="text-muted-foreground">{t('stats.calculated')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}