"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface ExportHistoryProps {
  userId: string;
  filters?: Record<string, any>;
}

export function ExportHistory({ userId, filters = {} }: ExportHistoryProps) {
  const t = useTranslations('history.export');
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [exportOptions, setExportOptions] = useState({
    includeInputData: true,
    includeResultData: true,
    includeMetadata: true,
    dateRange: 'all', // 'all', 'last30', 'last90', 'custom'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setIsExporting(true);
    
    try {
      const response = await fetch('/api/history/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          format,
          filters,
          options: exportOptions,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // 获取文件名
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || `history-export.${format}`
        : `history-export.${format}`;

      // 下载文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(t('success'), {
        description: t('downloadStarted'),
        icon: <CheckCircle className="h-4 w-4" />,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('error'), {
        description: t('exportFailed'),
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = (format: 'csv' | 'json' | 'pdf') => {
    handleExport(format);
  };

  const handleAdvancedExport = () => {
    handleExport(exportFormat);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'json':
        return <FileJson className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {t('button')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleQuickExport('csv')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            {t('formats.csv')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport('json')}>
            <FileJson className="h-4 w-4 mr-2" />
            {t('formats.json')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            {t('formats.pdf')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              {t('advanced')}
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('dialog.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* 导出格式 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              {t('dialog.format')}
            </Label>
            <div className="col-span-3">
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      {t('formats.csv')}
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      {t('formats.json')}
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('formats.pdf')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 日期范围 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateRange" className="text-right">
              {t('dialog.dateRange')}
            </Label>
            <div className="col-span-3">
              <Select 
                value={exportOptions.dateRange} 
                onValueChange={(value) => setExportOptions(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('dateRanges.all')}</SelectItem>
                  <SelectItem value="last30">{t('dateRanges.last30')}</SelectItem>
                  <SelectItem value="last90">{t('dateRanges.last90')}</SelectItem>
                  <SelectItem value="custom">{t('dateRanges.custom')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 包含选项 */}
          <div className="space-y-3">
            <Label>{t('dialog.includeOptions')}</Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeInputData"
                  checked={exportOptions.includeInputData}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeInputData: !!checked }))
                  }
                />
                <Label htmlFor="includeInputData" className="text-sm">
                  {t('options.inputData')}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeResultData"
                  checked={exportOptions.includeResultData}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeResultData: !!checked }))
                  }
                />
                <Label htmlFor="includeResultData" className="text-sm">
                  {t('options.resultData')}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeMetadata: !!checked }))
                  }
                />
                <Label htmlFor="includeMetadata" className="text-sm">
                  {t('options.metadata')}
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            {t('dialog.cancel')}
          </Button>
          <Button onClick={handleAdvancedExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              getFormatIcon(exportFormat)
            )}
            {isExporting ? t('dialog.exporting') : t('dialog.export')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
