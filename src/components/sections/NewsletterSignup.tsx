"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/Container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Gift,
  TrendingUp,
  Users,
  Bell,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function NewsletterSignup() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const benefits: Benefit[] = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: t('benefit1.title'),
      description: t('benefit1.description'),
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: t('benefit2.title'),
      description: t('benefit2.description'),
    },
    {
      icon: <Gift className="h-5 w-5" />,
      title: t('benefit3.title'),
      description: t('benefit3.description'),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage(t('errors.invalidEmail'));
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would make an API call here
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      setStatus('success');
      setMessage(t('success.message'));
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Content */}
                <div className="p-8 lg:p-12">
                  <div className="mb-6">
                    <Badge className="mb-4 bg-gradient-to-r from-primary to-blue-600 text-white">
                      <Bell className="h-4 w-4 mr-2" />
                      {t('badge')}
                    </Badge>
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                      {t('title')}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      {t('subtitle')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Input
                          type="email"
                          placeholder={t('emailPlaceholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 text-base"
                          disabled={isLoading}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isLoading || !email}
                        className="h-12 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t('subscribing')}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {t('subscribe')}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {status !== 'idle' && (
                    <Alert className={`mb-6 ${status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      {status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={status === 'success' ? 'text-green-800' : 'text-red-800'}>
                        {message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-muted-foreground">
                      {t('privacy')}
                    </p>
                  </div>
                </div>

                {/* Right Side - Visual */}
                <div className="bg-gradient-to-br from-primary/10 to-blue-100 p-8 lg:p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                        <Mail className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-yellow-800" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <div className="text-2xl font-bold text-primary mb-1">50K+</div>
                        <div className="text-sm text-muted-foreground">{t('stats.subscribers')}</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
                        <div className="text-sm text-muted-foreground">{t('stats.satisfaction')}</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">Weekly</div>
                        <div className="text-sm text-muted-foreground">{t('stats.frequency')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}