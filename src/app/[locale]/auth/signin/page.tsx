import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/auth/SignInForm';
import { SocialSignIn } from '@/components/auth/SocialSignIn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  LogIn, 
  Mail, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '登录',
  description: '登录您的TikTok收益计算器账户，访问个人仪表板和保存的计算结果。',
};

interface SignInPageProps {
  searchParams: {
    callbackUrl?: string;
    error?: string;
    message?: string;
    verified?: string;
  };
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  // 检查用户是否已登录
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect(searchParams.callbackUrl || '/dashboard');
  }
  
  const t = await getTranslations('auth.signin');
  
  const { callbackUrl, error, message, verified } = searchParams;
  
  // 错误消息映射
  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'CredentialsSignin':
        return t('errors.invalidCredentials');
      case 'EmailNotVerified':
        return t('errors.emailNotVerified');
      case 'AccountNotLinked':
        return t('errors.accountNotLinked');
      case 'OAuthAccountNotLinked':
        return t('errors.oauthNotLinked');
      case 'EmailSignin':
        return t('errors.emailSignin');
      case 'Callback':
        return t('errors.callback');
      case 'OAuthCallback':
        return t('errors.oauthCallback');
      case 'OAuthCreateAccount':
        return t('errors.oauthCreateAccount');
      case 'SessionRequired':
        return t('errors.sessionRequired');
      case 'Default':
      default:
        return t('errors.default');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LogIn className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      
      {/* 状态消息 */}
      {verified && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {t('messages.emailVerified')}
          </AlertDescription>
        </Alert>
      )}
      
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
      
      {/* 社交登录 */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t('socialSignin.title')}
          </p>
        </div>
        
        <SocialSignIn callbackUrl={callbackUrl || '/dashboard'} />
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
      
      {/* 邮箱登录表单 */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t('emailSignin.title')}
          </p>
        </div>
        
        <SignInForm callbackUrl={callbackUrl || '/dashboard'} />
      </div>
      
      {/* 注册链接 */}
      <div className="text-center space-y-4">
        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('noAccount.text')}
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link href={`/auth/signup${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}>
              {t('noAccount.signUp')}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* 忘记密码链接 */}
      <div className="text-center">
        <Link 
          href="/auth/forgot-password" 
          className="text-sm text-primary hover:underline"
        >
          {t('forgotPassword')}
        </Link>
      </div>
      
      {/* 功能提示 */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('benefits.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{t('benefits.saveCalculations')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{t('benefits.viewHistory')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{t('benefits.personalDashboard')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{t('benefits.exportData')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 安全提示 */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>{t('security.protected')}</p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            SSL
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Mail className="h-3 w-3 mr-1" />
            {t('security.emailVerification')}
          </Badge>
        </div>
      </div>
    </div>
  );
}