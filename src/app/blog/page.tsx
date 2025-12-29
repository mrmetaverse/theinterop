import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/ui/PostCard';
import { getAllPostsMeta } from '@/lib/posts';
import { siteConfig, Category, CATEGORIES } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore all posts on AI strategy, business transformation, agent development, and emerging technology.',
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: 'Explore all posts on AI strategy, business transformation, agent development, and emerging technology.',
    url: `${siteConfig.url}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  const categories = Object.keys(CATEGORIES) as Category[];

  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              Blog
            </h1>
            <p className="text-xl text-foreground-muted max-w-2xl">
              Insights and analysis at the intersection of AI, business transformation, and emerging technology.
            </p>
            <p className="mt-2 text-foreground-muted">
              {posts.length} articles
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/blog"
              className="neu-tag bg-accent-primary text-white"
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/categories/${category}`}
                className="neu-tag hover:bg-card-hover transition-colors"
              >
                {CATEGORIES[category].label}
              </Link>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
