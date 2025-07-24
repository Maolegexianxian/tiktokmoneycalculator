"use client";

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  Calculator,
  History,
  Bookmark,
  User,
  Settings,
  BarChart3,
  FileText,
  HelpCircle,
  X
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const t = useTranslations('dashboard.sidebar');
  const pathname = usePathname();

  const navigation = [
    {
      name: t('overview'),
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard',
    },
    {
      name: t('calculator'),
      href: '/calculator',
      icon: Calculator,
      current: pathname === '/calculator',
    },
    {
      name: t('history'),
      href: '/dashboard/history',
      icon: History,
      current: pathname === '/dashboard/history',
      badge: '12', // Mock count
    },
    {
      name: t('saved'),
      href: '/dashboard/saved',
      icon: Bookmark,
      current: pathname === '/dashboard/saved',
      badge: '5', // Mock count
    },
    {
      name: t('analytics'),
      href: '/dashboard/analytics',
      icon: BarChart3,
      current: pathname === '/dashboard/analytics',
    },
  ];

  const secondaryNavigation = [
    {
      name: t('profile'),
      href: '/dashboard/profile',
      icon: User,
      current: pathname === '/dashboard/profile',
    },
    {
      name: t('settings'),
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname === '/dashboard/settings',
    },
    {
      name: t('reports'),
      href: '/dashboard/reports',
      icon: FileText,
      current: pathname === '/dashboard/reports',
    },
    {
      name: t('help'),
      href: '/help',
      icon: HelpCircle,
      current: pathname === '/help',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <h2 className="text-lg font-semibold">{t('menu')}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    {...(onClose && { onClick: onClose })}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        item.current
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.current ? "secondary" : "outline"}
                        className="ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t my-4" />

            {/* Secondary navigation */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('account')}
              </h3>
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    {...(onClose && { onClick: onClose })}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        item.current
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="bg-muted rounded-lg p-3">
              <h4 className="text-sm font-medium mb-1">{t('upgrade.title')}</h4>
              <p className="text-xs text-muted-foreground mb-2">
                {t('upgrade.description')}
              </p>
              <Button size="sm" className="w-full">
                {t('upgrade.button')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
