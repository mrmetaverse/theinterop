import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/ui/PostCard';
import CategoryNav from '@/components/ui/CategoryNav';
import { getAllPostsMeta } from '@/lib/posts';
import { siteConfig } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Blog | AI Strategy & Agent Development Articles',
  description: 'Articles on AI strategy, AI agents, LangChain, business transformation, and emerging technology by Jesse Alton. Practical insights for building production AI systems.',
  keywords: ['AI blog', 'AI strategy articles', 'agent development', 'LangChain tutorials', 'AI implementation', 'business AI'],
  openGraph: {
    title: 'Blog | The Interop by Jesse Alton',
    description: 'Explore articles on AI strategy, agent development, and business transformation. Weekly insights for founders and builders.',
    url: `${siteConfig.url}/blog`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="container-editorial">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              Blog
            </h1>
            <p className="text-lg text-foreground-muted max-w-2xl">
              Insights and analysis at the intersection of AI, business transformation, and emerging technology.
            </p>
            <p className="mt-2 text-sm text-foreground-subtle">
              {posts.length} articles
            </p>
          </div>

          {/* Category Navigation */}
          <CategoryNav activeCategory="all" />

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
