'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/Container';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('error');
  
  useEffect(() => {
    // 记录错误到分析服务
    console.error('Error boundary caught error:', error);
  }, [error]);
  
  const handleReset = () => {
    // 记录重试事件
    console.log('User triggered error reset');
    reset();
  };
  
  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  const handleReportBug = () => {
    const subject = encodeURIComponent(`Bug Report: ${error.message}`);
    const body = encodeURIComponent(
      `Error Details:\n\n` +
      `Message: ${error.message}\n` +
      `Digest: ${error.digest || 'N/A'}\n` +
      `URL: ${window.location.href}\n` +
      `User Agent: ${navigator.userAgent}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `Please describe what you were doing when this error occurred:\n\n`
    );
    
    window.open(
      `mailto:support@tiktokmoneycalculator.com?subject=${subject}&body=${body}`,
      '_blank'
    );
  };
  
  // 判断错误类型
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  const isValidationError = error.message.includes('validation') || error.message.includes('invalid');
  const isServerError = error.message.includes('500') || error.message.includes('server');
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Container className="max-w-2xl">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className={cn(
                "p-3 rounded-full",
                isNetworkError && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
                isValidationError && "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
                isServerError && "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
                !isNetworkError && !isValidationError && !isServerError && "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              )}>
                <AlertTriangle className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {isNetworkError && t('network.title')}
              {isValidationError && t('validation.title')}
              {isServerError && t('server.title')}
              {!isNetworkError && !isValidationError && !isServerError && t('generic.title')}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isNetworkError && t('network.description')}
              {isValidationError && t('validation.description')}
              {isServerError && t('server.description')}
              {!isNetworkError && !isValidationError && !isServerError && t('generic.description')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 错误详情 */}
            <div className="bg-muted/50 p-4 rounded-lg text-left">
              <h4 className="font-semibold text-sm mb-2">{t('details.title')}</h4>
              <p className="text-sm text-muted-foreground font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  {t('details.id')}: {error.digest}
                </p>
              )}
            </div>
            
            {/* 建议解决方案 */}
            <div className="text-left">
              <h4 className="font-semibold text-sm mb-2">{t('suggestions.title')}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {isNetworkError && (
                  <>
                    <li>• {t('suggestions.network.checkConnection')}</li>
                    <li>• {t('suggestions.network.tryAgain')}</li>
                    <li>• {t('suggestions.network.disableVPN')}</li>
                  </>
                )}
                {isValidationError && (
                  <>
                    <li>• {t('suggestions.validation.checkInput')}</li>
                    <li>• {t('suggestions.validation.refreshPage')}</li>
                  </>
                )}
                {isServerError && (
                  <>
                    <li>• {t('suggestions.server.waitAndRetry')}</li>
                    <li>• {t('suggestions.server.checkStatus')}</li>
                  </>
                )}
                {!isNetworkError && !isValidationError && !isServerError && (
                  <>
                    <li>• {t('suggestions.generic.refresh')}</li>
                    <li>• {t('suggestions.generic.clearCache')}</li>
                    <li>• {t('suggestions.generic.tryLater')}</li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleReset} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t('actions.retry')}
            </Button>
            
            <Button variant="outline" onClick={handleGoHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              {t('actions.goHome')}
            </Button>
            
            <Button variant="ghost" onClick={handleReportBug} className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              {t('actions.reportBug')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* 额外帮助信息 */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>{t('help.contact')}</p>
          <p className="mt-1">
            {t('help.email')}: 
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