"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/Container';
import {
  Calculator,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Clock,
} from 'lucide-react';

interface CTAProps {
  onGetStarted?: () => void;
}

export function CTA({ onGetStarted }: CTAProps) {
  const t = useTranslations('cta');

  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    }
    onGetStarted?.();
  };

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      text: t('features.instant'),
    },
    {
      icon: <Shield className="h-5 w-5" />,
      text: t('features.secure'),
    },
    {
      icon: <Clock className="h-5 w-5" />,
      text: t('features.free'),
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge className="px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Star className="h-4 w-4 mr-2" />
              {t('badge')}
            </Badge>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {t('title')}
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/90">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {feature.icon}
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
              onClick={scrollToCalculator}
            >
              <Calculator className="h-5 w-5 mr-2" />
              {t('button')}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-8">
            <p className="text-blue-100 text-sm mb-6">{t('socialProof.title')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-3 backdrop-blur-sm">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {t('socialProof.users.number')}
                </div>
                <div className="text-blue-100 text-sm">
                  {t('socialProof.users.label')}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-3 backdrop-blur-sm">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {t('socialProof.calculations.number')}
                </div>
                <div className="text-blue-100 text-sm">
                  {t('socialProof.calculations.label')}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-3 backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {t('socialProof.accuracy.number')}
                </div>
                <div className="text-blue-100 text-sm">
                  {t('socialProof.accuracy.label')}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-black/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-xs font-bold">TT</span>
                </div>
                <span className="text-sm font-medium">TikTok</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-xs font-bold">IG</span>
                </div>
                <span className="text-sm font-medium">Instagram</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-red-600/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-xs font-bold">YT</span>
                </div>
                <span className="text-sm font-medium">YouTube</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">{t('trustIndicators.rating')}</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-6">
            <p className="text-blue-100 text-sm">
              {t('additionalInfo')}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}