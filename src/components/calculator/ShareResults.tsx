"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Copy, Download, QrCode, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { CalculationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface ShareResultsProps {
  results: CalculationResult;
  platform: string;
}

export function ShareResults({ results, platform }: ShareResultsProps) {
  const t = useTranslations('calculator');
  const [customMessage, setCustomMessage] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const defaultMessage = `Check out my ${platform} earnings calculation: ${formatCurrency(results.monthlyEarnings)}/month!`;
  const shareMessage = customMessage || defaultMessage;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('share.copied'));
    } catch (error) {
      console.error('Copy error:', error);
      toast.error(t('share.copyError'));
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedMessage}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, copy to clipboard instead
        copyToClipboard(`${shareMessage}\n\n${shareUrl}`);
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const generateShareImage = async () => {
    // This would typically generate an image with the calculation results
    // For now, we'll create a simple text-based share format
    const shareData = {
      platform: platform,
      earnings: formatCurrency(results.monthlyEarnings),
      followers: 'N/A',
      engagement: 'N/A',
      url: shareUrl,
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${platform} Earnings Calculator`, canvas.width / 2, 100);
    
    // Earnings
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#10b981';
    ctx.fillText(shareData.earnings + '/month', canvas.width / 2, 200);
    
    // Details
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Followers: ${shareData.followers}`, canvas.width / 2, 280);
    ctx.fillText(`Engagement: ${shareData.engagement}`, canvas.width / 2, 320);
    
    // URL
    ctx.font = '18px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Calculate your earnings at:', canvas.width / 2, 450);
    ctx.fillText(shareData.url, canvas.width / 2, 480);
    
    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${platform}-earnings-calculation.png`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(t('share.imageDownloaded'));
      }
    });
  };

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      // This would typically use a QR code library
      // For now, we'll use a QR code API service
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
      
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = 'qr-code.png';
      link.click();
      
      toast.success(t('share.qrGenerated'));
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error(t('share.qrError'));
    } finally {
      setIsGeneratingQR(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          {t('share.title')}
        </CardTitle>
        <CardDescription>
          {t('share.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">{t('share.social')}</TabsTrigger>
            <TabsTrigger value="link">{t('share.link')}</TabsTrigger>
            <TabsTrigger value="image">{t('share.image')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-4">
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

            {/* 自定义消息 */}
            <div>
              <Label htmlFor="custom-message">{t('share.customMessage')}</Label>
              <Textarea
                id="custom-message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={defaultMessage}
                rows={3}
                maxLength={280}
              />
            </div>

            {/* 社交媒体按钮 */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => shareToSocial('twitter')}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('facebook')}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('linkedin')}
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('instagram')}
                className="flex items-center gap-2"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4">
            <div>
              <Label htmlFor="share-url">{t('share.url')}</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(shareUrl)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {t('share.copy')}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="share-text">{t('share.shareText')}</Label>
              <div className="flex gap-2">
                <Textarea
                  id="share-text"
                  value={`${shareMessage}\n\n${shareUrl}`}
                  readOnly
                  rows={4}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`${shareMessage}\n\n${shareUrl}`)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {t('share.copy')}
                </Button>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={generateQRCode}
              disabled={isGeneratingQR}
              className="w-full flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              {isGeneratingQR ? t('share.generatingQR') : t('share.generateQR')}
            </Button>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {t('share.imageDescription')}
              </p>
              
              <Button
                onClick={generateShareImage}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('share.downloadImage')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}