"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, X, Filter, Search } from 'lucide-react';
import { CONTENT_NICHES, AUDIENCE_LOCATIONS } from '@/lib/constants';

interface SavedFiltersProps {
  currentFilters: {
    search: string;
    platform: string;
    niche: string;
    location: string;
    dateFrom: string;
    dateTo: string;
    sortBy: string;
    sortOrder: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function SavedFilters({ currentFilters, onFiltersChange }: SavedFiltersProps) {
  const t = useTranslations('dashboard.saved.filters');
  
  const [filters, setFilters] = useState(currentFilters);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      platform: '',
      niche: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const removeFilter = (key: string) => {
    handleFilterChange(key, '');
  };

  const hasActiveFilters = Object.entries(currentFilters).some(([key, value]) => 
    key !== 'sortBy' && key !== 'sortOrder' && value
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          {t('search.label')}
        </Label>
        <Input
          id="search"
          placeholder={t('search.placeholder')}
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <Separator />

      {/* Platform */}
      <div className="space-y-2">
        <Label>{t('platform.label')}</Label>
        <Select
          value={filters.platform}
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

      {/* Content Niche */}
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

      {/* Audience Location */}
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

      {/* Date Range */}
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

      {/* Sorting */}
      <div className="space-y-4">
        <Label>{t('sorting.label')}</Label>
        
        <div className="grid grid-cols-1 gap-2">
          <div className="space-y-1">
            <Label htmlFor="sortBy" className="text-xs text-muted-foreground">
              {t('sorting.sortBy')}
            </Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">{t('sorting.options.updatedAt')}</SelectItem>
                <SelectItem value="createdAt">{t('sorting.options.createdAt')}</SelectItem>
                <SelectItem value="name">{t('sorting.options.name')}</SelectItem>
                <SelectItem value="platform">{t('sorting.options.platform')}</SelectItem>
                <SelectItem value="monthlyEarnings">{t('sorting.options.earnings')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="sortOrder" className="text-xs text-muted-foreground">
              {t('sorting.order')}
            </Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => handleFilterChange('sortOrder', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t('sorting.desc')}</SelectItem>
                <SelectItem value="asc">{t('sorting.asc')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          {t('actions.clear')}
        </Button>
      )}

      {/* Active Filters */}
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
              
              {currentFilters.platform && (
                <Badge variant="secondary" className="text-xs">
                  {t('active.platform')}: {currentFilters.platform.toUpperCase()}
                  <button
                    onClick={() => removeFilter('platform')}
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
