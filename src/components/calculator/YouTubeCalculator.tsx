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
import { Calculator, TrendingUp, Users, Eye, ThumbsUp, MessageCircle, Info } from 'lucide-react';
import { CalculatorInput } from '@/types';
import { CONTENT_NICHES, AUDIENCE_LOCATIONS } from '@/lib/constants';

const youtubeSchema = z.object({
  subscribers: z.number().min(1, 'Subscribers must be at least 1').max(1000000000, 'Invalid subscriber count'),
  avgViews: z.number().min(1, 'Average views must be at least 1'),
  avgLikes: z.number().min(0, 'Average likes cannot be negative'),
  avgComments: z.number().min(0, 'Average comments cannot be negative'),
  avgWatchTime: z.number().min(0, 'Average watch time cannot be negative'),
  videoLength: z.number().min(1, 'Video length must be at least 1 minute').max(600, 'Maximum 600 minutes'),
  contentNiche: z.string().min(1, 'Please select a content niche'),
  audienceLocation: z.string().min(1, 'Please select audience location'),
  uploadFrequency: z.number().min(1, 'Upload frequency must be at least 1').max(30, 'Maximum 30 videos per month'),
  channelAge: z.number().min(1, 'Channel age must be at least 1 month').max(240, 'Maximum 240 months'),
  monetizationEnabled: z.boolean().optional(),
});

type YouTubeFormData = z.infer<typeof youtubeSchema>;

interface YouTubeCalculatorProps {
  onCalculate: (input: CalculatorInput) => void;
  isCalculating: boolean;
}

export function YouTubeCalculator({ onCalculate, isCalculating }: YouTubeCalculatorProps) {
  const t = useTranslations('calculator.youtube');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<YouTubeFormData>({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      subscribers: 10000,
      avgViews: 5000,
      avgLikes: 200,
      avgComments: 25,
      avgWatchTime: 3.5,
      videoLength: 10,
      contentNiche: '',
      audienceLocation: '',
      uploadFrequency: 4,
      channelAge: 24,
      monetizationEnabled: true,
    },
  });

  const watchedValues = watch();
  const engagementRate = watchedValues.subscribers > 0 
    ? ((watchedValues.avgLikes + watchedValues.avgComments) / watchedValues.subscribers * 100)
    : 0;

  const watchTimePercentage = watchedValues.videoLength > 0
    ? (watchedValues.avgWatchTime / watchedValues.videoLength * 100)
    : 0;

  const onSubmit = (data: YouTubeFormData) => {
    const input: CalculatorInput = {
      platform: 'youtube',
      metrics: {
        subscribers: data.subscribers,
        avgViews: data.avgViews,
        avgLikes: data.avgLikes,
        avgComments: data.avgComments,
        avgWatchTime: data.avgWatchTime,
        videoLength: data.videoLength,
        engagementRate,
        watchTimePercentage,
      },
      profile: {
        contentNiche: data.contentNiche,
        audienceLocation: data.audienceLocation,
        ...(data.uploadFrequency !== undefined && { uploadFrequency: data.uploadFrequency }),
        ...(data.channelAge !== undefined && { channelAge: data.channelAge }),
        ...(data.monetizationEnabled !== undefined && { monetizationEnabled: data.monetizationEnabled }),
      },
    };
    onCalculate(input);
  };

  const getEngagementRating = (rate: number) => {
    if (rate >= 4) return { label: t('engagement.excellent'), color: 'bg-green-500' };
    if (rate >= 2) return { label: t('engagement.good'), color: 'bg-blue-500' };
    if (rate >= 1) return { label: t('engagement.average'), color: 'bg-yellow-500' };
    return { label: t('engagement.low'), color: 'bg-red-500' };
  };

  const getWatchTimeRating = (percentage: number) => {
    if (percentage >= 60) return { label: t('watchTime.excellent'), color: 'bg-green-500' };
    if (percentage >= 40) return { label: t('watchTime.good'), color: 'bg-blue-500' };
    if (percentage >= 25) return { label: t('watchTime.average'), color: 'bg-yellow-500' };
    return { label: t('watchTime.low'), color: 'bg-red-500' };
  };

  const engagementRating = getEngagementRating(engagementRate);
  const watchTimeRating = getWatchTimeRating(watchTimePercentage);

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
              {t('fields.subscribers.label')}
            </label>
            <Input
              type="number"
              placeholder={t('fields.subscribers.placeholder')}
              {...register('subscribers', { valueAsNumber: true })}
            />
            {errors.subscribers && (
              <p className="text-sm text-red-500">{errors.subscribers.message}</p>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('fields.avgWatchTime.label')}
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder={t('fields.avgWatchTime.placeholder')}
              {...register('avgWatchTime', { valueAsNumber: true })}
            />
            {errors.avgWatchTime && (
              <p className="text-sm text-red-500">{errors.avgWatchTime.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('fields.videoLength.label')}
            </label>
            <Input
              type="number"
              placeholder={t('fields.videoLength.placeholder')}
              {...register('videoLength', { valueAsNumber: true })}
            />
            {errors.videoLength && (
              <p className="text-sm text-red-500">{errors.videoLength.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardContent className="pt-6 space-y-4">
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="font-medium">{t('watchTime.title')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${watchTimeRating.color} text-white`}>
                {watchTimePercentage.toFixed(1)}%
              </Badge>
              <span className="text-sm text-muted-foreground">
                {watchTimeRating.label}
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
            <Select onValueChange={(value) => setValue('contentNiche', value)}>
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
            <Select onValueChange={(value) => setValue('audienceLocation', value)}>
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
                {t('fields.uploadFrequency.label')}
              </label>
              <Input
                type="number"
                placeholder={t('fields.uploadFrequency.placeholder')}
                {...register('uploadFrequency', { valueAsNumber: true })}
              />
              {errors.uploadFrequency && (
                <p className="text-sm text-red-500">{errors.uploadFrequency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('fields.channelAge.label')}
              </label>
              <Input
                type="number"
                placeholder={t('fields.channelAge.placeholder')}
                {...register('channelAge', { valueAsNumber: true })}
              />
              {errors.channelAge && (
                <p className="text-sm text-red-500">{errors.channelAge.message}</p>
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

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={!isValid || isCalculating}
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