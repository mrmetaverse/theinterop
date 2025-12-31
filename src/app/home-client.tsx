'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Category, CATEGORIES, PostMeta, ORIGINAL_SOURCES, OriginalSource } from '@/lib/types';

interface HomeClientProps {
  featuredPost?: PostMeta;
  latestPosts: PostMeta[];
  categoryCounts: Record<Category, number>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function ArticleCard({ post, size = 'medium' }: { post: PostMeta; size?: 'large' | 'medium' | 'small' }) {
  const source = post.originalSource && post.originalSource !== 'jessealton' 
    ? ORIGINAL_SOURCES[post.originalSource as OriginalSource]?.label 
    : null;

  if (size === 'large') {
    // Check if we have a cover image and if it has a video version
    const videoSrc = post.coverImage?.replace('.gif', '.mp4');
    const hasVideo = post.coverImage?.endsWith('.gif') && videoSrc;
    
    return (
      <article className="group">
        <Link href={`/blog/${post.slug}`} className="block">
          {post.coverImage && (
            <div className="mb-4 rounded-lg overflow-hidden">
              {hasVideo ? (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full"
                >
                  <source src={videoSrc} type="video/mp4" />
                  <img src={post.coverImage} alt={post.title} className="w-full" />
                </video>
              ) : (
                <img src={post.coverImage} alt={post.title} className="w-full" />
              )}
            </div>
          )}
          <span className="category-label">{CATEGORIES[post.category].label}</span>
          <h2 className="article-headline text-4xl md:text-5xl mt-2 mb-4 leading-tight">
            {post.title}
          </h2>
          <p className="article-excerpt text-lg mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="article-meta flex items-center gap-3">
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
        </Link>
      </article>
    );
  }

  if (size === 'small') {
    return (
      <article className="group py-4 border-b border-border last:border-b-0">
        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="article-headline text-base leading-snug mb-1">
            {post.title}
          </h3>
          <span className="article-meta">{formatDate(post.date)}</span>
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <span className="category-label">{CATEGORIES[post.category].label}</span>
        <h3 className="article-headline text-xl md:text-2xl mt-1 mb-2 leading-tight">
          {post.title}
        </h3>
        <p className="article-excerpt text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="article-meta flex items-center gap-2">
          <span>{formatDate(post.date)}</span>
          {source && (
            <>
              <span>·</span>
              <span className="text-accent-primary">via {source}</span>
            </>
          )}
        </div>
      </Link>
    </article>
  );
}

export default function HomeClient({ featuredPost, latestPosts, categoryCounts }: HomeClientProps) {
  const [, setVisualsEnabled] = useState(false);

  // All posts for the sidebar
  const allRecentPosts = featuredPost ? [featuredPost, ...latestPosts] : latestPosts;

  return (
    <>
      <Header onToggleVisuals={() => setVisualsEnabled(v => !v)} visualsEnabled={false} />

      <main className="pt-20">
        {/* Masthead */}
        <div className="border-b-2 border-foreground">
          <div className="container-editorial py-8 text-center">
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight">
              The Interop
            </h1>
            <p className="mt-2 font-sans text-xs tracking-widest uppercase text-foreground-muted">
              AI Strategy · Agent Development · Business Transformation
            </p>
            <p className="mt-1 font-sans text-xs text-foreground-muted">
              by Jesse Alton
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="container-editorial py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-8">
              {/* Lead Story */}
              {featuredPost && (
                <div className="pb-8 border-b border-border">
                  <ArticleCard post={featuredPost} size="large" />
                </div>
              )}

              {/* Secondary Stories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-border">
                {latestPosts.slice(0, 2).map((post) => (
                  <ArticleCard key={post.slug} post={post} size="medium" />
                ))}
              </div>

              {/* Third Row */}
              {latestPosts.length > 2 && (
                <div className="py-8">
                  <ArticleCard post={latestPosts[2]} size="medium" />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 lg:border-l lg:border-border lg:pl-8">
              {/* Latest Section */}
              <div className="mb-8">
                <h2 className="section-header">Latest</h2>
                <div>
                  {allRecentPosts.slice(0, 5).map((post) => (
                    <ArticleCard key={post.slug} post={post} size="small" />
                  ))}
                </div>
                <Link 
                  href="/blog" 
                  className="inline-block mt-4 font-sans text-xs font-semibold tracking-wider uppercase text-accent-primary hover:underline"
                >
                  View All Articles →
                </Link>
              </div>

              {/* Topics Section */}
              <div className="mb-8">
                <h2 className="section-header">Topics</h2>
                <div className="space-y-3">
                  {(Object.keys(CATEGORIES) as Category[])
                    .filter(cat => cat !== 'media' && cat !== 'from-the-press')
                    .map((category) => (
                      <Link
                        key={category}
                        href={`/categories/${category}`}
                        className="flex items-center justify-between py-2 border-b border-border-subtle hover:border-foreground transition-colors"
                      >
                        <span className="font-sans text-sm font-medium">
                          {CATEGORIES[category].label}
                        </span>
                        <span className="font-sans text-xs text-foreground-muted">
                          {categoryCounts[category]} articles
                        </span>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Subscribe Box */}
              <div className="p-6 bg-background-elevated border border-border">
                <h3 className="font-display text-xl font-bold mb-2">Stay Informed</h3>
                <p className="font-sans text-sm text-foreground-muted mb-4">
                  Weekly insights on AI strategy and emerging technology.
                </p>
                <Link href="/subscribe" className="btn-editorial-primary w-full justify-center">
                  Subscribe
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom Section - About */}
        <div className="border-t-2 border-foreground">
          <div className="container-editorial py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="section-header">About The Interop</h2>
                <p className="font-body text-foreground-muted leading-relaxed">
                  The Interop explores the intersection of AI, business transformation, and emerging technology. 
                  Written by Jesse Alton, founder of Virgent AI, it offers practical insights for founders, 
                  executives, and builders implementing AI in production.
                </p>
                <Link href="/about" className="inline-block mt-4 font-sans text-xs font-semibold tracking-wider uppercase text-accent-primary hover:underline">
                  Learn More →
                </Link>
              </div>
              <div>
                <h2 className="section-header">Get AI Help</h2>
                <p className="font-body text-foreground-muted leading-relaxed">
                  Need help implementing AI in your business? Virgent AI helps companies move from 
                  AI-curious to AI-powered with practical, production-ready solutions.
                </p>
                <a 
                  href="https://virgent.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 font-sans text-xs font-semibold tracking-wider uppercase text-accent-primary hover:underline"
                >
                  Visit Virgent AI →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
