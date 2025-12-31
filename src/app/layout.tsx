import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/lib/types';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    // Core topics
    'AI strategy',
    'AI implementation',
    'AI agents',
    'agent development',
    'LangChain',
    'AI consulting',
    // Business terms
    'business transformation',
    'digital transformation',
    'AI ROI',
    'enterprise AI',
    'AI adoption',
    // Technical
    'generative AI',
    'LLM',
    'RAG',
    'MCP',
    'Model Context Protocol',
    'WebLLM',
    'multi-agent systems',
    // Personal brand
    'Jesse Alton',
    'The Interop',
    'Virgent AI',
    'AI thought leader',
    // Location
    'Maryland AI',
    'Baltimore AI',
    'DMV tech',
  ],
  authors: [{ name: siteConfig.author.name, url: 'https://alton.tech' }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  category: 'Technology',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.author.name} - AI Strategy & Agent Development`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        alt: `${siteConfig.author.name} - AI Strategy & Agent Development`,
      }
    ],
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
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${siteConfig.url}/rss.xml`,
    },
  },
};

// JSON-LD Structured Data - Comprehensive for AI Search
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { '@id': `${siteConfig.url}/#person` },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/blog?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: siteConfig.author.name,
      givenName: 'Jesse',
      familyName: 'Alton',
      alternateName: ['MrMetaverse', 'mrmetaverse'],
      url: 'https://alton.tech',
      image: `${siteConfig.url}/images/logo.png`,
      description: 'AI strategist, entrepreneur, and founder helping organizations implement AI solutions that ship. Founder & CEO of Virgent AI and AltonTech Inc.',
      sameAs: [
        siteConfig.links.twitter,
        siteConfig.links.linkedin,
        siteConfig.links.github,
        siteConfig.links.youtube,
        siteConfig.links.substack,
        'https://alton.tech',
        'https://virgent.ai',
      ],
      jobTitle: 'Founder & CEO',
      worksFor: [
        {
          '@type': 'Organization',
          '@id': 'https://virgent.ai/#org',
          name: 'Virgent AI',
          url: 'https://virgent.ai',
          description: 'Full-service AI development agency helping organizations implement AI solutions',
        },
        {
          '@type': 'Organization',
          '@id': 'https://alton.tech/#org',
          name: 'AltonTech Inc.',
          url: 'https://alton.tech',
          description: 'Product development, sales, and AI enablement with 100+ successful projects',
        },
      ],
      knowsAbout: [
        'Artificial Intelligence',
        'AI Strategy',
        'AI Implementation',
        'AI Agents',
        'Multi-Agent Systems',
        'LangChain',
        'RAG Systems',
        'Generative AI',
        'Large Language Models',
        'Business Transformation',
        'Digital Transformation',
        'Enterprise AI',
        'Startups',
        'Product Management',
        'Model Context Protocol',
      ],
      alumniOf: 'Towson University',
      award: '100+ successful commercial and government projects',
    },
    {
      '@type': 'Blog',
      '@id': `${siteConfig.url}/blog/#blog`,
      url: `${siteConfig.url}/blog`,
      name: 'The Interop',
      alternateName: 'The Interop by Jesse Alton',
      description: 'AI strategy, agent development, and business transformation insights. Practical guides for founders, executives, and builders implementing AI in production.',
      publisher: { '@id': `${siteConfig.url}/#person` },
      author: { '@id': `${siteConfig.url}/#person` },
      inLanguage: 'en-US',
      about: [
        { '@type': 'Thing', name: 'Artificial Intelligence' },
        { '@type': 'Thing', name: 'AI Strategy' },
        { '@type': 'Thing', name: 'AI Agents' },
        { '@type': 'Thing', name: 'Business Transformation' },
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://virgent.ai/#org',
      name: 'Virgent AI',
      url: 'https://virgent.ai',
      logo: 'https://virgent.ai/logo.png',
      description: 'Full-service AI development agency helping organizations implement AI solutions that actually ship.',
      founder: { '@id': `${siteConfig.url}/#person` },
      foundingDate: '2023',
      areaServed: 'Worldwide',
      serviceType: ['AI Development', 'AI Consulting', 'Agent Development', 'AI Strategy'],
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f5' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* AI Crawler Discovery */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Theme detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-body antialiased">
        {children}
      </body>
    </html>
  );
}
