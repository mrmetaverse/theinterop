import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/ui/PostCard';
import CategoryNav from '@/components/ui/CategoryNav';
import { getPostsByCategory } from '@/lib/posts';
import { siteConfig, Category, CATEGORIES } from '@/lib/types';

// Special categories that have their own dedicated pages
const SPECIAL_CATEGORY_REDIRECTS: Record<string, string> = {
  'media': '/media',
  'from-the-press': '/press',
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  // Only generate static params for regular categories (not special ones)
  return Object.keys(CATEGORIES)
    .filter(cat => !SPECIAL_CATEGORY_REDIRECTS[cat])
    .map((category) => ({
      category,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

  if (!Object.keys(CATEGORIES).includes(categorySlug)) {
    return { title: 'Category Not Found' };
  }

  const category = CATEGORIES[categorySlug as Category];
  const categoryUrl = `${siteConfig.url}/categories/${categorySlug}`;

  return {
    title: `${category.label} | AI Articles by Jesse Alton`,
    description: `${category.description} Expert insights and practical guides from Jesse Alton on The Interop.`,
    openGraph: {
      title: `${category.label} | The Interop by Jesse Alton`,
      description: category.description,
      url: categoryUrl,
      type: 'website',
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // Redirect special categories to their dedicated pages
  if (SPECIAL_CATEGORY_REDIRECTS[categorySlug]) {
    redirect(SPECIAL_CATEGORY_REDIRECTS[categorySlug]);
  }

  if (!Object.keys(CATEGORIES).includes(categorySlug)) {
    notFound();
  }

  const category = CATEGORIES[categorySlug as Category];
  const posts = getPostsByCategory(categorySlug as Category);

  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="container-editorial">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              {category.label}
            </h1>
            <p className="text-lg text-foreground-muted max-w-2xl">
              {category.description}
            </p>
            <p className="mt-2 text-sm text-foreground-subtle">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>

          {/* Category Navigation */}
          <CategoryNav activeCategory={categorySlug as Category} />

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="editorial-card text-center py-12">
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
