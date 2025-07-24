"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { Container } from '@/components/ui/Container';
import {
  Star,
  Quote,
  MessageSquare,
  TrendingUp,
  Users,
  CheckCircle,
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  platform: string;
  avatar: string;
  rating: number;
  content: string;
  metrics: {
    followers: string;
    earnings: string;
    growth: string;
  };
  verified: boolean;
  featured: boolean;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  featured?: boolean;
}

function TestimonialCard({ testimonial, featured = false }: TestimonialCardProps) {
  const cardClasses = featured
    ? "border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-white"
    : "border border-gray-200 hover:border-gray-300 hover:shadow-lg";

  return (
    <Card className={`transition-all duration-300 ${cardClasses}`}>
      <CardContent className="p-6">
        {featured && (
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-0">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        
        <div className="flex items-start space-x-4 mb-4">
          <CustomAvatar
            name={testimonial.name}
            src={testimonial.avatar}
            size={48}
            className="h-12 w-12"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">
                {testimonial.name}
              </h4>
              {testimonial.verified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {testimonial.role} • {testimonial.platform}
            </p>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Quote className="h-6 w-6 text-gray-300 absolute -top-2 -left-1" />
          <p className="text-gray-700 leading-relaxed pl-6">
            {testimonial.content}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {testimonial.metrics.followers}
            </div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {testimonial.metrics.earnings}
            </div>
            <div className="text-xs text-gray-500">Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {testimonial.metrics.growth}
            </div>
            <div className="text-xs text-gray-500">Growth</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Testimonials() {
  const t = useTranslations('testimonials');

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Content Creator',
      platform: 'TikTok',
      avatar: '/avatars/sarah.jpg',
      rating: 5,
      content: t('testimonial1.content'),
      metrics: {
        followers: '2.3M',
        earnings: '$15K',
        growth: '+180%',
      },
      verified: true,
      featured: true,
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      role: 'Influencer',
      platform: 'Instagram',
      avatar: '/avatars/marcus.jpg',
      rating: 5,
      content: t('testimonial2.content'),
      metrics: {
        followers: '850K',
        earnings: '$8.5K',
        growth: '+120%',
      },
      verified: true,
      featured: false,
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      role: 'YouTuber',
      platform: 'YouTube',
      avatar: '/avatars/emma.jpg',
      rating: 5,
      content: t('testimonial3.content'),
      metrics: {
        followers: '1.2M',
        earnings: '$12K',
        growth: '+95%',
      },
      verified: true,
      featured: false,
    },
    {
      id: '4',
      name: 'Alex Kim',
      role: 'Digital Creator',
      platform: 'TikTok',
      avatar: '/avatars/alex.jpg',
      rating: 5,
      content: t('testimonial4.content'),
      metrics: {
        followers: '500K',
        earnings: '$6K',
        growth: '+200%',
      },
      verified: false,
      featured: false,
    },
    {
      id: '5',
      name: 'Lisa Wang',
      role: 'Brand Ambassador',
      platform: 'Instagram',
      avatar: '/avatars/lisa.jpg',
      rating: 5,
      content: t('testimonial5.content'),
      metrics: {
        followers: '1.8M',
        earnings: '$20K',
        growth: '+150%',
      },
      verified: true,
      featured: true,
    },
    {
      id: '6',
      name: 'David Park',
      role: 'Content Strategist',
      platform: 'YouTube',
      avatar: '/avatars/david.jpg',
      rating: 4,
      content: t('testimonial6.content'),
      metrics: {
        followers: '750K',
        earnings: '$9K',
        growth: '+110%',
      },
      verified: true,
      featured: false,
    },
  ];

  const featuredTestimonials = testimonials.filter(t => t.featured);
  const regularTestimonials = testimonials.filter(t => !t.featured);

  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="text-center space-y-4 mb-16">
          <Badge className="px-4 py-2 bg-green-100 text-green-800 border-0">
            <MessageSquare className="h-4 w-4 mr-2" />
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

        {/* Featured Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {featuredTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              featured={true}
            />
          ))}
        </div>

        {/* Regular Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {regularTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              featured={false}
            />
          ))}
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('summary.title')}
            </h3>
            <p className="text-gray-600">
              {t('summary.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                4.9
              </div>
              <div className="text-gray-600 mb-1">
                {t('summary.rating.label')}
              </div>
              <div className="text-sm text-gray-500">
                {t('summary.rating.description')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                50K+
              </div>
              <div className="text-gray-600 mb-1">
                {t('summary.creators.label')}
              </div>
              <div className="text-sm text-gray-500">
                {t('summary.creators.description')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                +145%
              </div>
              <div className="text-gray-600 mb-1">
                {t('summary.growth.label')}
              </div>
              <div className="text-sm text-gray-500">
                {t('summary.growth.description')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                98%
              </div>
              <div className="text-gray-600 mb-1">
                {t('summary.satisfaction.label')}
              </div>
              <div className="text-sm text-gray-500">
                {t('summary.satisfaction.description')}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            {t('platforms.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-lg font-bold">TT</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {t('platforms.tiktok.rating')}
              </div>
              <div className="text-gray-600 mb-2">
                TikTok Creators
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {t('platforms.tiktok.reviews')}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-lg font-bold">IG</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {t('platforms.instagram.rating')}
              </div>
              <div className="text-gray-600 mb-2">
                Instagram Influencers
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {t('platforms.instagram.reviews')}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-lg font-bold">YT</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {t('platforms.youtube.rating')}
              </div>
              <div className="text-gray-600 mb-2">
                YouTube Creators
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {t('platforms.youtube.reviews')}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}