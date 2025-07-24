"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';
import { HistoryRecord } from '@/types';

interface HistoryTableProps {
  data: HistoryRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  sorting: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

export function HistoryTable({ data, pagination, sorting }: HistoryTableProps) {
  const t = useTranslations('history.table');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sorting.sortBy === column) {
      params.set('sortOrder', sorting.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sortBy', column);
      params.set('sortOrder', 'desc');
    }
    
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const getSortIcon = (column: string) => {
    if (sorting.sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sorting.sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
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

  const formatEarnings = (earnings: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(earnings);
  };

  return (
    <div className="space-y-4">
      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(data.map(item => item.id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('createdAt')}
                  className="h-auto p-0 font-semibold"
                >
                  {t('columns.date')}
                  {getSortIcon('createdAt')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('platform')}
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
                  onClick={() => handleSort('followers')}
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
                  onClick={() => handleSort('monthlyEarnings')}
                  className="h-auto p-0 font-semibold"
                >
                  {t('columns.earnings')}
                  {getSortIcon('monthlyEarnings')}
                </Button>
              </TableHead>
              <TableHead>{t('columns.niche')}</TableHead>
              <TableHead>{t('columns.location')}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(record.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows([...selectedRows, record.id]);
                      } else {
                        setSelectedRows(selectedRows.filter(id => id !== record.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(record.createdAt), 'MMM dd, yyyy')}
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(record.createdAt), 'HH:mm')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getPlatformBadge(record.platform)}
                </TableCell>
                <TableCell>
                  {record.input.metrics.followers?.toLocaleString() || 
                   record.input.metrics.subscribers?.toLocaleString() || 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {formatEarnings(record.result.monthlyEarnings)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatEarnings(record.result.yearlyEarnings)} / year
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {record.input.profile.contentNiche}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {record.input.profile.audienceLocation}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        {t('actions.view')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        {t('actions.export')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t('pagination.showing', {
            start: (pagination.page - 1) * pagination.limit + 1,
            end: Math.min(pagination.page * pagination.limit, pagination.total),
            total: pagination.total,
          })}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {t('pagination.previous')}
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={pagination.page === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            {t('pagination.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
