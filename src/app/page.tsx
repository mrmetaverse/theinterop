import { Metadata } from 'next';
import { getPostCountByCategory, getLatestPosts } from '@/lib/posts';
import HomeClient from './home-client';
import { siteConfig } from '@/lib/types';

export const metadata: Metadata = {
  title: 'The Interop by Jesse Alton | AI Strategy & Agent Development',
  description: 'AI strategy, agent development, and business transformation insights from Jesse Alton. Practical guides for founders, executives, and builders implementing AI in production.',
  openGraph: {
    title: 'The Interop by Jesse Alton',
    description: 'Weekly insights on AI strategy, agent development, and business transformation for founders, executives, and builders.',
    url: siteConfig.url,
    type: 'website',
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function HomePage() {
  const categoryCounts = getPostCountByCategory();
  
  // Get the 4 most recent posts (sorted by date, newest first)
  // This includes all posts: blog posts, case studies, etc.
  const latestPosts = getLatestPosts(4);
  
  // Latest = the single most recent post (hero card)
  const latestPost = latestPosts[0];
  
  // Featured Posts = the next 3 most recent posts
  const featuredPosts = latestPosts.slice(1, 4);

  return (
    <HomeClient 
      featuredPost={latestPost}
      latestPosts={featuredPosts}
      categoryCounts={categoryCounts}
    />
  );
}
