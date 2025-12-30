import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category, CATEGORIES } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
  postCount?: number;
}

// Special categories that have their own dedicated pages
const specialCategoryUrls: Partial<Record<Category, string>> = {
  'media': '/media',
  'from-the-press': '/press',
};

export default function CategoryCard({ category, postCount }: CategoryCardProps) {
  const { label, description } = CATEGORIES[category];
  const href = specialCategoryUrls[category] || `/categories/${category}`;
  const isSpecialCategory = !!specialCategoryUrls[category];

  return (
    <Link href={href} className="block group">
      <article className="editorial-card h-full">
        {/* Label */}
        <span className={`category-label category-${category}`}>
          {label}
        </span>

        {/* Description */}
        <p className="mt-3 text-foreground-muted text-sm leading-relaxed">{description}</p>

        {/* Post count */}
        {!isSpecialCategory && postCount !== undefined && (
          <p className="mt-4 text-2xl font-display font-bold">
            {postCount}
            <span className="text-sm font-normal text-foreground-subtle ml-1">
              {postCount === 1 ? 'article' : 'articles'}
            </span>
          </p>
        )}

        {/* Arrow */}
        <div className="flex items-center gap-1 mt-4 text-sm font-semibold uppercase tracking-wider group-hover:gap-2 transition-all">
          Explore
          <ArrowRight className="w-4 h-4" />
        </div>
      </article>
    </Link>
  );
}
