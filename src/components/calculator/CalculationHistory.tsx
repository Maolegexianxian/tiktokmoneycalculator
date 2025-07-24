"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, Trash2, Download, Eye } from 'lucide-react';
import { CalculationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CalculationHistoryProps {
  onLoadCalculation?: (calculation: CalculationResult) => void;
}

export function CalculationHistory({ onLoadCalculation }: CalculationHistoryProps) {
  const t = useTranslations('calculator');
  const [history, setHistory] = useState<CalculationResult[]>([]);

  useEffect(() => {
    // 从localStorage加载历史记录
    const savedHistory = localStorage.getItem('calculation-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse calculation history:', error);
      }
    }
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculation-history');
  };

  const removeCalculation = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem('calculation-history', JSON.stringify(newHistory));
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculation-history.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('history.title')}
          </CardTitle>
          <CardDescription>
            {t('history.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('history.empty')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t('history.title')}
            </CardTitle>
            <CardDescription>
              {t('history.description')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportHistory}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('history.export')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t('history.clear')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {history.map((calculation, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">
                        TikTok
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(calculation.monthlyEarnings)} / {t('common.month')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {onLoadCalculation && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLoadCalculation(calculation)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        {t('history.load')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCalculation(index)}
                      className="flex items-center gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('common.followers')}:</span>
                    <span className="ml-2 font-medium">
                      N/A
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('common.engagement')}:</span>
                    <span className="ml-2 font-medium">
                      N/A
                    </span>
                  </div>
                </div>
                
                {index < history.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}