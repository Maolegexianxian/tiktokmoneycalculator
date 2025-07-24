import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tiktokmoneycalculator.com';

// Supported locales
const LOCALES = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];

// Supported platforms
const PLATFORMS = ['tiktok', 'instagram', 'youtube'];

// Static pages
const STATIC_PAGES = [
  '',
  '/calculator',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
  '/blog',
  '/faq',
  '/features',
  '/how-it-works',
];

// Blog posts (in a real app, this would come from a CMS or database)
const BLOG_POSTS = [
  'tiktok-creator-earnings-guide-2024',
  'instagram-influencer-rates-2024',
  'youtube-monetization-strategies',
  'social-media-creator-economy-trends',
  'brand-partnership-negotiation-tips',
  'content-creator-tax-guide',
  'building-personal-brand-social-media',
  'creator-fund-vs-brand-deals',
  'micro-influencer-earning-potential',
  'platform-comparison-creators',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // Add static pages for each locale
  LOCALES.forEach(locale => {
    STATIC_PAGES.forEach(page => {
      const url = locale === 'en' 
        ? `${SITE_URL}${page}`
        : `${SITE_URL}/${locale}${page}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: getPriority(page),
        alternates: {
          languages: getAlternateLanguages(page),
        },
      });
    });
  });

  // Add platform-specific calculator pages
  LOCALES.forEach(locale => {
    PLATFORMS.forEach(platform => {
      const url = locale === 'en'
        ? `${SITE_URL}/calculator?platform=${platform}`
        : `${SITE_URL}/${locale}/calculator?platform=${platform}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: getAlternateLanguages(`/calculator?platform=${platform}`),
        },
      });
    });
  });

  // Add blog posts for each locale
  LOCALES.forEach(locale => {
    BLOG_POSTS.forEach(post => {
      const url = locale === 'en'
        ? `${SITE_URL}/blog/${post}`
        : `${SITE_URL}/${locale}/blog/${post}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: getAlternateLanguages(`/blog/${post}`),
        },
      });
    });
  });

  // Add category pages
  const CATEGORIES = [
    'tiktok-tips',
    'instagram-growth',
    'youtube-strategies',
    'creator-economy',
    'monetization',
    'brand-partnerships',
  ];

  LOCALES.forEach(locale => {
    CATEGORIES.forEach(category => {
      const url = locale === 'en'
        ? `${SITE_URL}/blog/category/${category}`
        : `${SITE_URL}/${locale}/blog/category/${category}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: getAlternateLanguages(`/blog/category/${category}`),
        },
      });
    });
  });

  // Add tool pages
  const TOOLS = [
    'engagement-calculator',
    'growth-tracker',
    'earnings-comparison',
    'roi-calculator',
  ];

  LOCALES.forEach(locale => {
    TOOLS.forEach(tool => {
      const url = locale === 'en'
        ? `${SITE_URL}/tools/${tool}`
        : `${SITE_URL}/${locale}/tools/${tool}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: getAlternateLanguages(`/tools/${tool}`),
        },
      });
    });
  });

  return sitemap;
}

function getPriority(page: string): number {
  switch (page) {
    case '':
      return 1.0;
    case '/calculator':
      return 0.9;
    case '/about':
    case '/features':
    case '/how-it-works':
      return 0.8;
    case '/blog':
    case '/faq':
      return 0.7;
    case '/privacy':
    case '/terms':
    case '/contact':
      return 0.5;
    default:
      return 0.6;
  }
}

function getAlternateLanguages(page: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  
  LOCALES.forEach(locale => {
    if (locale === 'en') {
      alternates[locale] = `${SITE_URL}${page}`;
    } else {
      alternates[locale] = `${SITE_URL}/${locale}${page}`;
    }
  });
  
  return alternates;
}

// Generate robots.txt content
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /uploads/

# Allow specific API endpoints that should be indexed
Allow: /api/og/

# Block common bot traps
Disallow: /*?*utm_*
Disallow: /*?*ref=*
Disallow: /*?*fbclid=*
Disallow: /*?*gclid=*

# Block duplicate content
Disallow: /*?sort=*
Disallow: /*?filter=*
Disallow: /*?page=*

# Allow important query parameters
Allow: /*?platform=*
Allow: /*?locale=*`;
}
