import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryCard from '@/components/ui/CategoryCard';
import { getPostCountByCategory } from '@/lib/posts';
import { siteConfig, Category, CATEGORIES } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Categories | AI Topics & Business Transformation',
  description: 'Browse AI articles by topic: AI Strategy, Agent Development, Business Transformation, Case Studies, and Future Tech. Expert insights from Jesse Alton.',
  keywords: ['AI categories', 'AI strategy', 'agent development', 'business transformation', 'case studies', 'AI topics'],
  openGraph: {
    title: 'Categories | The Interop by Jesse Alton',
    description: 'Explore AI content organized by topic - from strategic frameworks to hands-on implementation guides.',
    url: `${siteConfig.url}/categories`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteConfig.url}/categories`,
  },
};

export default function CategoriesPage() {
  const categories = Object.keys(CATEGORIES) as Category[];
  const categoryCounts = getPostCountByCategory();

  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              Categories
            </h1>
            <p className="text-xl text-foreground-muted max-w-2xl">
              Explore content organized by topic. From strategic frameworks to hands-on implementation guides.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category}
                category={category}
                postCount={categoryCounts[category]}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
