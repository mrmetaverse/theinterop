import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category, CATEGORIES } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  postCount?: number;
}

const categoryIcons: Record<Category, string> = {
  'ai-strategy': '🎯',
  'business-transformation': '🚀',
  'agent-development': '🤖',
  'future-tech': '🔮',
  'case-studies': '📊',
};

export default function CategoryCard({ category, postCount }: CategoryCardProps) {
  const { label, description, color } = CATEGORIES[category];
  const icon = categoryIcons[category];

  return (
    <Link href={`/categories/${category}`} className="block group">
      <article className="neu-card h-full hover:bg-card-hover transition-all duration-300">
        {/* Icon */}
        <div className="text-4xl mb-4">{icon}</div>

        {/* Label */}
        <h3 className="font-display font-semibold text-xl text-foreground group-hover:text-accent-primary transition-colors">
          {label}
        </h3>

        {/* Description */}
        <p className="mt-2 text-foreground-muted text-sm">{description}</p>

        {/* Post count */}
        {postCount !== undefined && (
          <p className="mt-4 text-sm text-foreground-muted">
            {postCount} {postCount === 1 ? 'article' : 'articles'}
          </p>
        )}

        {/* Arrow */}
        <div className="flex items-center gap-1 mt-4 text-accent-primary font-medium text-sm group-hover:gap-2 transition-all">
          Explore
          <ArrowRight className="w-4 h-4" />
        </div>
      </article>
    </Link>
  );
}

