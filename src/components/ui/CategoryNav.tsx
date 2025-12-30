import Link from 'next/link';
import { Category, CATEGORIES } from '@/lib/types';

interface CategoryNavProps {
  activeCategory?: Category | 'all';
}

export default function CategoryNav({ activeCategory = 'all' }: CategoryNavProps) {
  const categories = Object.keys(CATEGORIES) as Category[];

  return (
    <nav className="flex flex-wrap gap-2 mb-8" aria-label="Category filters">
      {/* All Posts */}
      <Link
        href="/blog"
        className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
          activeCategory === 'all'
            ? 'bg-foreground text-background border-foreground'
            : 'bg-transparent text-foreground-muted border-border hover:border-foreground hover:text-foreground'
        }`}
      >
        All Posts
      </Link>

      {/* Category links */}
      {categories.map((category) => (
        <Link
          key={category}
          href={`/categories/${category}`}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
            activeCategory === category
              ? 'bg-foreground text-background border-foreground'
              : 'bg-transparent text-foreground-muted border-border hover:border-foreground hover:text-foreground'
          }`}
        >
          {CATEGORIES[category].label}
        </Link>
      ))}
    </nav>
  );
}
