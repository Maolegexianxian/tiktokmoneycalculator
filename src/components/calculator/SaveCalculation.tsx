"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Heart, Share2, Download } from 'lucide-react';
import { CalculationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface SaveCalculationProps {
  results: CalculationResult;
  platform: string;
  onSave?: (savedCalculation: any) => void;
}

export function SaveCalculation({ results, platform, onSave }: SaveCalculationProps) {
  const t = useTranslations('calculator');
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSave = async () => {
    if (!results) {
      toast.error('No calculation results to save');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a name for this calculation');
      return;
    }

    setIsSaving(true);

    try {
      const savedCalculation = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        results,
        platform,
        isFavorite,
        createdAt: new Date().toISOString(),
        userId: session?.user?.id || 'anonymous',
      };

      // 保存到localStorage（如果用户未登录）或发送到API
      if (session?.user?.id) {
        // 发送到API保存到数据库
        const response = await fetch('/api/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(savedCalculation),
        });

        if (!response.ok) {
          throw new Error('Failed to save calculation');
        }

        const result = await response.json();
        savedCalculation.id = result.id;
      } else {
        // 保存到localStorage
        const saved = JSON.parse(localStorage.getItem('saved-calculations') || '[]');
        saved.unshift(savedCalculation);
        localStorage.setItem('saved-calculations', JSON.stringify(saved));
      }

      toast.success(t('save.success'));
      onSave?.(savedCalculation);
      
      // 重置表单
      setName('');
      setDescription('');
      setIsFavorite(false);
    } catch (error) {
      console.error('Save calculation error:', error);
      toast.error(t('save.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!results) return;

    const exportData = {
      name: name || `${platform} Calculation`,
      description,
      results,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name || 'calculation'}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(t('save.exported'));
  };

  const handleShare = async () => {
    if (!results) return;

    const shareData = {
      title: name || `${platform} Earnings Calculation`,
      text: `Check out my ${platform} earnings calculation: ${formatCurrency(results.monthlyEarnings)}/month`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success(t('save.shared'));
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast.success(t('save.copiedToClipboard'));
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error(t('save.shareError'));
    }
  };

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            {t('save.title')}
          </CardTitle>
          <CardDescription>
            {t('save.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Save className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('save.noCalculation')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          {t('save.title')}
        </CardTitle>
        <CardDescription>
          {t('save.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 计算结果预览 */}
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{platform}</Badge>
            <span className="text-lg font-semibold">
              {formatCurrency(results.monthlyEarnings)} / {t('common.month')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{t('common.followers')}:</span>
              <span className="ml-2">N/A</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('common.engagement')}:</span>
              <span className="ml-2">N/A</span>
            </div>
          </div>
        </div>

        {/* 保存表单 */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="calculation-name">{t('save.name')}</Label>
            <Input
              id="calculation-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('save.namePlaceholder')}
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="calculation-description">{t('save.description')}</Label>
            <Textarea
              id="calculation-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('save.descriptionPlaceholder')}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isFavorite ? "default" : "outline"}
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              {t('save.favorite')}
            </Button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? t('save.saving') : t('save.save')}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            {t('save.share')}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('save.export')}
          </Button>
        </div>

        {!session && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p>{t('save.loginHint')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}