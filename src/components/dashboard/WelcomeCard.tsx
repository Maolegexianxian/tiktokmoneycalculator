"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  TrendingUp,
  Star,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  Gift,
  Zap,
  BookOpen,
  Video,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface WelcomeCardProps {
  userStats?: {
    totalCalculations: number;
    joinDate: string;
    lastCalculation?: string;
    streak?: number;
  };
  onStartCalculation?: () => void;
  onViewTutorial?: () => void;
}

export function WelcomeCard({
  userStats,
  onStartCalculation,
  onViewTutorial,
}: WelcomeCardProps) {
  const t = useTranslations('dashboard.welcome');
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 17) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  const getUserName = () => {
    return session?.user?.name || t('defaultName');
  };

  const isNewUser = () => {
    return !userStats || userStats.totalCalculations === 0;
  };

  const getStreakDays = () => {
    return userStats?.streak || 0;
  };

  const getDaysSinceJoin = () => {
    if (!userStats?.joinDate) return 0;
    const joinDate = new Date(userStats.joinDate);
    const diffTime = Math.abs(currentTime.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMotivationalMessage = () => {
    const calculations = userStats?.totalCalculations || 0;
    
    if (calculations === 0) {
      return t('motivation.firstTime');
    } else if (calculations < 5) {
      return t('motivation.beginner');
    } else if (calculations < 20) {
      return t('motivation.intermediate');
    } else {
      return t('motivation.expert');
    }
  };

  const getRecommendedActions = () => {
    const calculations = userStats?.totalCalculations || 0;
    
    if (calculations === 0) {
      return [
        {
          id: 'first-calculation',
          title: t('actions.firstCalculation.title'),
          description: t('actions.firstCalculation.description'),
          icon: <Calculator className="h-5 w-5" />,
          action: onStartCalculation,
          href: '/#calculator',
          variant: 'default' as const,
          priority: 'high' as const,
        },
        {
          id: 'watch-tutorial',
          title: t('actions.tutorial.title'),
          description: t('actions.tutorial.description'),
          icon: <Video className="h-5 w-5" />,
          action: onViewTutorial,
          href: '/tutorial',
          variant: 'outline' as const,
          priority: 'medium' as const,
        },
      ];
    } else if (calculations < 10) {
      return [
        {
          id: 'new-calculation',
          title: t('actions.newCalculation.title'),
          description: t('actions.newCalculation.description'),
          icon: <Calculator className="h-5 w-5" />,
          href: '/#calculator',
          variant: 'default' as const,
          priority: 'high' as const,
        },
        {
          id: 'view-history',
          title: t('actions.viewHistory.title'),
          description: t('actions.viewHistory.description'),
          icon: <Star className="h-5 w-5" />,
          href: '/dashboard/history',
          variant: 'outline' as const,
          priority: 'medium' as const,
        },
      ];
    } else {
      return [
        {
          id: 'advanced-features',
          title: t('actions.advanced.title'),
          description: t('actions.advanced.description'),
          icon: <Zap className="h-5 w-5" />,
          href: '/dashboard/analytics',
          variant: 'default' as const,
          priority: 'high' as const,
        },
        {
          id: 'share-profile',
          title: t('actions.share.title'),
          description: t('actions.share.description'),
          icon: <Users className="h-5 w-5" />,
          href: '/dashboard/profile',
          variant: 'outline' as const,
          priority: 'medium' as const,
        },
      ];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const recommendedActions = getRecommendedActions();

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, {getUserName()}!
                </h1>
                {isNewUser() && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t('badges.new')}
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 max-w-md">
                {getMotivationalMessage()}
              </p>
            </div>
            
            <div className="text-right space-y-1">
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              {userStats?.joinDate && (
                <div className="text-xs text-gray-400">
                  {t('memberSince')} {formatDate(userStats.joinDate)}
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          {!isNewUser() && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/60 rounded-lg border border-white/20">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {userStats?.totalCalculations || 0}
                </div>
                <div className="text-sm text-gray-600">{t('stats.calculations')}</div>
              </div>
              
              <div className="text-center p-4 bg-white/60 rounded-lg border border-white/20">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className="text-2xl font-bold text-orange-600">
                    {getStreakDays()}
                  </div>
                  {getStreakDays() > 0 && (
                    <Target className="h-5 w-5 text-orange-600" />
                  )}
                </div>
                <div className="text-sm text-gray-600">{t('stats.streak')}</div>
              </div>
              
              <div className="text-center p-4 bg-white/60 rounded-lg border border-white/20">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {getDaysSinceJoin()}
                </div>
                <div className="text-sm text-gray-600">{t('stats.days')}</div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isNewUser() ? t('quickStart.title') : t('quickActions.title')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedActions.map((action) => {
                const ActionButton = (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    className={`h-auto p-4 justify-start text-left ${
                      action.priority === 'high' 
                        ? 'ring-2 ring-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
                        : ''
                    }`}
                    onClick={'action' in action ? action.action || (() => {}) : (() => {})}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`p-2 rounded-lg ${
                        action.priority === 'high' 
                          ? 'bg-white/20' 
                          : 'bg-gray-100'
                      }`}>
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm mb-1 ${
                          action.priority === 'high' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {action.title}
                        </div>
                        <div className={`text-xs ${
                          action.priority === 'high' ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {action.description}
                        </div>
                      </div>
                      <ArrowRight className={`h-4 w-4 ${
                        action.priority === 'high' ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>
                  </Button>
                );

                return action.href ? (
                  <Link key={action.id} href={action.href}>
                    {ActionButton}
                  </Link>
                ) : (
                  ActionButton
                );
              })}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Gift className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-1">
                  {isNewUser() ? t('tips.newUser.title') : t('tips.returning.title')}
                </h4>
                <p className="text-sm text-yellow-800 mb-3">
                  {isNewUser() ? t('tips.newUser.description') : t('tips.returning.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white text-yellow-700 border-yellow-300">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {t('tips.badges.guide')}
                  </Badge>
                  <Badge variant="outline" className="bg-white text-yellow-700 border-yellow-300">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {t('tips.badges.accurate')}
                  </Badge>
                  <Badge variant="outline" className="bg-white text-yellow-700 border-yellow-300">
                    <Users className="h-3 w-3 mr-1" />
                    {t('tips.badges.community')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Preview */}
          {!isNewUser() && getStreakDays() > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900">
                      {t('achievement.streak.title')}
                    </h4>
                    <p className="text-sm text-purple-700">
                      {t('achievement.streak.description', { days: getStreakDays() })}
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {getStreakDays()} {t('achievement.streak.days')}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}