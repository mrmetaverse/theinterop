import { Metadata } from 'next';
import { Suspense } from 'react';
import { Linkedin, Mail, Rss, Globe } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SubscribeForm from '@/components/ui/SubscribeForm';
import { SubscribeStatus } from './subscribe-client';
import { siteConfig } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Subscribe | AI Newsletter',
  description: 'Subscribe to The Interop newsletter for weekly insights on AI strategy, agent development, and emerging technology from Jesse Alton. Join founders and builders implementing AI.',
  keywords: ['AI newsletter', 'AI strategy newsletter', 'Jesse Alton newsletter', 'AI updates'],
  openGraph: {
    title: 'Subscribe | The Interop by Jesse Alton',
    description: 'Weekly insights on AI strategy, agent development, and emerging technology for founders and builders.',
    url: `${siteConfig.url}/subscribe`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteConfig.url}/subscribe`,
  },
};

const otherWays = [
  {
    name: 'RSS Feed',
    description: 'Add The Interop to your favorite RSS reader',
    href: '/rss.xml',
    icon: Rss,
    external: false,
  },
  {
    name: 'alton.tech',
    description: 'Technical bio and all current projects',
    href: 'https://alton.tech',
    icon: Globe,
    external: true,
  },
  {
    name: 'LinkedIn',
    description: 'Connect for professional updates and insights',
    href: 'https://linkedin.com/in/mrmetaverse',
    icon: Linkedin,
    external: true,
  },
];

export default function SubscribePage() {
  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Status Messages */}
          <Suspense fallback={null}>
            <SubscribeStatus />
          </Suspense>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-accent text-white mb-6 shadow-neu">
              <Mail className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              Subscribe to The Interop
            </h1>
            <p className="text-xl text-foreground-muted max-w-xl mx-auto">
              Get weekly insights on AI strategy, agent development, and emerging technology delivered straight to your inbox.
            </p>
          </div>

          {/* Subscribe Form */}
          <div className="neu-card mb-12">
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              Join the Newsletter
            </h2>
            <p className="text-foreground-muted mb-6">
              Every week, I share practical insights from the trenches of AI implementation. No fluff, no hype—just actionable knowledge you can use.
            </p>
            <SubscribeForm />
            <p className="mt-4 text-sm text-foreground-muted text-center">
              No spam, ever. Unsubscribe with one click.
            </p>
          </div>

          {/* What to Expect */}
          <div className="neu-card mb-12">
            <h2 className="text-xl font-display font-semibold text-foreground mb-6">
              What to Expect
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <strong className="text-foreground">Practical AI Strategy</strong>
                  <p className="text-foreground-muted text-sm mt-1">
                    Frameworks and approaches that work in the real world, not just in research papers.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <strong className="text-foreground">Implementation Insights</strong>
                  <p className="text-foreground-muted text-sm mt-1">
                    Lessons learned from 100+ AI projects across government and commercial sectors.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <strong className="text-foreground">Emerging Tech Analysis</strong>
                  <p className="text-foreground-muted text-sm mt-1">
                    Breaking down what matters in AI, agents, and digital transformation.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <div>
                  <strong className="text-foreground">Weekly Consistency</strong>
                  <p className="text-foreground-muted text-sm mt-1">
                    One thoughtful email per week. No daily bombardment.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Other Ways to Follow */}
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-6 text-center">
              Other Ways to Follow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherWays.map((way) => (
                <a
                  key={way.name}
                  href={way.href}
                  target={way.external ? '_blank' : undefined}
                  rel={way.external ? 'noopener noreferrer' : undefined}
                  className="neu-card-sm group flex items-start gap-4 hover:bg-card-hover transition-all"
                >
                  <div className="p-2 rounded-lg bg-background-elevated group-hover:bg-accent-primary group-hover:text-white transition-colors">
                    <way.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-accent-primary transition-colors">
                      {way.name}
                    </h3>
                    <p className="text-sm text-foreground-muted">{way.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

