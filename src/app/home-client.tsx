'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/ui/PostCard';
import CategoryCard from '@/components/ui/CategoryCard';
import SubscribeForm from '@/components/ui/SubscribeForm';
import { Category, CATEGORIES, PostMeta } from '@/lib/types';

// Dynamically import Three.js scene (client-side only)
const InteropScene = dynamic(() => import('@/components/three/InteropScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent-primary/10" />,
});

interface HomeClientProps {
  featuredPost?: PostMeta;
  latestPosts: PostMeta[];
  categoryCounts: Record<Category, number>;
}

export default function HomeClient({ featuredPost, latestPosts, categoryCounts }: HomeClientProps) {
  const [visualsEnabled, setVisualsEnabled] = useState(true);

  return (
    <>
      <Header onToggleVisuals={() => setVisualsEnabled(!visualsEnabled)} visualsEnabled={visualsEnabled} />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <InteropScene enabled={visualsEnabled} />

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-32 text-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card text-foreground-muted text-sm font-medium shadow-neu-sm mb-8">
                <Sparkles className="w-4 h-4 text-accent-primary" />
                Content for Builders, Founders, and Funders
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight">
                <span className="text-foreground">The</span>{' '}
                <span className="text-gradient">Interop</span>
              </h1>

              <p className="mt-6 text-xl sm:text-2xl text-foreground-muted max-w-3xl mx-auto">
                Weekly insights at the intersection of AI, business transformation, and emerging technology—from the frontlines of real-world implementation.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/blog" className="neu-button-primary">
                  Read the Latest
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/subscribe" className="neu-button">
                  Subscribe
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-foreground-muted/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 rounded-full bg-foreground-muted/50 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-20 bg-background-elevated">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-bold text-foreground">Latest</h2>
                <Link href="/blog" className="flex items-center gap-1 text-accent-primary font-medium hover:gap-2 transition-all">
                  View all posts
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <PostCard post={featuredPost} featured />
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-background-elevated">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">Explore Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {(Object.keys(CATEGORIES) as Category[]).map((category) => (
                <CategoryCard key={category} category={category} postCount={categoryCounts[category]} />
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Stay in the Loop</h2>
            <p className="text-foreground-muted mb-8">
              Get weekly insights on AI strategy, agent development, and emerging tech delivered straight to your inbox.
            </p>
            <SubscribeForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

