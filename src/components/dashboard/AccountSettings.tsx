"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Loader2, 
  Mail, 
  Bell, 
  Globe, 
  Shield, 
  Trash2,
  AlertTriangle,
  Check
} from 'lucide-react';
import { LOCALE_CONFIG } from '@/lib/constants';

export function AccountSettings() {
  const t = useTranslations('dashboard.account');
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    weeklyReports: true,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currency: 'USD',
    dataRetention: '1year',
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/account/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success(t('settings.updateSuccess'));
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error(t('settings.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm(t('deleteAccount.confirmMessage'))) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      toast.success(t('deleteAccount.success'));
      // Redirect will be handled by the API
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error(t('deleteAccount.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t('email.title')}
          </CardTitle>
          <CardDescription>{t('email.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('email.notifications')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('email.notificationsDescription')}
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('email.marketing')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('email.marketingDescription')}
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('email.weeklyReports')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('email.weeklyReportsDescription')}
              </p>
            </div>
            <Switch
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications.title')}
          </CardTitle>
          <CardDescription>{t('notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('notifications.push')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('notifications.pushDescription')}
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('localization.title')}
          </CardTitle>
          <CardDescription>{t('localization.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('localization.language')}</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCALE_CONFIG.map((locale) => (
                    <SelectItem key={locale.code} value={locale.code}>
                      <div className="flex items-center gap-2">
                        <span>{locale.flag}</span>
                        <span>{locale.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('localization.currency')}</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => handleSettingChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('localization.timezone')}</Label>
            <Input
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              placeholder="Auto-detected timezone"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('privacy.title')}
          </CardTitle>
          <CardDescription>{t('privacy.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('privacy.dataRetention')}</Label>
            <Select
              value={settings.dataRetention}
              onValueChange={(value) => handleSettingChange('dataRetention', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">{t('privacy.retention.3months')}</SelectItem>
                <SelectItem value="6months">{t('privacy.retention.6months')}</SelectItem>
                <SelectItem value="1year">{t('privacy.retention.1year')}</SelectItem>
                <SelectItem value="2years">{t('privacy.retention.2years')}</SelectItem>
                <SelectItem value="forever">{t('privacy.retention.forever')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t('privacy.dataRetentionDescription')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>{t('status.title')}</CardTitle>
          <CardDescription>{t('status.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('status.accountType')}</Label>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email ? t('status.verified') : t('status.unverified')}
              </p>
            </div>
            <Badge variant={session?.user?.email ? "default" : "secondary"}>
              {session?.user?.email ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  {t('status.verified')}
                </>
              ) : (
                t('status.unverified')
              )}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>{t('status.memberSince')}</Label>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('settings.saving')}
            </>
          ) : (
            t('settings.save')
          )}
        </Button>
      </div>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t('deleteAccount.title')}
          </CardTitle>
          <CardDescription>{t('deleteAccount.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('deleteAccount.button')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
