"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Share2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SavedCalculation {
  id: string;
  name: string;
  platform: string;
  input: any;
  result: any;
  createdAt: Date;
  updatedAt: Date;
}

interface SavedCalculationsTableProps {
  calculations: SavedCalculation[];
  onEdit: (calculation: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onDuplicate: (calculation: SavedCalculation) => void;
  sorting: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  onSort: (column: string) => void;
}

export function SavedCalculationsTable({ 
  calculations, 
  onEdit, 
  onDelete, 
  onDuplicate,
  sorting,
  onSort
}: SavedCalculationsTableProps) {
  const t = useTranslations('dashboard.saved.table');
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlatformBadge = (platform: string) => {
    const variants = {
      tiktok: 'bg-pink-500',
      instagram: 'bg-purple-500',
      youtube: 'bg-red-500',
    };
    
    return (
      <Badge className={`${variants[platform as keyof typeof variants] || 'bg-gray-500'} text-white`}>
        {platform.toUpperCase()}
      </Badge>
    );
  };

  const getSortIcon = (column: string) => {
    if (sorting.sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sorting.sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const handleView = (calculation: SavedCalculation) => {
    router.push(`/calculator?load=${calculation.id}`);
  };

  const handleShare = async (calculation: SavedCalculation) => {
    try {
      const shareUrl = `${window.location.origin}/calculator?shared=${calculation.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t('shareSuccess'));
    } catch (error) {
      toast.error(t('shareError'));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(calculations.map(calc => calc.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {t('selected', { count: selectedRows.length })}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              selectedRows.forEach(id => onDelete(id));
              setSelectedRows([]);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('bulkDelete')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedRows([])}
          >
            {t('clearSelection')}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === calculations.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('name')}
                  className="h-auto p-0 font-semibold"
                >
                  {t('columns.name')}
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('platform')}
                  className="h-auto p-0 font-semibold"
                >
                  {t('columns.platform')}
                  {getSortIcon('platform')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('followers')}
                  className="h-auto p-0 font-semibold"
                >
                  {t('columns.followers')}
                  {getSortIcon('followers')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('monthlyEarnings')}
                  className="h-auto p-0 font-semibold"
                >
                  {t('columns.earnings')}
                  {getSortIcon('monthlyEarnings')}
                </Button>
              </TableHead>
              <TableHead>{t('columns.niche')}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('updatedAt')}
                  className="h-auto p-0 font-semibold"
                >
                  {t('columns.lastUpdated')}
                  {getSortIcon('updatedAt')}
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculations.map((calculation) => (
              <TableRow key={calculation.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(calculation.id)}
                    onCheckedChange={(checked) => handleSelectRow(calculation.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium line-clamp-1">
                      {calculation.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(calculation.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getPlatformBadge(calculation.platform)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {(calculation.input.metrics?.followers || 
                        calculation.input.metrics?.subscribers || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(calculation.input.metrics?.engagementRate || 0).toFixed(1)}% engagement
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-green-600">
                      {formatCurrency(calculation.result.monthlyEarnings)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(calculation.result.yearlyEarnings)} / year
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {calculation.input.profile?.contentNiche || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(calculation.updatedAt), 'MMM dd, yyyy')}
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(calculation.updatedAt), 'HH:mm')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(calculation)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {t('actions.view')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(calculation)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t('actions.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(calculation)}>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('actions.duplicate')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(calculation)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('actions.share')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(calculation.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('actions.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
