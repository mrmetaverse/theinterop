import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/ui/PostCard';
import { getPostsByTag } from '@/lib/posts';
import { siteConfig } from '@/lib/types';

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `#${decodedTag}`,
    description: `Articles tagged with "${decodedTag}"`,
    openGraph: {
      title: `#${decodedTag} | ${siteConfig.name}`,
      description: `Articles tagged with "${decodedTag}"`,
      url: `${siteConfig.url}/tags/${tag}`,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Posts
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-accent text-white">
                <Tag className="w-6 h-6" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground">
                #{decodedTag}
              </h1>
            </div>
            <p className="text-xl text-foreground-muted">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged with &ldquo;{decodedTag}&rdquo;
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="neu-card text-center py-12">
              <p className="text-foreground-muted">
                No articles with this tag yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
