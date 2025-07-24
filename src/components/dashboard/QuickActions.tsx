"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  History,
  Star,
  Download,
  Share2,
  Settings,
  HelpCircle,
  TrendingUp,
  Users,
  BarChart3,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  color?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  onExportData?: () => void;
  onShareProfile?: () => void;
}

export function QuickActions({ onExportData, onShareProfile }: QuickActionsProps) {
  const t = useTranslations('dashboard.quickActions');

  const primaryActions: QuickAction[] = [
    {
      id: 'new-calculation',
      title: t('newCalculation.title'),
      description: t('newCalculation.description'),
      icon: <Calculator className="h-6 w-6" />,
      href: '/#calculator',
      variant: 'default',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'view-history',
      title: t('viewHistory.title'),
      description: t('viewHistory.description'),
      icon: <History className="h-6 w-6" />,
      href: '/dashboard/history',
      variant: 'outline',
    },
    {
      id: 'saved-calculations',
      title: t('savedCalculations.title'),
      description: t('savedCalculations.description'),
      icon: <Star className="h-6 w-6" />,
      href: '/dashboard/saved',
      variant: 'outline',
    },
  ];

  const secondaryActions: QuickAction[] = [
    {
      id: 'export-data',
      title: t('exportData.title'),
      description: t('exportData.description'),
      icon: <Download className="h-5 w-5" />,
      ...(onExportData && { onClick: onExportData }),
      variant: 'secondary',
    },
    {
      id: 'share-profile',
      title: t('shareProfile.title'),
      description: t('shareProfile.description'),
      icon: <Share2 className="h-5 w-5" />,
      ...(onShareProfile && { onClick: onShareProfile }),
      variant: 'secondary',
    },
    {
      id: 'analytics',
      title: t('analytics.title'),
      description: t('analytics.description'),
      icon: <BarChart3 className="h-5 w-5" />,
      href: '/dashboard/analytics',
      variant: 'secondary',
      disabled: true, // Feature coming soon
    },
    {
      id: 'settings',
      title: t('settings.title'),
      description: t('settings.description'),
      icon: <Settings className="h-5 w-5" />,
      href: '/dashboard/profile',
      variant: 'secondary',
    },
    {
      id: 'help',
      title: t('help.title'),
      description: t('help.description'),
      icon: <HelpCircle className="h-5 w-5" />,
      href: '/help',
      variant: 'secondary',
    },
    {
      id: 'documentation',
      title: t('documentation.title'),
      description: t('documentation.description'),
      icon: <FileText className="h-5 w-5" />,
      href: '/docs',
      variant: 'secondary',
    },
  ];

  const renderAction = (action: QuickAction, isPrimary = false) => {
    const buttonContent = (
      <div className={`flex ${isPrimary ? 'flex-col' : 'flex-row'} items-center ${isPrimary ? 'space-y-3' : 'space-x-3'} ${isPrimary ? 'text-center' : 'text-left'} w-full`}>
        <div className={`${isPrimary ? 'p-3 bg-white/20 rounded-lg' : 'p-2 bg-gray-100 rounded-md'} flex-shrink-0`}>
          {action.icon}
        </div>
        <div className={`${isPrimary ? '' : 'flex-1 min-w-0'}`}>
          <h3 className={`${isPrimary ? 'text-lg' : 'text-sm'} font-semibold ${isPrimary ? 'text-white' : 'text-gray-900'} mb-1`}>
            {action.title}
          </h3>
          <p className={`${isPrimary ? 'text-sm text-white/80' : 'text-xs text-gray-600'} ${isPrimary ? '' : 'line-clamp-2'}`}>
            {action.description}
          </p>
        </div>
      </div>
    );

    if (action.href) {
      return (
        <Button
          key={action.id}
          asChild
          variant={action.variant}
          className={`${isPrimary ? 'h-auto p-6' : 'h-auto p-4'} ${action.color || ''} ${isPrimary ? 'text-white' : ''}`}
          disabled={action.disabled}
        >
          <Link href={action.href}>
            {buttonContent}
          </Link>
        </Button>
      );
    }

    return (
      <Button
        key={action.id}
        variant={action.variant}
        className={`${isPrimary ? 'h-auto p-6' : 'h-auto p-4'} ${action.color || ''} ${isPrimary ? 'text-white' : ''}`}
        onClick={action.onClick}
        disabled={action.disabled}
      >
        {buttonContent}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {primaryActions.map((action) => renderAction(action, true))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('moreActions.title')}</CardTitle>
          <CardDescription>{t('moreActions.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {secondaryActions.map((action) => renderAction(action, false))}
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('tips.title')}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('tips.tip1')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('tips.tip2')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('tips.tip3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Preview */}
      <Card>
        <CardHeader>
          <CardTitle>{t('statsPreview.title')}</CardTitle>
          <CardDescription>{t('statsPreview.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">250K+</div>
              <div className="text-sm text-gray-600">{t('statsPreview.calculations')}</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">50K+</div>
              <div className="text-sm text-gray-600">{t('statsPreview.users')}</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
              <div className="text-sm text-gray-600">{t('statsPreview.accuracy')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}