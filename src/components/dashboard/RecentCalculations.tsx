"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Star,
  Trash2,
  ExternalLink,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface CalculationHistory {
  id: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  followers: number;
  avgViews: number;
  engagementRate: number;
  estimatedEarnings: number;
  niche: string;
  location: string;
  createdAt: Date;
  isSaved: boolean;
}

interface RecentCalculationsProps {
  calculations: CalculationHistory[];
  onSave?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function RecentCalculations({ 
  calculations, 
  onSave, 
  onDelete, 
  onView 
}: RecentCalculationsProps) {
  const t = useTranslations('dashboard.recentCalculations');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPlatformConfig = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return {
          name: 'TikTok',
          color: 'bg-black text-white',
          icon: '🎵',
        };
      case 'instagram':
        return {
          name: 'Instagram',
          color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
          icon: '📷',
        };
      case 'youtube':
        return {
          name: 'YouTube',
          color: 'bg-red-500 text-white',
          icon: '📺',
        };
      default:
        return {
          name: platform,
          color: 'bg-gray-500 text-white',
          icon: '📱',
        };
    }
  };

  const handleAction = async (action: () => void, id: string) => {
    setLoadingAction(id);
    try {
      await action();
    } finally {
      setLoadingAction(null);
    }
  };

  if (calculations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('empty.description')}
            </p>
            <Button asChild>
              <Link href="/#calculator">
                {t('empty.startCalculating')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/history">
            {t('viewAll')}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calculations.map((calculation) => {
            const platformConfig = getPlatformConfig(calculation.platform);
            
            return (
              <div
                key={calculation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Platform Badge */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${platformConfig.color}`}>
                    {platformConfig.icon}
                  </div>
                  
                  {/* Calculation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {platformConfig.name} • {calculation.niche}
                      </h4>
                      {calculation.isSaved && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{formatNumber(calculation.followers)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatNumber(calculation.avgViews)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{calculation.engagementRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(calculation.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Earnings */}
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-lg font-bold text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatCurrency(calculation.estimatedEarnings)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('estimatedMonthly')}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        disabled={loadingAction === calculation.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onView?.(calculation.id)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t('actions.view')}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() => handleAction(() => onSave?.(calculation.id), calculation.id)}
                        disabled={calculation.isSaved}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        {calculation.isSaved ? t('actions.saved') : t('actions.save')}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() => handleAction(() => onDelete?.(calculation.id), calculation.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('actions.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {t('showing', { count: calculations.length })}
            </span>
            <Button asChild variant="link" size="sm">
              <Link href="/dashboard/history">
                {t('viewAllHistory')}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}