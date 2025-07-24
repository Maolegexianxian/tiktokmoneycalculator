import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Calculator } from '@/components/calculator/Calculator';
import { CalculatorSEO, CalculatorPageContent, CalculatorFAQ } from '@/components/seo/CalculatorSEO';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { PerformanceMonitor } from '@/components/analytics/PerformanceMonitor';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator as CalculatorIcon, 
  TrendingUp, 
  Users, 
  DollarSign,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

interface CalculatorPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    platform?: 'tiktok' | 'instagram' | 'youtube';
  };
}

export async function generateMetadata({ 
  params, 
  searchParams 
}: CalculatorPageProps): Promise<Metadata> {
  const t = await getTranslations('metadata.calculator');
  const platform = searchParams.platform || 'tiktok';
  
  const platformTitles = {
    tiktok: t('tiktok.title'),
    instagram: t('instagram.title'),
    youtube: t('youtube.title'),
  };
  
  const platformDescriptions = {
    tiktok: t('tiktok.description'),
    instagram: t('instagram.description'),
    youtube: t('youtube.description'),
  };
  
  const title = platformTitles[platform];
  const description = platformDescriptions[platform];
  
  return {
    title,
    description,
    keywords: [
      `${platform} money calculator`,
      `${platform} earnings calculator`,
      `${platform} revenue calculator`,
      `${platform} influencer earnings`,
      `${platform} monetization calculator`,
      'social media earnings',
      'content creator income',
      'influencer marketing calculator'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_CONFIG.url}/${params.locale}/calculator?platform=${platform}`,
      images: [
        {
          url: `${SITE_CONFIG.url}/images/og-${platform}-calculator.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_CONFIG.url}/images/og-${platform}-calculator.jpg`],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${params.locale}/calculator`,
      languages: {
        'en': `${SITE_CONFIG.url}/en/calculator`,
        'zh': `${SITE_CONFIG.url}/zh/calculator`,
        'es': `${SITE_CONFIG.url}/es/calculator`,
        'fr': `${SITE_CONFIG.url}/fr/calculator`,
        'de': `${SITE_CONFIG.url}/de/calculator`,
        'ja': `${SITE_CONFIG.url}/ja/calculator`,
        'ko': `${SITE_CONFIG.url}/ko/calculator`,
      },
    },
  };
}

export default async function CalculatorPage({ 
  params, 
  searchParams 
}: CalculatorPageProps) {
  const t = await getTranslations('calculator');
  const platform = searchParams.platform || 'tiktok';
  
  return (
    <ErrorBoundary>
      <CalculatorSEO 
        platform={platform} 
        locale={params.locale}
        canonicalUrl={`${SITE_CONFIG.url}/${params.locale}/calculator?platform=${platform}`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Container>
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <CalculatorIcon className="h-6 w-6 text-primary" />
                <span className="font-semibold">Creator Calculator</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Free Tool</Badge>
                <Badge variant="outline">No Registration Required</Badge>
              </div>
            </div>
          </Container>
        </div>

        {/* Hero Section */}
        <section className="py-12 lg:py-20">
          <Container>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Zap className="h-4 w-4" />
                Most Accurate Calculator
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {platform.charAt(0).toUpperCase() + platform.slice(1)} Money Calculator
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Calculate your potential earnings as a {platform} creator. Get accurate estimates 
                for sponsored posts, brand partnerships, and platform monetization based on real market data.
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background border">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Real Market Data</div>
                    <div className="text-sm text-muted-foreground">Based on actual industry rates</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background border">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Growth Insights</div>
                    <div className="text-sm text-muted-foreground">Personalized optimization tips</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background border">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">100% Free</div>
                    <div className="text-sm text-muted-foreground">No hidden fees or registration</div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Calculator Section */}
        <section className="pb-16 lg:pb-24">
          <Container>
            <Calculator />
          </Container>
        </section>

        {/* SEO Content */}
        <CalculatorPageContent platform={platform} />
        
        {/* FAQ Section */}
        <section className="py-16 bg-muted/50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about {platform} creator earnings
              </p>
            </div>
            <CalculatorFAQ platform={platform} />
          </Container>
        </section>

        {/* Trust Indicators */}
        <section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Trusted by Creators Worldwide</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500K+</div>
                  <div className="text-sm text-muted-foreground">Calculations Performed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Performance Monitor (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <PerformanceMonitor showDetails={false} />
        )}
      </div>
    </ErrorBoundary>
  );
}
