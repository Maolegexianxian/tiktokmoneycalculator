import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Calculator } from '@/components/calculator/Calculator';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Header } from '@/components/ui/Header';

import { TrendingNiches } from '@/components/sections/TrendingNiches';
import { SuccessStories } from '@/components/sections/SuccessStories';
import { NewsletterSignup } from '@/components/sections/NewsletterSignup';
import { SocialProof } from '@/components/sections/SocialProof';
import { Container } from '@/components/ui/Container';
import { Separator } from '@/components/ui/separator';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  
  return {
    title: t('home.title'),
    description: t('home.description'),
    keywords: t('home.keywords'),
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
      type: 'website',
      url: SITE_CONFIG.url,
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t('home.title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.title'),
      description: t('home.description'),
      images: [`${SITE_CONFIG.url}/og-image.png`],
    },
    alternates: {
      canonical: SITE_CONFIG.url,
      languages: {
        'en': `${SITE_CONFIG.url}/en`,
        'zh': `${SITE_CONFIG.url}/zh`,
        'es': `${SITE_CONFIG.url}/es`,
        'fr': `${SITE_CONFIG.url}/fr`,
        'de': `${SITE_CONFIG.url}/de`,
        'ja': `${SITE_CONFIG.url}/ja`,
        'ko': `${SITE_CONFIG.url}/ko`,
        'pt': `${SITE_CONFIG.url}/pt`,
        'ru': `${SITE_CONFIG.url}/ru`,
        'ar': `${SITE_CONFIG.url}/ar`,
      },
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations('calculator');
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Hero />
      </section>
      
      {/* Social Proof */}
      <section className="py-8 border-b">
        <Container>
          <SocialProof />
        </Container>
      </section>
      
      {/* Calculator Section */}
      <section id="calculator" className="py-16 lg:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
          <Calculator />
        </Container>
      </section>
      
      <Separator />
      
      {/* Stats Section */}
      <section className="py-16">
        <Container>
          <Stats />
        </Container>
      </section>
      
      <Separator />
      
      {/* How It Works */}
      <section className="py-16 lg:py-24">
        <Container>
          <HowItWorks />
        </Container>
      </section>
      
      <Separator />
      
      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <Container>
          <Features />
        </Container>
      </section>
      
      <Separator />
      
      {/* Trending Niches */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <Container>
          <TrendingNiches />
        </Container>
      </section>
      

      
      <Separator />
      
      {/* Success Stories */}
      <section className="py-16 lg:py-24">
        <Container>
          <SuccessStories />
        </Container>
      </section>
      
      <Separator />
      
      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <Container>
          <Testimonials />
        </Container>
      </section>
      
      <Separator />
      
      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <FAQ />
        </Container>
      </section>
      
      <Separator />
      
      {/* Newsletter Signup */}
      <section className="py-16 bg-muted/50">
        <Container>
          <NewsletterSignup />
        </Container>
      </section>
      
      <Separator />
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <CTA />
        </Container>
      </section>
    </div>
  );
}