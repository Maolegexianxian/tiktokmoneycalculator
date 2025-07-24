"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/Container';
import {
  TrendingUp,
  Users,
  DollarSign,
  Star,
  BarChart3,
  Target,
  Zap,
  Globe,
} from 'lucide-react';

interface Niche {
  name: string;
  growth: string;
  avgEarnings: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: React.ReactNode;
  color: string;
  description: string;
  platforms: string[];
}

export function TrendingNiches() {
  const t = useTranslations('trending');

  const niches: Niche[] = [
    {
      name: t('niches.lifestyle.name'),
      growth: '+45%',
      avgEarnings: '$2,500',
      difficulty: 'Easy',
      icon: <Star className="h-6 w-6" />,
      color: 'text-yellow-600',
      description: t('niches.lifestyle.description'),
      platforms: ['TikTok', 'Instagram', 'YouTube'],
    },
    {
      name: t('niches.tech.name'),
      growth: '+38%',
      avgEarnings: '$4,200',
      difficulty: 'Medium',
      icon: <Zap className="h-6 w-6" />,
      color: 'text-blue-600',
      description: t('niches.tech.description'),
      platforms: ['YouTube', 'TikTok'],
    },
    {
      name: t('niches.fitness.name'),
      growth: '+52%',
      avgEarnings: '$3,100',
      difficulty: 'Easy',
      icon: <Target className="h-6 w-6" />,
      color: 'text-green-600',
      description: t('niches.fitness.description'),
      platforms: ['Instagram', 'TikTok', 'YouTube'],
    },
    {
      name: t('niches.finance.name'),
      growth: '+41%',
      avgEarnings: '$5,800',
      difficulty: 'Hard',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-emerald-600',
      description: t('niches.finance.description'),
      platforms: ['YouTube', 'LinkedIn'],
    },
    {
      name: t('niches.education.name'),
      growth: '+35%',
      avgEarnings: '$3,800',
      difficulty: 'Medium',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-purple-600',
      description: t('niches.education.description'),
      platforms: ['YouTube', 'TikTok', 'Instagram'],
    },
    {
      name: t('niches.travel.name'),
      growth: '+29%',
      avgEarnings: '$2,900',
      difficulty: 'Medium',
      icon: <Globe className="h-6 w-6" />,
      color: 'text-orange-600',
      description: t('niches.travel.description'),
      platforms: ['Instagram', 'YouTube', 'TikTok'],
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <Container>
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('badge')}
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {niches.map((niche, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm ${niche.color}`}>
                    {niche.icon}
                  </div>
                  <Badge className={getDifficultyColor(niche.difficulty)}>
                    {niche.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {niche.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {niche.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {niche.growth}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('growth')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {niche.avgEarnings}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('avgEarnings')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-2">
                      {t('platforms')}:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {niche.platforms.map((platform, platformIndex) => (
                        <Badge 
                          key={platformIndex} 
                          variant="secondary" 
                          className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            {t('disclaimer')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              {t('stats.creators')}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('stats.growth')}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('stats.revenue')}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}