"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Loader2, 
  Palette, 
  Monitor, 
  Calculator, 
  BarChart3,
  Bell,
  Zap
} from 'lucide-react';

export function PreferencesSettings() {
  const t = useTranslations('dashboard.preferences');
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'system',
    compactMode: false,
    showAdvancedOptions: true,
    autoSaveCalculations: true,
    defaultPlatform: 'tiktok',
    defaultCurrency: 'USD',
    chartAnimations: true,
    soundEffects: false,
    keyboardShortcuts: true,
    autoRefreshData: true,
    refreshInterval: 30,
    showTooltips: true,
    highContrastMode: false,
    reducedMotion: false,
  });

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/account/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      toast.success(t('updateSuccess'));
    } catch (error) {
      console.error('Preferences update error:', error);
      toast.error(t('updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('appearance.title')}
          </CardTitle>
          <CardDescription>{t('appearance.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('appearance.theme')}</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => handlePreferenceChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('appearance.themes.light')}</SelectItem>
                <SelectItem value="dark">{t('appearance.themes.dark')}</SelectItem>
                <SelectItem value="system">{t('appearance.themes.system')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('appearance.compactMode')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('appearance.compactModeDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.compactMode}
              onCheckedChange={(checked) => handlePreferenceChange('compactMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('appearance.highContrast')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('appearance.highContrastDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.highContrastMode}
              onCheckedChange={(checked) => handlePreferenceChange('highContrastMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('appearance.reducedMotion')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('appearance.reducedMotionDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.reducedMotion}
              onCheckedChange={(checked) => handlePreferenceChange('reducedMotion', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculator Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('calculator.title')}
          </CardTitle>
          <CardDescription>{t('calculator.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('calculator.defaultPlatform')}</Label>
              <Select
                value={preferences.defaultPlatform}
                onValueChange={(value) => handlePreferenceChange('defaultPlatform', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('calculator.defaultCurrency')}</Label>
              <Select
                value={preferences.defaultCurrency}
                onValueChange={(value) => handlePreferenceChange('defaultCurrency', value)}
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('calculator.showAdvanced')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('calculator.showAdvancedDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.showAdvancedOptions}
              onCheckedChange={(checked) => handlePreferenceChange('showAdvancedOptions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('calculator.autoSave')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('calculator.autoSaveDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.autoSaveCalculations}
              onCheckedChange={(checked) => handlePreferenceChange('autoSaveCalculations', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('data.title')}
          </CardTitle>
          <CardDescription>{t('data.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('data.autoRefresh')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('data.autoRefreshDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.autoRefreshData}
              onCheckedChange={(checked) => handlePreferenceChange('autoRefreshData', checked)}
            />
          </div>

          {preferences.autoRefreshData && (
            <div className="space-y-2">
              <Label>{t('data.refreshInterval')} ({preferences.refreshInterval}s)</Label>
              <Slider
                value={[preferences.refreshInterval]}
                onValueChange={([value]) => handlePreferenceChange('refreshInterval', value)}
                max={300}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10s</span>
                <span>5min</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('data.chartAnimations')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('data.chartAnimationsDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.chartAnimations}
              onCheckedChange={(checked) => handlePreferenceChange('chartAnimations', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* User Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t('ux.title')}
          </CardTitle>
          <CardDescription>{t('ux.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('ux.tooltips')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('ux.tooltipsDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.showTooltips}
              onCheckedChange={(checked) => handlePreferenceChange('showTooltips', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('ux.keyboardShortcuts')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('ux.keyboardShortcutsDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.keyboardShortcuts}
              onCheckedChange={(checked) => handlePreferenceChange('keyboardShortcuts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('ux.soundEffects')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('ux.soundEffectsDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.soundEffects}
              onCheckedChange={(checked) => handlePreferenceChange('soundEffects', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSavePreferences} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('saving')}
            </>
          ) : (
            t('save')
          )}
        </Button>
      </div>
    </div>
  );
}
