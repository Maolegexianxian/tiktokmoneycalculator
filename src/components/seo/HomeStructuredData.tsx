"use client";

import { useTranslations } from 'next-intl';
import { SITE_CONFIG } from '@/lib/constants';

interface HomeStructuredDataProps {
  locale: string;
}

export function HomeStructuredData({ locale }: HomeStructuredDataProps) {
  const t = useTranslations('faq');
  const metaT = useTranslations('metadata');
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TikTok Money Calculator",
    "url": SITE_CONFIG.url,
    "logo": `${SITE_CONFIG.url}/logo.png`,
    "description": metaT('home.description'),
    "sameAs": [
      "https://twitter.com/tiktokmoneycalc",
      "https://facebook.com/tiktokmoneycalculator"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@tiktokmoneycalculator.com"
    }
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TikTok Money Calculator",
    "url": SITE_CONFIG.url,
    "description": metaT('home.description'),
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_CONFIG.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TikTok Money Calculator",
      "url": SITE_CONFIG.url
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('questions.accuracy.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('questions.accuracy.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('questions.requirements.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('questions.requirements.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('questions.revenue.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('questions.revenue.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('questions.howMuchEarn.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('questions.howMuchEarn.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('questions.creatorFund.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('questions.creatorFund.answer')
        }
      }
    ]
  };

  // WebApplication Schema
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TikTok Money Calculator",
    "url": SITE_CONFIG.url,
    "description": metaT('home.description'),
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "TikTok earnings calculation",
      "Brand deal estimation",
      "Engagement rate analysis",
      "Multi-platform support",
      "Real-time updates"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema)
        }}
      />
    </>
  );
}