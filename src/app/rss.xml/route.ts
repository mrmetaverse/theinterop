import { Feed } from 'feed';
import { getAllPostsMeta } from '@/lib/posts';
import { siteConfig, CATEGORIES } from '@/lib/types';

export async function GET() {
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: 'en',
    image: siteConfig.ogImage,
    favicon: `${siteConfig.url}/images/logo.png`,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author.name}. All rights reserved.`,
    updated: new Date(),
    generator: 'The Interop by Jesse Alton',
    feedLinks: {
      rss2: `${siteConfig.url}/rss.xml`,
    },
    author: {
      name: siteConfig.author.name,
      email: siteConfig.author.email,
      link: 'https://alton.tech',
    },
  });

  const posts = getAllPostsMeta();

  posts.forEach((post) => {
    const categoryLabel = CATEGORIES[post.category]?.label || post.category;
    const categories = [{ name: categoryLabel }];
    
    // Add tags as categories
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach((tag) => categories.push({ name: tag }));
    }

    feed.addItem({
      title: post.title,
      id: `${siteConfig.url}/blog/${post.slug}`,
      link: `${siteConfig.url}/blog/${post.slug}`,
      description: post.excerpt,
      content: post.excerpt, // RSS readers show this in preview
      date: new Date(post.date),
      image: post.coverImage || siteConfig.ogImage,
      author: [
        {
          name: siteConfig.author.name,
          email: siteConfig.author.email,
          link: 'https://alton.tech',
        },
      ],
      category: categories,
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
