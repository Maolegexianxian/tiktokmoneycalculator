"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Container } from '@/components/ui/Container';
import {
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  Quote,
  Award,
  Globe,
  Zap,
} from 'lucide-react';

interface SocialProofItem {
  type: 'review' | 'stat' | 'media' | 'certification';
  content: {
    title: string;
    description: string;
    value?: string;
    author?: {
      name: string;
      role: string;
      avatar: string;
    };
    rating?: number;
    source?: string;
  };
}

interface ReviewCardProps {
  item: SocialProofItem;
}

function ReviewCard({ item }: ReviewCardProps) {
  const { content } = item;

  if (item.type === 'review') {
    return (
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < (content.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <Quote className="h-8 w-8 text-primary/20 mb-4" />
          <p className="text-muted-foreground mb-6 leading-relaxed">
            "{content.description}"
          </p>
          {content.author && (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={content.author.avatar} alt={content.author.name} />
                <AvatarFallback>
                  {content.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">{content.author.name}</div>
                <div className="text-xs text-muted-foreground">{content.author.role}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (item.type === 'stat') {
    return (
      <Card className="h-full bg-gradient-to-br from-primary/5 to-blue-50 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary mb-2">{content.value}</div>
          <div className="font-semibold mb-2">{content.title}</div>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </CardContent>
      </Card>
    );
  }

  if (item.type === 'media') {
    return (
      <Card className="h-full border-2 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {content.source}
            </Badge>
          </div>
          <h3 className="font-semibold mb-2">{content.title}</h3>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </CardContent>
      </Card>
    );
  }

  if (item.type === 'certification') {
    return (
      <Card className="h-full border-2 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6 text-center">
          <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">{content.title}</h3>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </CardContent>
      </Card>
    );
  }

  return null;
}

export function SocialProof() {
  const t = useTranslations('socialProof');

  const proofItems: SocialProofItem[] = [
    {
      type: 'review',
      content: {
        title: '',
        description: t('review1.content'),
        rating: 5,
        author: {
          name: 'Alex Thompson',
          role: 'Content Creator',
          avatar: '/avatars/alex.jpg',
        },
      },
    },
    {
      type: 'stat',
      content: {
        title: t('stat1.title'),
        description: t('stat1.description'),
        value: '250K+',
      },
    },
    {
      type: 'review',
      content: {
        title: '',
        description: t('review2.content'),
        rating: 5,
        author: {
          name: 'Maria Garcia',
          role: 'Influencer',
          avatar: '/avatars/maria.jpg',
        },
      },
    },
    {
      type: 'media',
      content: {
        title: t('media1.title'),
        description: t('media1.description'),
        source: 'TechCrunch',
      },
    },
    {
      type: 'stat',
      content: {
        title: t('stat2.title'),
        description: t('stat2.description'),
        value: '98%',
      },
    },
    {
      type: 'certification',
      content: {
        title: t('cert1.title'),
        description: t('cert1.description'),
      },
    },
    {
      type: 'review',
      content: {
        title: '',
        description: t('review3.content'),
        rating: 5,
        author: {
          name: 'David Kim',
          role: 'YouTuber',
          avatar: '/avatars/david.jpg',
        },
      },
    },
    {
      type: 'media',
      content: {
        title: t('media2.title'),
        description: t('media2.description'),
        source: 'Forbes',
      },
    },
  ];

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: '500K+',
      label: t('quickStats.users'),
      color: 'text-blue-600',
    },
    {
      icon: <Star className="h-8 w-8" />,
      value: '4.9/5',
      label: t('quickStats.rating'),
      color: 'text-yellow-600',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: '95%',
      label: t('quickStats.accuracy'),
      color: 'text-green-600',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      value: '<1s',
      label: t('quickStats.speed'),
      color: 'text-purple-600',
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('badge')}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`${stat.color} mx-auto mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Social Proof Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {proofItems.map((item, index) => (
            <ReviewCard key={index} item={item} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-white rounded-full px-6 py-3 shadow-sm border">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{t('bottomText')}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}