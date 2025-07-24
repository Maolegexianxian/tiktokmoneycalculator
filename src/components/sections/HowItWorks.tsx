"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/Container';
import {
  Calculator,
  BarChart3,
  DollarSign,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Target,
} from 'lucide-react';

interface Step {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  color: string;
}

export function HowItWorks() {
  const t = useTranslations('howItWorks');

  const steps: Step[] = [
    {
      number: 1,
      icon: <Users className="h-8 w-8" />,
      title: t('step1.title'),
      description: t('step1.description'),
      details: [
        t('step1.detail1'),
        t('step1.detail2'),
        t('step1.detail3'),
      ],
      color: 'text-blue-600',
    },
    {
      number: 2,
      icon: <Calculator className="h-8 w-8" />,
      title: t('step2.title'),
      description: t('step2.description'),
      details: [
        t('step2.detail1'),
        t('step2.detail2'),
        t('step2.detail3'),
      ],
      color: 'text-green-600',
    },
    {
      number: 3,
      icon: <BarChart3 className="h-8 w-8" />,
      title: t('step3.title'),
      description: t('step3.description'),
      details: [
        t('step3.detail1'),
        t('step3.detail2'),
        t('step3.detail3'),
      ],
      color: 'text-purple-600',
    },
    {
      number: 4,
      icon: <DollarSign className="h-8 w-8" />,
      title: t('step4.title'),
      description: t('step4.description'),
      details: [
        t('step4.detail1'),
        t('step4.detail2'),
        t('step4.detail3'),
      ],
      color: 'text-orange-600',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <Container>
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Target className="h-4 w-4 mr-2" />
            {t('badge')}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0" />
              )}
              
              <Card className="relative z-10 h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-2">
                      <div className={step.color}>
                        {step.icon}
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 flex items-center justify-center font-bold"
                    >
                      {step.number}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-white rounded-full px-6 py-3 shadow-sm border">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>{t('bottomText')}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}