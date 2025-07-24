import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { SEOHead, generateBreadcrumbStructuredData } from '../seo/SEOHead';

interface BlogPostProps {
  title: string;
  description: string;
  content: ReactNode;
  author?: string;
  publishDate?: string;
  readTime?: number;
  tags?: string[];
  category?: string;
  slug: string;
  locale?: string;
  featuredImage?: string;
}

export function BlogPost({
  title,
  description,
  content,
  author = 'TikTok Money Calculator Team',
  publishDate,
  readTime = 5,
  tags = [],
  category = 'Creator Economy',
  slug,
  locale = 'en',
  featuredImage
}: BlogPostProps) {
  const t = useTranslations('blog');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tiktokmoneycalculator.com';
  const postUrl = `${siteUrl}/blog/${slug}`;

  // Generate structured data for blog post
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "TikTok Money Calculator",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`
      }
    },
    "datePublished": publishDate,
    "dateModified": publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    ...(featuredImage && {
      "image": {
        "@type": "ImageObject",
        "url": featuredImage,
        "width": 1200,
        "height": 630
      }
    }),
    "articleSection": category,
    "keywords": tags.join(', ')
  };

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: title, url: postUrl }
  ]);

  const combinedStructuredData = [articleStructuredData, breadcrumbStructuredData];

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        keywords={tags}
        canonicalUrl={postUrl}
        ogImage={featuredImage || ''}
        ogType="article"
        structuredData={combinedStructuredData}
        locale={locale}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {category}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {description}
          </p>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            
            {publishDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(publishDate).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime} min read</span>
            </div>
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <Separator className="mt-6" />
        </header>
        
        {/* Featured Image */}
        {featuredImage && (
          <div className="mb-8">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {content}
        </div>
        
        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Published by {author}
              </p>
              {publishDate && (
                <p className="text-xs text-muted-foreground">
                  {new Date(publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
            
            {/* Share buttons could go here */}
          </div>
        </footer>
      </article>
    </>
  );
}

// Pre-built blog post components for common topics
export function TikTokEarningsGuide() {
  const t = useTranslations('blog.guides.tiktokEarnings');
  
  return (
    <BlogPost
      title="How Much Do TikTok Creators Actually Earn? Complete 2024 Guide"
      description="Discover real TikTok creator earnings data, from nano-influencers to mega-stars. Learn how follower count, engagement rate, and niche affect your earning potential."
      slug="tiktok-creator-earnings-guide-2024"
      category="Creator Economy"
      tags={[
        'TikTok earnings',
        'influencer marketing',
        'creator economy',
        'social media monetization',
        'TikTok Creator Fund'
      ]}
      readTime={8}
      publishDate={new Date().toISOString()}
      featuredImage="/images/blog/tiktok-earnings-guide.jpg"
      content={
        <div>
          <h2>TikTok Creator Earnings by Follower Count</h2>
          <p>
            TikTok creator earnings vary significantly based on follower count, engagement rate, 
            and monetization strategies. Here's what creators typically earn across different tiers:
          </p>
          
          <h3>Nano-Influencers (1K-10K followers)</h3>
          <ul>
            <li>Sponsored posts: $5-$25 per post</li>
            <li>Creator Fund: $0.02-$0.04 per 1,000 views</li>
            <li>Live gifts: $1-$10 per stream</li>
          </ul>
          
          <h3>Micro-Influencers (10K-100K followers)</h3>
          <ul>
            <li>Sponsored posts: $25-$125 per post</li>
            <li>Brand partnerships: $100-$500 per campaign</li>
            <li>Affiliate marketing: $50-$200 per month</li>
          </ul>
          
          <h3>Mid-Tier Creators (100K-1M followers)</h3>
          <ul>
            <li>Sponsored posts: $125-$1,250 per post</li>
            <li>Brand partnerships: $500-$5,000 per campaign</li>
            <li>Monthly earnings: $1,000-$10,000</li>
          </ul>
          
          <h2>Factors That Affect TikTok Earnings</h2>
          <p>
            Several key factors determine how much TikTok creators can earn:
          </p>
          
          <h3>1. Engagement Rate</h3>
          <p>
            High engagement rates (likes, comments, shares) are more valuable than follower count alone. 
            Brands prefer creators with engaged audiences over those with large but passive followings.
          </p>
          
          <h3>2. Content Niche</h3>
          <p>
            Some niches command higher rates due to advertiser demand:
          </p>
          <ul>
            <li>Finance & Business: Premium rates</li>
            <li>Beauty & Fashion: High demand</li>
            <li>Technology: Good rates</li>
            <li>Entertainment: Variable rates</li>
          </ul>
          
          <h3>3. Audience Demographics</h3>
          <p>
            Creators with audiences in high-value markets (US, UK, Canada, Australia) 
            typically earn more than those with audiences in developing markets.
          </p>
          
          <h2>How to Increase Your TikTok Earnings</h2>
          <p>
            Use our TikTok money calculator to estimate your current earning potential, 
            then focus on these strategies to increase your income:
          </p>
          
          <ol>
            <li>Improve your engagement rate by creating more interactive content</li>
            <li>Post consistently to maintain audience growth</li>
            <li>Diversify your revenue streams beyond sponsored posts</li>
            <li>Build relationships with brands in your niche</li>
            <li>Consider expanding to other platforms for cross-promotion</li>
          </ol>
          
          <p>
            Ready to calculate your TikTok earning potential? Try our free calculator to get 
            personalized estimates based on your current metrics.
          </p>
        </div>
      }
    />
  );
}
