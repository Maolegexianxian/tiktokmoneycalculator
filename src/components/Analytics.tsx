"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics, initializeMonitoring } from '@/lib/analytics';

/**
 * Analytics 组件
 * 负责初始化 Google Analytics 和性能监控
 */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // 初始化分析服务
    const initAnalytics = async () => {
      try {
        // 检查是否有 Google Analytics ID
        const gaId = process.env.NEXT_PUBLIC_GA_ID;
        if (gaId) {
          await analytics.initialize({
            trackingId: gaId,
            debug: process.env.NODE_ENV === 'development',
            anonymizeIp: true,
            sampleRate: 100,
          });
        }

        // 初始化监控
        initializeMonitoring();
      } catch (error) {
        console.error('Analytics initialization failed:', error);
      }
    };

    initAnalytics();
  }, []);

  useEffect(() => {
    // 跟踪页面浏览
    if (pathname) {
      analytics.trackPageView({
        page: pathname,
        title: document.title,
        referrer: document.referrer,
      });
    }
  }, [pathname]);

  // 这个组件不渲染任何内容
  return null;
}

export default Analytics;