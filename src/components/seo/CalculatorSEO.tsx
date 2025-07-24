import { useTranslations } from 'next-intl';
import { SEOHead, generateCalculatorStructuredData, generateBreadcrumbStructuredData } from './SEOHead';

interface CalculatorSEOProps {
  platform: 'tiktok' | 'instagram' | 'youtube';
  locale?: string;
  canonicalUrl?: string;
}

export function CalculatorSEO({ platform, locale = 'en', canonicalUrl }: CalculatorSEOProps) {
  const t = useTranslations('seo.calculator');
  
  const platformConfig = {
    tiktok: {
      title: t('tiktok.title'),
      description: t('tiktok.description'),
      keywords: [
        'TikTok money calculator',
        'TikTok earnings calculator',
        'TikTok revenue calculator',
        'TikTok influencer earnings',
        'TikTok brand deals calculator',
        'TikTok Creator Fund earnings',
        'TikTok sponsored post pricing',
        'TikTok engagement calculator',
        'TikTok monetization tool',
        'calculate TikTok earnings from followers'
      ],
      ogImage: '/images/og-tiktok-calculator.jpg'
    },
    instagram: {
      title: t('instagram.title'),
      description: t('instagram.description'),
      keywords: [
        'Instagram money calculator',
        'Instagram earnings calculator',
        'Instagram influencer earnings',
        'Instagram brand partnership calculator',
        'Instagram sponsored post pricing',
        'Instagram engagement calculator',
        'Instagram monetization tool',
        'Instagram Reels earnings',
        'Instagram Stories pricing',
        'calculate Instagram earnings'
      ],
      ogImage: '/images/og-instagram-calculator.jpg'
    },
    youtube: {
      title: t('youtube.title'),
      description: t('youtube.description'),
      keywords: [
        'YouTube money calculator',
        'YouTube earnings calculator',
        'YouTube ad revenue calculator',
        'YouTube monetization calculator',
        'YouTube CPM calculator',
        'YouTube sponsored video pricing',
        'YouTube channel earnings',
        'YouTube subscriber earnings',
        'calculate YouTube earnings',
        'YouTube partnership earnings'
      ],
      ogImage: '/images/og-youtube-calculator.jpg'
    }
  };

  const config = platformConfig[platform];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tiktokmoneycalculator.com';
  const finalCanonicalUrl = canonicalUrl || `${siteUrl}/${platform}-calculator`;

  // Generate structured data
  const calculatorStructuredData = generateCalculatorStructuredData(
    platform,
    config.title,
    config.description,
    finalCanonicalUrl
  );

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: siteUrl },
    { name: 'Calculator', url: `${siteUrl}/calculator` },
    { name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Calculator`, url: finalCanonicalUrl }
  ]);

  // Combine structured data
  const combinedStructuredData = [calculatorStructuredData, breadcrumbStructuredData];

  // Generate alternate URLs for different locales
  const alternateUrls: { [locale: string]: string } = {
    'en': `${siteUrl}/${platform}-calculator`,
    'zh': `${siteUrl}/zh/${platform}-calculator`,
    'ja': `${siteUrl}/ja/${platform}-calculator`,
    'ko': `${siteUrl}/ko/${platform}-calculator`,
    'es': `${siteUrl}/es/${platform}-calculator`,
    'fr': `${siteUrl}/fr/${platform}-calculator`,
    'de': `${siteUrl}/de/${platform}-calculator`,
    'ar': `${siteUrl}/ar/${platform}-calculator`,
  };

  return (
    <SEOHead
      title={config.title}
      description={config.description}
      keywords={config.keywords}
      canonicalUrl={finalCanonicalUrl}
      ogImage={config.ogImage}
      ogType="calculator"
      structuredData={combinedStructuredData}
      locale={locale}
      alternateUrls={alternateUrls}
    />
  );
}

// SEO-optimized content components
export function CalculatorPageContent({ platform }: { platform: string }) {
  const t = useTranslations('seo.content');
  
  return (
    <div className="seo-content">
      {/* H1 with primary keyword */}
      <h1 className="sr-only">
        {platform === 'tiktok' && 'Free TikTok Money Calculator - Estimate Your Earnings'}
        {platform === 'instagram' && 'Instagram Earnings Calculator - Calculate Your Influencer Income'}
        {platform === 'youtube' && 'YouTube Revenue Calculator - Estimate Your Channel Earnings'}
      </h1>
      
      {/* SEO-friendly description */}
      <div className="hidden">
        <h2>How to Use the {platform.charAt(0).toUpperCase() + platform.slice(1)} Earnings Calculator</h2>
        <p>
          Our {platform} money calculator helps content creators estimate their potential earnings 
          from brand partnerships, sponsored content, and platform monetization programs. 
          Simply enter your follower count, engagement rate, and content niche to get 
          personalized earnings estimates.
        </p>
        
        <h3>What You Can Calculate</h3>
        <ul>
          <li>Monthly earnings potential</li>
          <li>Per-post sponsored content rates</li>
          <li>Brand partnership pricing</li>
          <li>Platform-specific monetization income</li>
          <li>Engagement rate optimization tips</li>
        </ul>
        
        <h3>Why Use Our Calculator</h3>
        <p>
          Get accurate earnings estimates based on real industry data and current market rates. 
          Our calculator considers multiple factors including engagement rate, content niche, 
          audience location, and platform-specific monetization opportunities.
        </p>
      </div>
    </div>
  );
}

// FAQ component with structured data
export function CalculatorFAQ({ platform }: { platform: string }) {
  const t = useTranslations('seo.faq');
  
  const faqs = [
    {
      question: `How much do ${platform} creators earn per post?`,
      answer: `${platform.charAt(0).toUpperCase() + platform.slice(1)} creator earnings vary widely based on follower count, engagement rate, and niche. Our calculator provides personalized estimates based on current market rates.`
    },
    {
      question: `How accurate is the ${platform} earnings calculator?`,
      answer: `Our calculator uses real industry data and current market rates to provide estimates within a reasonable range. Actual earnings may vary based on individual circumstances and market conditions.`
    },
    {
      question: `What factors affect ${platform} creator earnings?`,
      answer: `Key factors include follower count, engagement rate, content niche, audience demographics, posting frequency, and current market demand for your content category.`
    }
  ];

  return (
    <div className="faq-section hidden">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index}>
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
