'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/Container';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';


interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 记录全局错误到分析服务
    console.error('Global error boundary caught error:', error);
  }, [error]);

  const handleReset = () => {
    // 记录重试事件
    console.log('User triggered global error reset');
    reset();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <html>
      <body>
        <Container className="min-h-screen flex items-center justify-center py-12">
          <Card className="w-full max-w-2xl mx-auto text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                系统发生错误
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                抱歉，应用程序遇到了意外错误。我们已经记录了这个问题，正在努力修复。
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold text-gray-900 mb-2">错误详情：</h4>
                <p className="text-sm text-gray-600 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    错误ID: {error.digest}
                  </p>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                <p>您可以尝试以下操作：</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>刷新页面重试</li>
                  <li>返回首页</li>
                  <li>如果问题持续存在，请联系技术支持</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button 
                onClick={handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </CardFooter>
          </Card>
        </Container>
      </body>
    </html>
  );
}