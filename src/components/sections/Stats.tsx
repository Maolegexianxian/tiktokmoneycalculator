"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/Container';
import {
  Users,
  Calculator,
  DollarSign,
  TrendingUp,
  Globe,
  Clock,
  Star,
  BarChart3,
} from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
  color: string;
  prefix?: string;
  suffix?: string;
  animated?: boolean;
}

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function Counter({ end, duration = 2000, prefix = '', suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function Stats() {
  const t = useTranslations('stats');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const stats: StatItem[] = [
    {
      icon: <Users className="h-8 w-8" />,
      value: isVisible ? '250000' : '0',
      label: t('users.label'),
      description: t('users.description'),
      color: 'text-blue-600',
      suffix: '+',
      animated: true,
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      value: isVisible ? '1500000' : '0',
      label: t('calculations.label'),
      description: t('calculations.description'),
      color: 'text-green-600',
      suffix: '+',
      animated: true,
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      value: isVisible ? '50000000' : '0',
      label: t('revenue.label'),
      description: t('revenue.description'),
      color: 'text-purple-600',
      prefix: '$',
      suffix: '+',
      animated: true,
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: '95',
      label: t('accuracy.label'),
      description: t('accuracy.description'),
      color: 'text-orange-600',
      suffix: '%',
      animated: false,
    },
    {
      icon: <Globe className="h-8 w-8" />,
      value: '180',
      label: t('countries.label'),
      description: t('countries.description'),
      color: 'text-indigo-600',
      suffix: '+',
      animated: false,
    },
    {
      icon: <Clock className="h-8 w-8" />,
      value: '24',
      label: t('uptime.label'),
      description: t('uptime.description'),
      color: 'text-teal-600',
      suffix: '/7',
      animated: false,
    },
  ];

  const mainStats = stats.slice(0, 4);
  const additionalStats = stats.slice(4);

  return (
    <section id="stats-section" className="py-24 bg-white">
      <Container>
        <div className="text-center space-y-4 mb-16">
          <Badge className="px-4 py-2 bg-blue-100 text-blue-800 border-0">
            <BarChart3 className="h-4 w-4 mr-2" />
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

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainStats.map((stat, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-white to-gray-50"
            >
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white transition-colors duration-300 mb-6 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.animated ? (
                    <Counter
                      end={parseInt(stat.value)}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                    />
                  ) : (
                    `${stat.prefix || ''}${stat.value}${stat.suffix || ''}`
                  )}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {additionalStats.map((stat, index) => (
            <Card 
              key={index + 4} 
              className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                      {`${stat.prefix || ''}${stat.value}${stat.suffix || ''}`}
                    </div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Breakdown */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('platforms.title')}
            </h3>
            <p className="text-gray-600">
              {t('platforms.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">TT</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {t('platforms.tiktok.users')}
              </div>
              <div className="text-gray-600 mb-2">
                {t('platforms.tiktok.label')}
              </div>
              <div className="text-sm text-gray-500">
                {t('platforms.tiktok.description')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">IG</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {t('platforms.instagram.users')}
              </div>
              <div className="text-gray-600 mb-2">
                {t('platforms.instagram.label')}
              </div>
              <div className="text-sm text-gray-500">
                {t('platforms.instagram.description')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">YT</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {t('platforms.youtube.users')}
              </div>
              <div className="text-gray-600 mb-2">
                {t('platforms.youtube.label')}
              </div>
              <div className="text-sm text-gray-500">
                {t('platforms.youtube.description')}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {t('trustIndicators.rating')}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {t('trustIndicators.reviews')}
            </div>
            <div className="text-sm text-gray-600">
              {t('trustIndicators.featured')}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}