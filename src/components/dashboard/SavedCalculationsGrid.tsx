"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Share2,
  Calculator,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SavedCalculation {
  id: string;
  name: string;
  platform: string;
  input: any;
  result: any;
  createdAt: Date;
  updatedAt: Date;
}

interface SavedCalculationsGridProps {
  calculations: SavedCalculation[];
  onEdit: (calculation: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onDuplicate: (calculation: SavedCalculation) => void;
}

export function SavedCalculationsGrid({ 
  calculations, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: SavedCalculationsGridProps) {
  const t = useTranslations('dashboard.saved.grid');
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlatformBadge = (platform: string) => {
    const variants = {
      tiktok: 'bg-pink-500',
      instagram: 'bg-purple-500',
      youtube: 'bg-red-500',
    };
    
    return (
      <Badge className={`${variants[platform as keyof typeof variants] || 'bg-gray-500'} text-white`}>
        {platform.toUpperCase()}
      </Badge>
    );
  };

  const handleView = (calculation: SavedCalculation) => {
    router.push(`/calculator?load=${calculation.id}`);
  };

  const handleShare = async (calculation: SavedCalculation) => {
    try {
      const shareUrl = `${window.location.origin}/calculator?shared=${calculation.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t('shareSuccess'));
    } catch (error) {
      toast.error(t('shareError'));
    }
  };

  const handleCardSelect = (id: string) => {
    setSelectedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  if (calculations.length === 0) {
    return (
      <div className="text-center py-12">
        <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('empty.title')}</h3>
        <p className="text-muted-foreground mb-4">{t('empty.description')}</p>
        <Button onClick={() => router.push('/calculator')}>
          {t('empty.action')}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {calculations.map((calculation) => (
        <Card 
          key={calculation.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedCards.includes(calculation.id) ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleCardSelect(calculation.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg line-clamp-1">
                  {calculation.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getPlatformBadge(calculation.platform)}
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(calculation.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleView(calculation)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('actions.view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(calculation)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('actions.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(calculation)}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t('actions.duplicate')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare(calculation)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('actions.share')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(calculation.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('actions.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t('metrics.followers')}</p>
                <p className="font-medium">
                  {(calculation.input.metrics?.followers || 
                    calculation.input.metrics?.subscribers || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t('metrics.engagement')}</p>
                <p className="font-medium">
                  {(calculation.input.metrics?.engagementRate || 0).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Earnings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('earnings.monthly')}</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(calculation.result.monthlyEarnings)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('earnings.yearly')}</span>
                <span className="font-medium">
                  {formatCurrency(calculation.result.yearlyEarnings)}
                </span>
              </div>
            </div>

            {/* Content Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{t('content.niche')}:</span>
                <Badge variant="outline" className="text-xs">
                  {calculation.input.profile?.contentNiche || 'N/A'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{t('content.location')}:</span>
                <Badge variant="outline" className="text-xs">
                  {calculation.input.profile?.audienceLocation || 'N/A'}
                </Badge>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Calendar className="h-3 w-3" />
              <span>
                {t('lastUpdated')}: {format(new Date(calculation.updatedAt), 'MMM dd, HH:mm')}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
