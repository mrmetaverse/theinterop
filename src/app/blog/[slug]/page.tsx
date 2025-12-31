import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SubscribeForm from '@/components/ui/SubscribeForm';
import PostCard from '@/components/ui/PostCard';
import { getPostBySlug, getRelatedPosts, getAllPostsMeta } from '@/lib/posts';
import { siteConfig, CATEGORIES, ORIGINAL_SOURCES, OriginalSource } from '@/lib/types';
import { formatDate, getReadingTimeText, getCategoryClass, absoluteUrl, getSocialImageUrl } from '@/lib/utils';
import { markdownToHtml } from '@/lib/markdown';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPostsMeta();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = getSocialImageUrl(post.coverImage);

  return {
    title: `${post.title} | ${siteConfig.author.name}`,
    description: post.excerpt,
    authors: [{ name: siteConfig.author.name, url: 'https://alton.tech' }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [siteConfig.author.name],
      url: postUrl,
      siteName: siteConfig.name,
      section: CATEGORIES[post.category]?.label,
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/png',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.author.twitter,
      creator: siteConfig.author.twitter,
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        }
      ],
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate Article JSON-LD for blog posts
function generateArticleJsonLd(post: ReturnType<typeof getPostBySlug>) {
  if (!post) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || siteConfig.ogImage,
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: 'https://alton.tech',
      sameAs: [
        siteConfig.links.twitter,
        siteConfig.links.linkedin,
        'https://virgent.ai',
      ],
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/blog/${post.slug}`),
    },
    keywords: post.tags?.join(', '),
    articleSection: CATEGORIES[post.category]?.label,
    wordCount: post.content.split(/\s+/).length,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const category = CATEGORIES[post.category];
  const shareUrl = absoluteUrl(`/blog/${post.slug}`);
  const shareText = encodeURIComponent(post.title);
  const relatedPosts = getRelatedPosts(slug, 2);

  // Convert markdown content to HTML
  const htmlContent = await markdownToHtml(post.content);

  // Generate JSON-LD for this article
  const articleJsonLd = generateArticleJsonLd(post);

  return (
    <>
      {/* Article JSON-LD */}
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      
      <Header />

      <article className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            {/* Category */}
            <Link
              href={`/categories/${post.category}`}
              className={getCategoryClass(post.category)}
            >
              {category.label}
            </Link>

            {/* Title */}
            <h1 className="mt-4 text-4xl sm:text-5xl font-display font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-4 text-xl text-foreground-muted">{post.excerpt}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-foreground-muted">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {getReadingTimeText(post.readingTime)}
              </span>
              <span className="text-foreground font-medium">
                By {siteConfig.author.name}
              </span>
            </div>

            {/* Original Source - Top */}
            {post.originalSource && post.originalSource !== 'jessealton' && (
              <div className="mt-4 text-sm text-foreground-muted">
                Originally published on{' '}
                <a 
                  href={post.canonicalUrl || ORIGINAL_SOURCES[post.originalSource as OriginalSource]?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  {ORIGINAL_SOURCES[post.originalSource as OriginalSource]?.label || post.originalSource}
                </a>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="text-sm px-3 py-1 rounded-lg bg-card text-foreground-muted hover:text-foreground shadow-neu-sm transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div 
            className="prose-interop max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Original Source Attribution */}
          {post.originalSource && (
            <div className="mt-8 p-4 rounded-lg bg-card-hover border border-border-subtle text-sm text-foreground-muted">
              {post.originalSource === 'jessealton' ? (
                <span>📍 Posted directly to jessealton.com</span>
              ) : (
                <span>
                  📍 Originally published on{' '}
                  <a 
                    href={post.canonicalUrl || ORIGINAL_SOURCES[post.originalSource as OriginalSource]?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent-primary hover:underline"
                  >
                    {ORIGINAL_SOURCES[post.originalSource as OriginalSource]?.label || post.originalSource}
                  </a>
                </span>
              )}
            </div>
          )}

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-foreground-muted">
                <Share2 className="w-5 h-5" />
                Share:
              </span>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-foreground-muted hover:text-accent-primary hover:bg-card transition-all"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-foreground-muted hover:text-accent-primary hover:bg-card transition-all"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Author */}
          <div className="mt-8 neu-card">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center text-white text-2xl font-bold">
                JA
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  {siteConfig.author.name}
                </h3>
                <p className="text-foreground-muted mt-1">
                  Founder of Virgent AI and AltonTech. Building the future of AI implementation, one project at a time.
                </p>
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent-primary mt-2 hover:underline"
                >
                  <Twitter className="w-4 h-4" />
                  {siteConfig.author.twitter}
                </a>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </div>
          )}

          {/* Subscribe CTA */}
          <div className="mt-12">
            <SubscribeForm variant="card" />
          </div>

          {/* Navigation */}
          <nav className="mt-12 flex justify-between gap-4">
            <Link
              href="/blog"
              className="neu-button flex-1 justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
              All Posts
            </Link>
          </nav>
        </div>
      </article>

      <Footer />
    </>
  );
}
