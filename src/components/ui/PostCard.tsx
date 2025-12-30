import Link from 'next/link';
import Image from 'next/image';
import { PostMeta, CATEGORIES, ORIGINAL_SOURCES, OriginalSource } from '@/lib/types';

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const category = CATEGORIES[post.category];
  const source = post.originalSource && post.originalSource !== 'jessealton' 
    ? ORIGINAL_SOURCES[post.originalSource as OriginalSource]?.label 
    : null;

  if (featured) {
    return (
      <article className="group grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cover Image */}
        {post.coverImage && (
          <Link href={`/blog/${post.slug}`} className="block">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={600}
              height={400}
              className="w-full h-64 md:h-full object-cover"
            />
          </Link>
        )}

        {/* Content */}
        <div className="flex flex-col justify-center">
          <span className="category-label">{category.label}</span>
          <Link href={`/blog/${post.slug}`}>
            <h2 className="article-headline text-3xl md:text-4xl mt-2 mb-4 leading-tight">
              {post.title}
            </h2>
          </Link>
          <p className="article-excerpt text-lg mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="article-meta flex flex-wrap items-center gap-2">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            {source && (
              <>
                <span>·</span>
                <span className="text-accent-primary">via {source}</span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group">
      {/* Cover Image */}
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className="block mb-4">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}

      {/* Content */}
      <span className="category-label">{category.label}</span>
      <Link href={`/blog/${post.slug}`}>
        <h3 className="article-headline text-xl md:text-2xl mt-1 mb-2 leading-tight">
          {post.title}
        </h3>
      </Link>
      <p className="article-excerpt text-sm mb-3 line-clamp-2">
        {post.excerpt}
      </p>
      <div className="article-meta flex flex-wrap items-center gap-2">
        <span>{formatDate(post.date)}</span>
        <span>·</span>
        <span>{post.readingTime} min</span>
        {source && (
          <>
            <span>·</span>
            <span className="text-accent-primary">via {source}</span>
          </>
        )}
      </div>
    </article>
  );
}
