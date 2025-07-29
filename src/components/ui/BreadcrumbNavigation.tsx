"use client";

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNavigation({ items, className }: BreadcrumbNavigationProps) {
  const t = useTranslations('breadcrumb');
  const pathname = usePathname();
  
  // Auto-generate breadcrumbs based on pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Remove locale from segments
    const localePattern = /^(en|zh|es|fr|de|ja|ko|pt|ru|ar)$/;
    if (segments.length > 0 && segments[0] && localePattern.test(segments[0])) {
      segments.shift();
    }
    
    // Add home
    breadcrumbs.push({ name: t('home'), href: '/' });
    
    // Add path segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      let name = segment;
      // Translate common segments
      switch (segment) {
        case 'calculator':
          name = t('calculator');
          break;
        case 'blog':
          name = t('blog');
          break;
        case 'about':
          name = t('about');
          break;
        case 'contact':
          name = t('contact');
          break;
        case 'privacy':
          name = t('privacy');
          break;
        case 'terms':
          name = t('terms');
          break;
        default:
          // Capitalize and replace hyphens with spaces
          name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      breadcrumbs.push({
        name,
        href: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="flex items-center gap-1">
                      {index === 0 && <Home className="h-4 w-4" />}
                      {item.name}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {index === 0 && <Home className="h-4 w-4" />}
                    {item.name}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Export breadcrumb data for structured data
export function getBreadcrumbStructuredData(items?: BreadcrumbItem[], pathname?: string) {
  const breadcrumbs = items || [];
  
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.href ? `${process.env.NEXT_PUBLIC_SITE_URL}${breadcrumb.href}` : undefined
    }))
  };
}