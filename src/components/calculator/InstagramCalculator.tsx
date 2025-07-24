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
import { Calculator, TrendingUp, Users, Heart, MessageCircle, Info } from 'lucide-react';
import { CalculatorInput } from '@/types';
import { CONTENT_NICHES, AUDIENCE_LOCATIONS } from '@/lib/constants';

const instagramSchema = z.object({
  followers: z.number().min(1, 'Followers must be at least 1').max(1000000000, 'Invalid follower count'),
  avgLikes: z.number().min(0, 'Average likes cannot be negative'),
  avgComments: z.number().min(0, 'Average comments cannot be negative'),
  avgStoryViews: z.number().min(0, 'Average story views cannot be negative'),
  avgReelsViews: z.number().min(0, 'Average reels views cannot be negative'),
  contentNiche: z.string().min(1, 'Please select a content niche'),
  audienceLocation: z.string().min(1, 'Please select audience location'),
  postFrequency: z.number().min(1, 'Post frequency must be at least 1').max(50, 'Maximum 50 posts per week'),
  accountAge: z.number().min(1, 'Account age must be at least 1 month').max(120, 'Maximum 120 months'),
  hasVerification: z.boolean().optional(),
});

type InstagramFormData = z.infer<typeof instagramSchema>;

interface InstagramCalculatorProps {
  onCalculate: (input: CalculatorInput) => void;
  isCalculating: boolean;
}

export function InstagramCalculator({ onCalculate, isCalculating }: InstagramCalculatorProps) {
  const t = useTranslations('calculator.instagram');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<InstagramFormData>({
    resolver: zodResolver(instagramSchema),
    defaultValues: {
      followers: 10000,
      avgLikes: 800,
      avgComments: 50,
      avgStoryViews: 3000,
      avgReelsViews: 5000,
      contentNiche: '',
      audienceLocation: '',
      postFrequency: 5,
      accountAge: 12,
      hasVerification: false,
    },
  });

  const watchedValues = watch();
  const engagementRate = watchedValues.followers > 0 
    ? ((watchedValues.avgLikes + watchedValues.avgComments) / watchedValues.followers * 100)
    : 0;

  const onSubmit = (data: InstagramFormData) => {
    const input: CalculatorInput = {
      platform: 'instagram',
      metrics: {
        followers: data.followers,
        avgLikes: data.avgLikes,
        avgComments: data.avgComments,
        avgStoryViews: data.avgStoryViews,
        avgReelsViews: data.avgReelsViews,
        engagementRate,
      },
      profile: {
        contentNiche: data.contentNiche,
        audienceLocation: data.audienceLocation,
        ...(data.postFrequency !== undefined && { postFrequency: data.postFrequency }),
        ...(data.accountAge !== undefined && { accountAge: data.accountAge }),
        ...(data.hasVerification !== undefined && { hasVerification: data.hasVerification }),
      },
    };
    onCalculate(input);
  };

  const getEngagementRating = (rate: number) => {
    if (rate >= 6) return { label: t('engagement.excellent'), color: 'bg-green-500' };
    if (rate >= 3) return { label: t('engagement.good'), color: 'bg-blue-500' };
    if (rate >= 1) return { label: t('engagement.average'), color: 'bg-yellow-500' };
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
              {t('fields.avgReelsViews.label')}
            </label>
            <Input
              type="number"
              placeholder={t('fields.avgReelsViews.placeholder')}
              {...register('avgReelsViews', { valueAsNumber: true })}
            />
            {errors.avgReelsViews && (
              <p className="text-sm text-red-500">{errors.avgReelsViews.message}</p>
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
                {t('fields.avgStoryViews.label')}
              </label>
              <Input
                type="number"
                placeholder={t('fields.avgStoryViews.placeholder')}
                {...register('avgStoryViews', { valueAsNumber: true })}
              />
              {errors.avgStoryViews && (
                <p className="text-sm text-red-500">{errors.avgStoryViews.message}</p>
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