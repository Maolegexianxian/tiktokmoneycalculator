import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@/components/Analytics';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'TikTok Creator Calculator - Estimate Your Earnings',
    template: '%s | TikTok Creator Calculator',
  },
  description: 'Calculate your potential TikTok earnings with our advanced creator calculator. Get insights into revenue streams, engagement rates, and monetization strategies.',
  keywords: [
    'TikTok calculator',
    'creator earnings',
    'TikTok monetization',
    'influencer income',
    'social media calculator',
    'TikTok revenue',
    'creator fund',
    'brand partnerships',
  ],
  authors: [{ name: 'TikTok Creator Calculator Team' }],
  creator: 'TikTok Creator Calculator',
  publisher: 'TikTok Creator Calculator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tiktokcalculator.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'zh-CN': '/zh',
      'ja-JP': '/ja',
      'ko-KR': '/ko',
      'es-ES': '/es',
      'fr-FR': '/fr',
      'de-DE': '/de',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'TikTok Creator Calculator - Estimate Your Earnings',
    description: 'Calculate your potential TikTok earnings with our advanced creator calculator. Get insights into revenue streams, engagement rates, and monetization strategies.',
    siteName: 'TikTok Creator Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TikTok Creator Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TikTok Creator Calculator - Estimate Your Earnings',
    description: 'Calculate your potential TikTok earnings with our advanced creator calculator.',
    images: ['/twitter-image.png'],
    creator: '@tiktokcalculator',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && { google: process.env.GOOGLE_SITE_VERIFICATION }),
    ...(process.env.YANDEX_VERIFICATION && { yandex: process.env.YANDEX_VERIFICATION }),
    ...(process.env.YAHOO_VERIFICATION && { yahoo: process.env.YAHOO_VERIFICATION }),
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // 等待params解析
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS 预取 */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* 图标 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* 主题颜色 */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
        
        {/* 视口配置 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'TikTok Creator Calculator',
              description: 'Calculate your potential TikTok earnings with our advanced creator calculator.',
              url: process.env.NEXT_PUBLIC_APP_URL,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: 'TikTok Creator Calculator Team',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <ThemeProvider>
            {/* 主要内容 */}
            <div className="min-h-screen bg-background font-sans antialiased">
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
              </div>
            </div>
              
              {/* 全局通知 */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                  success: {
                    iconTheme: {
                      primary: 'hsl(var(--primary))',
                      secondary: 'hsl(var(--primary-foreground))',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'hsl(var(--destructive))',
                      secondary: 'hsl(var(--destructive-foreground))',
                    },
                  },
                }}
              />
              
              {/* 分析和监控 */}
              <Analytics />
            </ThemeProvider>
        </SessionProvider>
        
        {/* 性能监控脚本 */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // 监控 Core Web Vitals
                function sendToAnalytics(metric) {
                  if (window.gtag) {
                    window.gtag('event', metric.name, {
                      event_category: 'Web Vitals',
                      event_label: metric.id,
                      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                      non_interaction: true,
                    });
                  }
                }
                
                // 动态导入 web-vitals
                import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                  getCLS(sendToAnalytics);
                  getFID(sendToAnalytics);
                  getFCP(sendToAnalytics);
                  getLCP(sendToAnalytics);
                  getTTFB(sendToAnalytics);
                }).catch(console.error);
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}

// 生成静态参数
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' },
    { locale: 'ja' },
    { locale: 'ko' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'de' },
  ];
}