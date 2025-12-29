import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { PostMeta, CATEGORIES, ORIGINAL_SOURCES, OriginalSource } from '@/lib/types';
import { formatDateShort, getReadingTimeText, getCategoryClass, cn } from '@/lib/utils';

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const category = CATEGORIES[post.category];

  return (
    <article
      className={cn(
        'group neu-card hover:bg-card-hover transition-all duration-300',
        featured && 'md:col-span-2 md:grid md:grid-cols-2 md:gap-6'
      )}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className={cn('relative overflow-hidden rounded-xl mb-4', featured && 'md:mb-0')}>
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={post.coverImage}
              alt={post.title}
              width={featured ? 600 : 400}
              height={featured ? 400 : 250}
              className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        </div>
      )}

      {/* Content */}
      <div className={cn('flex flex-col', featured && 'justify-center')}>
        {/* Category */}
        <Link
          href={`/categories/${post.category}`}
          className={cn(getCategoryClass(post.category), 'self-start mb-3')}
        >
          {category.label}
        </Link>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2
            className={cn(
              'font-display font-semibold text-foreground group-hover:text-accent-primary transition-colors',
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            )}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="mt-3 text-foreground-muted line-clamp-3">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-sm text-foreground-muted">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDateShort(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {getReadingTimeText(post.readingTime)}
          </span>
          {post.originalSource && (
            <span className="text-xs">
              {post.originalSource === 'jessealton' ? (
                <span className="text-accent-primary">Original</span>
              ) : (
                <span>
                  via{' '}
                  <span className="text-accent-primary">
                    {ORIGINAL_SOURCES[post.originalSource as OriginalSource]?.label || post.originalSource}
                  </span>
                </span>
              )}
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-xs px-2 py-1 rounded-md bg-background-elevated text-foreground-muted hover:text-foreground transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Read more */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 mt-4 text-accent-primary font-medium group-hover:gap-2 transition-all"
        >
          Read more
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

