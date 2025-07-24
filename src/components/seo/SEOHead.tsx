import Head from 'next/head';
import { useTranslations } from 'next-intl';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'calculator';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: object;
  noIndex?: boolean;
  locale?: string;
  alternateUrls?: { [locale: string]: string };
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false,
  locale = 'en',
  alternateUrls = {},
}: SEOHeadProps) {
  const t = useTranslations('seo');
  
  // Default SEO values
  const defaultTitle = t('defaultTitle');
  const defaultDescription = t('defaultDescription');
  const defaultKeywords = [
    'TikTok money calculator',
    'TikTok earnings calculator',
    'TikTok revenue calculator',
    'TikTok influencer earnings',
    'TikTok content monetization',
    'TikTok brand deals',
    'TikTok Creator Fund earnings',
    'social media monetization',
    'influencer marketing calculator',
    'content creator earnings'
  ];

  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...defaultKeywords, ...keywords];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tiktokmoneycalculator.com';
  const finalCanonicalUrl = canonicalUrl || siteUrl;
  const finalOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(', ')} />
      <meta name="author" content="TikTok Money Calculator" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="language" content={locale} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonicalUrl} />
      
      {/* Alternate Language URLs */}
      {Object.entries(alternateUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:site_name" content="TikTok Money Calculator" />
      <meta property="og:locale" content={locale.replace('-', '_')} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:site" content="@tiktokcalc" />
      <meta name="twitter:creator" content="@tiktokcalc" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Additional Meta Tags for Calculator Pages */}
      {ogType === 'calculator' && (
        <>
          <meta name="application-name" content="TikTok Money Calculator" />
          <meta name="category" content="Finance, Social Media, Tools" />
          <meta name="coverage" content="Worldwide" />
          <meta name="distribution" content="Global" />
          <meta name="rating" content="General" />
          <meta name="revisit-after" content="7 days" />
        </>
      )}
    </Head>
  );
}

// Structured Data Generators
export const generateCalculatorStructuredData = (
  platform: string,
  title: string,
  description: string,
  url: string
) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": title,
  "description": description,
  "url": url,
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Calculate TikTok earnings potential",
    "Estimate brand partnership rates",
    "Analyze engagement metrics",
    "Compare platform monetization",
    "Track earnings history"
  ],
  "screenshot": `${process.env.NEXT_PUBLIC_SITE_URL}/images/calculator-screenshot.jpg`,
  "softwareVersion": "1.0",
  "author": {
    "@type": "Organization",
    "name": "TikTok Money Calculator",
    "url": process.env.NEXT_PUBLIC_SITE_URL
  }
});

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": breadcrumb.name,
    "item": breadcrumb.url
  }))
});

export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateHowToStructuredData = (
  title: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": title,
  "description": description,
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    ...(step.image && { "image": step.image })
  }))
});
