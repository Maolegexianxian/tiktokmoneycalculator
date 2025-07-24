"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/Container';
import {
  Calculator,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Shield,
  Globe,
  Users,
  DollarSign,
  Clock,
  Smartphone,
  Brain,
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  color: string;
}

export function Features() {
  const t = useTranslations('features');

  const features: Feature[] = [
    {
      icon: <Calculator className="h-8 w-8" />,
      title: t('calculator.title'),
      description: t('calculator.description'),
      badge: t('calculator.badge'),
      color: 'text-blue-600',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: t('analytics.title'),
      description: t('analytics.description'),
      color: 'text-green-600',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: t('growth.title'),
      description: t('growth.description'),
      color: 'text-purple-600',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: t('optimization.title'),
      description: t('optimization.description'),
      color: 'text-orange-600',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t('multiplatform.title'),
      description: t('multiplatform.description'),
      badge: t('multiplatform.badge'),
      color: 'text-indigo-600',
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: t('ai.title'),
      description: t('ai.description'),
      badge: t('ai.badge'),
      color: 'text-pink-600',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('realtime.title'),
      description: t('realtime.description'),
      color: 'text-yellow-600',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('privacy.title'),
      description: t('privacy.description'),
      color: 'text-red-600',
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: t('mobile.title'),
      description: t('mobile.description'),
      color: 'text-teal-600',
    },
  ];

  const mainFeatures = features.slice(0, 3);
  const additionalFeatures = features.slice(3);

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center space-y-4 mb-16">
          <Badge className="px-4 py-2 bg-blue-100 text-blue-800 border-0">
            {t('badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 group-hover:from-gray-50 group-hover:to-white transition-all duration-300"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-100 group-hover:bg-white transition-colors duration-300 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-gray-900 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <Card 
              key={index + 3} 
              className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300 ${feature.color} flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors duration-300">
                        {feature.title}
                      </h3>
                      {feature.badge && (
                        <Badge variant="outline" className="text-xs ml-2">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('highlights.title')}
            </h3>
            <p className="text-gray-600">
              {t('highlights.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{t('highlights.platforms.number')}</div>
              <div className="text-sm text-gray-600">{t('highlights.platforms.label')}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{t('highlights.accuracy.number')}</div>
              <div className="text-sm text-gray-600">{t('highlights.accuracy.label')}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{t('highlights.speed.number')}</div>
              <div className="text-sm text-gray-600">{t('highlights.speed.label')}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{t('highlights.updates.number')}</div>
              <div className="text-sm text-gray-600">{t('highlights.updates.label')}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}