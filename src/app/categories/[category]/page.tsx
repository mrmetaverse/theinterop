import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/ui/PostCard';
import { getPostsByCategory } from '@/lib/posts';
import { siteConfig, Category, CATEGORIES } from '@/lib/types';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

  if (!Object.keys(CATEGORIES).includes(categorySlug)) {
    return { title: 'Category Not Found' };
  }

  const category = CATEGORIES[categorySlug as Category];

  return {
    title: category.label,
    description: category.description,
    openGraph: {
      title: `${category.label} | ${siteConfig.name}`,
      description: category.description,
      url: `${siteConfig.url}/categories/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  if (!Object.keys(CATEGORIES).includes(categorySlug)) {
    notFound();
  }

  const category = CATEGORIES[categorySlug as Category];
  const posts = getPostsByCategory(categorySlug as Category);

  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Categories
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              {category.label}
            </h1>
            <p className="text-xl text-foreground-muted max-w-2xl">
              {category.description}
            </p>
            <p className="mt-4 text-foreground-muted">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
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
                No articles in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
