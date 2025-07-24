"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, X, Filter } from 'lucide-react';
import { CONTENT_NICHES, AUDIENCE_LOCATIONS } from '@/lib/constants';

interface HistoryFiltersProps {
  currentFilters: {
    search: string;
    niche: string;
    location: string;
    dateFrom: string;
    dateTo: string;
    platform?: string;
  };
}

export function HistoryFilters({ currentFilters }: HistoryFiltersProps) {
  const t = useTranslations('history.filters');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState(currentFilters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // 重置页码
    params.set('page', '1');
    
    // 应用过滤器
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = Object.values(currentFilters).some(value => value);

  return (
    <div className="space-y-6">
      {/* 搜索 */}
      <div className="space-y-2">
        <Label htmlFor="search">{t('search.label')}</Label>
        <Input
          id="search"
          placeholder={t('search.placeholder')}
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <Separator />

      {/* 平台 */}
      <div className="space-y-2">
        <Label>{t('platform.label')}</Label>
        <Select
          value={filters.platform || ''}
          onValueChange={(value) => handleFilterChange('platform', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('platform.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('platform.all')}</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 细分领域 */}
      <div className="space-y-2">
        <Label>{t('niche.label')}</Label>
        <Select
          value={filters.niche}
          onValueChange={(value) => handleFilterChange('niche', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('niche.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('niche.all')}</SelectItem>
            {CONTENT_NICHES.map((niche) => (
              <SelectItem key={niche.id} value={niche.id}>
                <div className="flex items-center gap-2">
                  <span>{niche.icon}</span>
                  <span>{niche.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 地理位置 */}
      <div className="space-y-2">
        <Label>{t('location.label')}</Label>
        <Select
          value={filters.location}
          onValueChange={(value) => handleFilterChange('location', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('location.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('location.all')}</SelectItem>
            {AUDIENCE_LOCATIONS.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <div className="flex items-center gap-2">
                  <span>{location.flag}</span>
                  <span>{location.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* 日期范围 */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {t('dateRange.label')}
        </Label>
        
        <div className="grid grid-cols-1 gap-2">
          <div className="space-y-1">
            <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
              {t('dateRange.from')}
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
              {t('dateRange.to')}
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* 操作按钮 */}
      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full">
          <Filter className="h-4 w-4 mr-2" />
          {t('actions.apply')}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="w-full">
            <X className="h-4 w-4 mr-2" />
            {t('actions.clear')}
          </Button>
        )}
      </div>

      {/* 活动过滤器 */}
      {hasActiveFilters && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              {t('active.title')}
            </Label>
            <div className="flex flex-wrap gap-1">
              {currentFilters.search && (
                <Badge variant="secondary" className="text-xs">
                  {t('active.search')}: {currentFilters.search}
                  <button
                    onClick={() => removeFilter('search')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {currentFilters.niche && (
                <Badge variant="secondary" className="text-xs">
                  {t('active.niche')}: {currentFilters.niche}
                  <button
                    onClick={() => removeFilter('niche')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {currentFilters.location && (
                <Badge variant="secondary" className="text-xs">
                  {t('active.location')}: {currentFilters.location}
                  <button
                    onClick={() => removeFilter('location')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {currentFilters.dateFrom && (
                <Badge variant="secondary" className="text-xs">
                  {t('active.dateFrom')}: {currentFilters.dateFrom}
                  <button
                    onClick={() => removeFilter('dateFrom')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {currentFilters.dateTo && (
                <Badge variant="secondary" className="text-xs">
                  {t('active.dateTo')}: {currentFilters.dateTo}
                  <button
                    onClick={() => removeFilter('dateTo')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
