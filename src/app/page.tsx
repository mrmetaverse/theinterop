import { getPostCountByCategory, getLatestPosts } from '@/lib/posts';
import HomeClient from './home-client';

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
