"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calculator,
  Star,
  Share2,
  Download,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Heart,
  Eye,
  Award,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'calculation' | 'save' | 'share' | 'export' | 'edit' | 'delete' | 'achievement' | 'system';
  title: string;
  description: string;
  timestamp: string;
  platform?: 'TikTok' | 'Instagram' | 'YouTube';
  metadata?: {
    earnings?: number;
    followers?: number;
    engagementRate?: number;
    calculationId?: string;
    achievementType?: string;
  };
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewCalculation?: (id: string) => void;
}

export function ActivityFeed({
  activities,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewCalculation,
}: ActivityFeedProps) {
  const t = useTranslations('dashboard.activityFeed');
  const [filter, setFilter] = useState<'all' | 'unread' | 'calculations' | 'achievements'>('all');

  // Sample data if none provided
  const sampleActivities: ActivityItem[] = activities || [
    {
      id: '1',
      type: 'calculation',
      title: t('activities.newCalculation'),
      description: t('activities.calculationDescription', { platform: 'TikTok', earnings: '$3,200' }),
      timestamp: '2024-01-15T10:30:00Z',
      platform: 'TikTok',
      metadata: {
        earnings: 3200,
        followers: 125000,
        engagementRate: 4.2,
        calculationId: 'calc_1',
      },
      isRead: false,
      priority: 'medium',
    },
    {
      id: '2',
      type: 'achievement',
      title: t('activities.achievement'),
      description: t('activities.achievementDescription', { achievement: 'Power User' }),
      timestamp: '2024-01-15T09:15:00Z',
      metadata: {
        achievementType: 'power_user',
      },
      isRead: false,
      priority: 'high',
    },
    {
      id: '3',
      type: 'save',
      title: t('activities.savedCalculation'),
      description: t('activities.saveDescription', { title: 'Instagram Growth Analysis' }),
      timestamp: '2024-01-14T16:45:00Z',
      platform: 'Instagram',
      metadata: {
        calculationId: 'calc_2',
      },
      isRead: true,
      priority: 'low',
    },
    {
      id: '4',
      type: 'share',
      title: t('activities.sharedCalculation'),
      description: t('activities.shareDescription', { platform: 'YouTube' }),
      timestamp: '2024-01-14T14:20:00Z',
      platform: 'YouTube',
      metadata: {
        calculationId: 'calc_3',
      },
      isRead: true,
      priority: 'low',
    },
    {
      id: '5',
      type: 'system',
      title: t('activities.systemUpdate'),
      description: t('activities.systemDescription'),
      timestamp: '2024-01-13T12:00:00Z',
      isRead: true,
      priority: 'medium',
    },
    {
      id: '6',
      type: 'export',
      title: t('activities.exportedData'),
      description: t('activities.exportDescription'),
      timestamp: '2024-01-13T10:30:00Z',
      isRead: true,
      priority: 'low',
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t('timeAgo.justNow');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t('timeAgo.minutes', { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t('timeAgo.hours', { count: hours });
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return t('timeAgo.days', { count: days });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'calculation': return <Calculator className="h-4 w-4" />;
      case 'save': return <Star className="h-4 w-4" />;
      case 'share': return <Share2 className="h-4 w-4" />;
      case 'export': return <Download className="h-4 w-4" />;
      case 'edit': return <Edit className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'system': return <Bell className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-600';
    
    switch (type) {
      case 'calculation': return 'bg-blue-100 text-blue-600';
      case 'save': return 'bg-yellow-100 text-yellow-600';
      case 'share': return 'bg-green-100 text-green-600';
      case 'export': return 'bg-purple-100 text-purple-600';
      case 'achievement': return 'bg-orange-100 text-orange-600';
      case 'system': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPlatformColor = (platform?: string) => {
    switch (platform) {
      case 'TikTok': return 'bg-black text-white';
      case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'YouTube': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredActivities = sampleActivities.filter(activity => {
    switch (filter) {
      case 'unread': return !activity.isRead;
      case 'calculations': return ['calculation', 'save', 'share', 'export'].includes(activity.type);
      case 'achievements': return activity.type === 'achievement';
      default: return true;
    }
  });

  const unreadCount = sampleActivities.filter(activity => !activity.isRead).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{t('title')}</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('markAllRead')}
              </Button>
            )}
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/activity">
                {t('viewAll')}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: t('filters.all') },
            { key: 'unread', label: t('filters.unread') },
            { key: 'calculations', label: t('filters.calculations') },
            { key: 'achievements', label: t('filters.achievements') },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {t('empty.title')}
            </h3>
            <p className="text-xs text-gray-600">
              {t('empty.description')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.slice(0, 8).map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  activity.isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${getActivityColor(activity.type, activity.priority)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium ${
                      activity.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                    }`}>
                      {activity.title}
                    </h4>
                    
                    <div className="flex items-center space-x-2">
                      {activity.platform && (
                        <Badge className={`text-xs ${getPlatformColor(activity.platform)}`}>
                          {activity.platform}
                        </Badge>
                      )}
                      
                      {activity.priority === 'high' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm ${
                    activity.isRead ? 'text-gray-600' : 'text-gray-700'
                  }`}>
                    {activity.description}
                  </p>
                  
                  {activity.metadata && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                      {activity.metadata.earnings && (
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-green-600">
                            {formatCurrency(activity.metadata.earnings)}
                          </span>
                        </div>
                      )}
                      
                      {activity.metadata.followers && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{(activity.metadata.followers / 1000).toFixed(1)}K</span>
                        </div>
                      )}
                      
                      {activity.metadata.engagementRate && (
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{activity.metadata.engagementRate}%</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activity.metadata?.calculationId && (
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => onViewCalculation?.(activity.metadata!.calculationId!)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {t('viewCalculation')}
                      </Button>
                    </div>
                  )}
                </div>
                
                {!activity.isRead && (
                  <button
                    onClick={() => onMarkAsRead?.(activity.id)}
                    className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"
                    title={t('markAsRead')}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        {filteredActivities.length > 8 && (
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/activity">
                {t('viewMore', { count: filteredActivities.length - 8 })}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}