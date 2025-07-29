"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TikTokCalculator } from './TikTokCalculator';
import { InstagramCalculator } from './InstagramCalculator';
import { YouTubeCalculator } from './YouTubeCalculator';
import { CalculatorResults } from './CalculatorResults';
import { CalculationHistory } from './CalculationHistory';
import { SaveCalculation } from './SaveCalculation';
import { ShareResults } from './ShareResults';
import { PlatformComparison } from './PlatformComparison';
import { EarningsSimulator } from './EarningsSimulator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator as CalculatorIcon, TrendingUp, Users, DollarSign } from 'lucide-react';
import { CalculatorInput, CalculationResult } from '@/types';

export function Calculator() {
  const t = useTranslations('calculator');
  const [activeTab, setActiveTab] = useState('tiktok');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  const handleCalculation = async (input: CalculatorInput) => {
    setIsCalculating(true);
    console.log('Starting calculation with input:', input);

    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Calculation failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('API response data:', result);

      // 检查响应结构
      if (result.success && result.data) {
        console.log('Using result.data:', result.data);
        setResults(result.data);
      } else if (result.monthlyEarnings !== undefined) {
        console.log('Using direct result:', result);
        setResults(result);
      } else {
        console.error('Unexpected response structure:', result);
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      // TODO: Show user-friendly error message
    } finally {
      setIsCalculating(false);
    }
  };

  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      description: t('platforms.tiktok.description'),
      badge: t('platforms.tiktok.badge'),
      color: 'bg-pink-500',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      description: t('platforms.instagram.description'),
      badge: t('platforms.instagram.badge'),
      color: 'bg-purple-500',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '🎥',
      description: t('platforms.youtube.description'),
      badge: t('platforms.youtube.badge'),
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CalculatorIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{t('stats.users')}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>{t('stats.accuracy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{t('stats.calculations')}</span>
          </div>
        </div>
      </div>

      {/* Main Calculator */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalculatorIcon className="h-5 w-5" />
            {t('form.title')}
          </CardTitle>
          <CardDescription>
            {t('form.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {platforms.map((platform) => (
                <TabsTrigger
                  key={platform.id}
                  value={platform.id}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span>{platform.name}</span>
                  {platform.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {platform.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="tiktok" className="space-y-6">
              <TikTokCalculator
                onCalculate={handleCalculation}
                isCalculating={isCalculating}
              />
            </TabsContent>

            <TabsContent value="instagram" className="space-y-6">
              <InstagramCalculator
                onCalculate={handleCalculation}
                isCalculating={isCalculating}
              />
            </TabsContent>

            <TabsContent value="youtube" className="space-y-6">
              <YouTubeCalculator
                onCalculate={handleCalculation}
                isCalculating={isCalculating}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <CalculatorResults results={results} platform={activeTab} />
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <SaveCalculation results={results} platform={activeTab} />
            <ShareResults results={results} platform={activeTab} />
            <Button
              variant="outline"
              onClick={() => setShowComparison(!showComparison)}
            >
              {t('actions.compare')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSimulator(!showSimulator)}
            >
              {t('actions.simulate')}
            </Button>
          </div>

          {/* Platform Comparison */}
          {showComparison && results && (
            <PlatformComparison
              results={[results]}
            />
          )}

          {/* Earnings Simulator */}
          {showSimulator && (
            <EarningsSimulator
              baseResults={results}
              platform={activeTab}
            />
          )}
        </div>
      )}

      {/* Calculation History */}
      <CalculationHistory />
    </div>
  );
}