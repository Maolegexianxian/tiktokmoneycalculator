"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Star,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Share2,
  Download,
  Copy,
  Calendar,
  TrendingUp,
  Users,
  Heart,
  DollarSign,
  Bookmark,
  Filter,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface SavedCalculation {
  id: string;
  title: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  followers: number;
  avgViews: number;
  engagementRate: number;
  estimatedEarnings: {
    min: number;
    max: number;
  };
  niche: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPublic: boolean;
  notes?: string;
}

interface SavedCalculationsProps {
  calculations?: SavedCalculation[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  onExport?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function SavedCalculations({
  calculations,
  onView,
  onEdit,
  onDelete,
  onShare,
  onExport,
  onDuplicate,
}: SavedCalculationsProps) {
  const t = useTranslations('dashboard.savedCalculations');
  const [filter, setFilter] = useState<'all' | 'TikTok' | 'Instagram' | 'YouTube'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'earnings' | 'followers'>('date');

  // Sample data if none provided
  const sampleCalculations: SavedCalculation[] = calculations || [
    {
      id: '1',
      title: 'My TikTok Analysis',
      platform: 'TikTok',
      followers: 125000,
      avgViews: 45000,
      engagementRate: 4.2,
      estimatedEarnings: { min: 2500, max: 4200 },
      niche: 'Lifestyle',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      tags: ['lifestyle', 'trending'],
      isPublic: false,
      notes: 'Great engagement on lifestyle content',
    },
    {
      id: '2',
      title: 'Instagram Growth Projection',
      platform: 'Instagram',
      followers: 85000,
      avgViews: 12000,
      engagementRate: 3.8,
      estimatedEarnings: { min: 1800, max: 3200 },
      niche: 'Fashion',
      createdAt: '2024-01-14T15:45:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      tags: ['fashion', 'style'],
      isPublic: true,
    },
    {
      id: '3',
      title: 'YouTube Channel Analysis',
      platform: 'YouTube',
      followers: 45000,
      avgViews: 8500,
      engagementRate: 5.1,
      estimatedEarnings: { min: 1200, max: 2800 },
      niche: 'Tech',
      createdAt: '2024-01-13T09:20:00Z',
      updatedAt: '2024-01-13T09:20:00Z',
      tags: ['tech', 'reviews'],
      isPublic: false,
      notes: 'High engagement on tech reviews',
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'TikTok': return 'bg-black text-white';
      case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'YouTube': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPlatformIcon = (platform: string) => {
    // Using generic icons since we don't have platform-specific ones
    switch (platform) {
      case 'TikTok': return '🎵';
      case 'Instagram': return '📸';
      case 'YouTube': return '🎥';
      default: return '📱';
    }
  };

  const filteredCalculations = sampleCalculations.filter(calc => 
    filter === 'all' || calc.platform === filter
  );

  const sortedCalculations = [...filteredCalculations].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'earnings':
        return b.estimatedEarnings.max - a.estimatedEarnings.max;
      case 'followers':
        return b.followers - a.followers;
      default:
        return 0;
    }
  });

  if (sortedCalculations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t('empty.description')}
            </p>
            <Button asChild>
              <Link href="/#calculator">
                {t('empty.action')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filter === 'all' ? t('filters.all') : filter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  {t('filters.all')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter('TikTok')}>
                  TikTok
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('Instagram')}>
                  Instagram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('YouTube')}>
                  YouTube
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/saved">
                {t('viewAll')}
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {sortedCalculations.slice(0, 5).map((calculation) => (
            <div
              key={calculation.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-lg ${getPlatformColor(calculation.platform)} flex items-center justify-center text-lg`}>
                    {getPlatformIcon(calculation.platform)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {calculation.title}
                    </h3>
                    {calculation.isPublic && (
                      <Badge variant="outline" className="text-xs">
                        {t('public')}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{formatNumber(calculation.followers)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(calculation.avgViews)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{calculation.engagementRate}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(calculation.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {calculation.niche}
                    </Badge>
                    {calculation.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center space-x-1 text-sm font-semibold text-gray-900">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>
                      {formatCurrency(calculation.estimatedEarnings.min)} - {formatCurrency(calculation.estimatedEarnings.max)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {t('estimated')}
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(calculation.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t('actions.view')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(calculation.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('actions.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate?.(calculation.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      {t('actions.duplicate')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onShare?.(calculation.id)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      {t('actions.share')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport?.(calculation.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      {t('actions.export')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(calculation.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('actions.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        
        {sortedCalculations.length > 5 && (
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/saved">
                {t('viewMore', { count: sortedCalculations.length - 5 })}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}