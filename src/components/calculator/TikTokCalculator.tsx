"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, Users, Eye, Heart, MessageCircle, Share, Info, Lightbulb } from 'lucide-react';
import { CalculatorInput } from '@/types';
import { CONTENT_NICHES, AUDIENCE_LOCATIONS } from '@/lib/constants';

const tiktokSchema = z.object({
  followers: z.number().min(1, 'Followers must be at least 1').max(1000000000, 'Invalid follower count'),
  avgViews: z.number().min(1, 'Average views must be at least 1'),
  avgLikes: z.number().min(0, 'Average likes cannot be negative'),
  avgComments: z.number().min(0, 'Average comments cannot be negative'),
  avgShares: z.number().min(0, 'Average shares cannot be negative'),
  contentNiche: z.string().min(1, 'Please select a content niche'),
  audienceLocation: z.string().min(1, 'Please select audience location'),
  postFrequency: z.number().min(1, 'Post frequency must be at least 1').max(50, 'Maximum 50 posts per week'),
  accountAge: z.number().min(1, 'Account age must be at least 1 month').max(120, 'Maximum 120 months'),
});

type TikTokFormData = z.infer<typeof tiktokSchema>;

interface TikTokCalculatorProps {
  onCalculate: (input: CalculatorInput) => void;
  isCalculating: boolean;
}

export function TikTokCalculator({ onCalculate, isCalculating }: TikTokCalculatorProps) {
  const t = useTranslations('calculator.tiktok');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<TikTokFormData>({
    resolver: zodResolver(tiktokSchema),
    defaultValues: {
      followers: 10000,
      avgViews: 5000,
      avgLikes: 500,
      avgComments: 50,
      avgShares: 25,
      contentNiche: 'lifestyle', // 设置默认值
      audienceLocation: 'us', // 设置默认值
      postFrequency: 7,
      accountAge: 12,
    },
  });

  const watchedValues = watch();
  const engagementRate = watchedValues.followers > 0 
    ? ((watchedValues.avgLikes + watchedValues.avgComments + watchedValues.avgShares) / watchedValues.followers * 100)
    : 0;

  const onSubmit = (data: TikTokFormData) => {
    const input: CalculatorInput = {
      platform: 'tiktok',
      metrics: {
        followers: data.followers,
        avgViews: data.avgViews,
        avgLikes: data.avgLikes,
        avgComments: data.avgComments,
        avgShares: data.avgShares,
        engagementRate,
      },
      profile: {
        contentNiche: data.contentNiche || 'lifestyle', // 确保有默认值
        audienceLocation: data.audienceLocation || 'us', // 确保有默认值
        ...(data.postFrequency !== undefined && { postFrequency: data.postFrequency }),
        ...(data.accountAge !== undefined && { accountAge: data.accountAge }),
      },
    };
    setHasCalculated(true);
    onCalculate(input);
  };

  const getEngagementRating = (rate: number) => {
    if (rate >= 6) return { label: t('engagement.excellent'), color: 'bg-green-500' };
    if (rate >= 4) return { label: t('engagement.good'), color: 'bg-blue-500' };
    if (rate >= 2) return { label: t('engagement.average'), color: 'bg-yellow-500' };
    return { label: t('engagement.low'), color: 'bg-red-500' };
  };

  const engagementRating = getEngagementRating(engagementRate);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('sections.basic.title')}
          </CardTitle>
          <CardDescription>
            {t('sections.basic.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('fields.followers.label')}
            </label>
            <Input
              type="number"
              placeholder={t('fields.followers.placeholder')}
              {...register('followers', { valueAsNumber: true })}
            />
            {errors.followers && (
              <p className="text-sm text-red-500">{errors.followers.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('fields.avgViews.label')}
            </label>
            <Input
              type="number"
              placeholder={t('fields.avgViews.placeholder')}
              {...register('avgViews', { valueAsNumber: true })}
            />
            {errors.avgViews && (
              <p className="text-sm text-red-500">{errors.avgViews.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('fields.avgLikes.label')}
            </label>
            <Input
              type="number"
              placeholder={t('fields.avgLikes.placeholder')}
              {...register('avgLikes', { valueAsNumber: true })}
            />
            {errors.avgLikes && (
              <p className="text-sm text-red-500">{errors.avgLikes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('fields.avgComments.label')}
            </label>
            <Input
              type="number"
              placeholder={t('fields.avgComments.placeholder')}
              {...register('avgComments', { valueAsNumber: true })}
            />
            {errors.avgComments && (
              <p className="text-sm text-red-500">{errors.avgComments.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Rate Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">{t('engagement.title')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${engagementRating.color} text-white`}>
                {engagementRate.toFixed(2)}%
              </Badge>
              <span className="text-sm text-muted-foreground">
                {engagementRating.label}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t('sections.profile.title')}
          </CardTitle>
          <CardDescription>
            {t('sections.profile.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('fields.contentNiche.label')}
            </label>
            <Select
              onValueChange={(value) => setValue('contentNiche', value)}
              defaultValue="lifestyle"
            >
              <SelectTrigger>
                <SelectValue placeholder={t('fields.contentNiche.placeholder')} />
              </SelectTrigger>
              <SelectContent>
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
            {errors.contentNiche && (
              <p className="text-sm text-red-500">{errors.contentNiche.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('fields.audienceLocation.label')}
            </label>
            <Select
              onValueChange={(value) => setValue('audienceLocation', value)}
              defaultValue="us"
            >
              <SelectTrigger>
                <SelectValue placeholder={t('fields.audienceLocation.placeholder')} />
              </SelectTrigger>
              <SelectContent>
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
            {errors.audienceLocation && (
              <p className="text-sm text-red-500">{errors.audienceLocation.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {t('sections.advanced.title')}
              </CardTitle>
              <CardDescription>
                {t('sections.advanced.description')}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? t('actions.hideAdvanced') : t('actions.showAdvanced')}
            </Button>
          </div>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('fields.avgShares.label')}
              </label>
              <Input
                type="number"
                placeholder={t('fields.avgShares.placeholder')}
                {...register('avgShares', { valueAsNumber: true })}
              />
              {errors.avgShares && (
                <p className="text-sm text-red-500">{errors.avgShares.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('fields.postFrequency.label')}
              </label>
              <Input
                type="number"
                placeholder={t('fields.postFrequency.placeholder')}
                {...register('postFrequency', { valueAsNumber: true })}
              />
              {errors.postFrequency && (
                <p className="text-sm text-red-500">{errors.postFrequency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('fields.accountAge.label')}
              </label>
              <Input
                type="number"
                placeholder={t('fields.accountAge.placeholder')}
                {...register('accountAge', { valueAsNumber: true })}
              />
              {errors.accountAge && (
                <p className="text-sm text-red-500">{errors.accountAge.message}</p>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tips */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t('tips.accuracy')}
        </AlertDescription>
      </Alert>

      {/* Quick Start Tip */}
      {!hasCalculated && (
        <Alert className="border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {t('tips.quickStart')}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isCalculating || !watchedValues.followers || !watchedValues.avgViews}
          className="min-w-[200px]"
        >
          {isCalculating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t('actions.calculating')}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {t('actions.calculate')}
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}