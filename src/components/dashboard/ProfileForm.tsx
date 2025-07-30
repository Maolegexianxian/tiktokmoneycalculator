"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, User } from 'lucide-react';
import { CONTENT_NICHES, AUDIENCE_LOCATIONS } from '@/lib/constants';
// import type { ClientFile } from '@/types/file';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  timezone: z.string().optional(),
  contentNiche: z.string().optional(),
  audienceLocation: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const t = useTranslations('dashboard.profile');
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      bio: '',
      website: '',
      location: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      contentNiche: '',
      audienceLocation: '',
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('avatar.sizeError'));
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(t('avatar.typeError'));
        return;
      }

      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    
    try {
      // Upload avatar if changed
      let avatarUrl = session?.user?.image;
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        const uploadResponse = await fetch('/api/upload/avatar', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          avatarUrl = url;
        }
      }

      // Update profile
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          image: avatarUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
          image: avatarUrl,
        },
      });

      toast.success(t('updateSuccess'));
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(t('updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={avatarPreview || session?.user?.image || ''} 
                alt={session?.user?.name || 'User'} 
              />
              <AvatarFallback className="text-lg">
                {getUserInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  <span>{t('avatar.change')}</span>
                </div>
              </Label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('avatar.requirements')}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('fields.name')}</Label>
              <Input
                id="name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('fields.email')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">{t('fields.bio')}</Label>
            <Textarea
              id="bio"
              placeholder={t('fields.bioPlaceholder')}
              {...register('bio')}
            />
            {errors.bio && (
              <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Website and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">{t('fields.website')}</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                {...register('website')}
              />
              {errors.website && (
                <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t('fields.location')}</Label>
              <Input
                id="location"
                placeholder={t('fields.locationPlaceholder')}
                {...register('location')}
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Content Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contentNiche">{t('fields.contentNiche')}</Label>
              <Select
                value={watch('contentNiche') || ''}
                onValueChange={(value) => setValue('contentNiche', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('fields.contentNichePlaceholder')} />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceLocation">{t('fields.audienceLocation')}</Label>
              <Select
                value={watch('audienceLocation') || ''}
                onValueChange={(value) => setValue('audienceLocation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('fields.audienceLocationPlaceholder')} />
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!isDirty || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('updating')}
                </>
              ) : (
                t('update')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
