"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { Container } from '@/components/ui/Container';
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Star,
  CheckCircle,
  ArrowUpRight,
  Trophy,
} from 'lucide-react';

interface SuccessStory {
  id: string;
  name: string;
  username: string;
  platform: string;
  avatar?: string; // 可选，支持生成的头像
  story: string;
  metrics: {
    followers: string;
    earnings: string;
    timeframe: string;
    growth: string;
  };
  achievements: string[];
  featured: boolean;
}

interface SuccessStoryCardProps {
  story: SuccessStory;
}

function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return 'bg-black text-white';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'youtube':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className={`h-full hover:shadow-xl transition-all duration-300 ${story.featured ? 'ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent' : ''}`}>
      <CardContent className="p-6">
        {story.featured && (
          <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Trophy className="h-3 w-3 mr-1" />
            Featured Success
          </Badge>
        )}
        
        <div className="flex items-start gap-4 mb-4">
          <CustomAvatar
            name={story.name}
            src={story.avatar}
            size={48}
            className="h-12 w-12"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{story.name}</h3>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">@{story.username}</p>
            <Badge className={getPlatformColor(story.platform)} variant="secondary">
              {story.platform}
            </Badge>
          </div>
        </div>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {story.story}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="font-bold text-lg">{story.metrics.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <div className="font-bold text-lg">{story.metrics.earnings}</div>
            <div className="text-xs text-muted-foreground">Monthly</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <div className="font-bold text-lg">{story.metrics.timeframe}</div>
            <div className="text-xs text-muted-foreground">Timeline</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <div className="font-bold text-lg">{story.metrics.growth}</div>
            <div className="text-xs text-muted-foreground">Growth</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Key Achievements
          </h4>
          <ul className="space-y-2">
            {story.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function SuccessStories() {
  const t = useTranslations('successStories');

  const stories: SuccessStory[] = [
    {
      id: '1',
      name: 'Emma Rodriguez',
      username: 'emmalifestyle',
      platform: 'TikTok',
      avatar: undefined, // 使用生成的头像
      story: t('story1.content'),
      metrics: {
        followers: '1.2M',
        earnings: '$8.5K',
        timeframe: '8 months',
        growth: '+340%',
      },
      achievements: [
        t('story1.achievement1'),
        t('story1.achievement2'),
        t('story1.achievement3'),
      ],
      featured: true,
    },
    {
      id: '2',
      name: 'Marcus Chen',
      username: 'techtalkmarcus',
      platform: 'YouTube',
      avatar: undefined, // 使用生成的头像
      story: t('story2.content'),
      metrics: {
        followers: '850K',
        earnings: '$12.3K',
        timeframe: '1 year',
        growth: '+280%',
      },
      achievements: [
        t('story2.achievement1'),
        t('story2.achievement2'),
        t('story2.achievement3'),
      ],
      featured: false,
    },
    {
      id: '3',
      name: 'Sofia Andersson',
      username: 'sofiafitness',
      platform: 'Instagram',
      avatar: undefined, // 使用生成的头像
      story: t('story3.content'),
      metrics: {
        followers: '650K',
        earnings: '$6.8K',
        timeframe: '6 months',
        growth: '+420%',
      },
      achievements: [
        t('story3.achievement1'),
        t('story3.achievement2'),
        t('story3.achievement3'),
      ],
      featured: false,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Trophy className="h-4 w-4 mr-2" />
            {t('badge')}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <SuccessStoryCard key={story.id} story={story} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-gradient-to-r from-green-50 to-blue-50 rounded-full px-6 py-3 border">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>{t('bottomText')}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}