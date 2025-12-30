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
        width: 400,
        height: 400,
        alt: `${siteConfig.author.name} - AI Strategy & Agent Development`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
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
  other: {
    'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

// JSON-LD Structured Data
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
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: siteConfig.author.name,
      url: 'https://alton.tech',
      image: `${siteConfig.url}/images/logo.png`,
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
      worksFor: {
        '@type': 'Organization',
        name: 'Virgent AI',
        url: 'https://virgent.ai',
      },
      knowsAbout: [
        'Artificial Intelligence',
        'AI Strategy',
        'AI Agents',
        'Business Transformation',
        'LangChain',
        'Generative AI',
        'Startups',
        'Product Management',
      ],
    },
    {
      '@type': 'Blog',
      '@id': `${siteConfig.url}/blog/#blog`,
      url: `${siteConfig.url}/blog`,
      name: 'The Interop Blog',
      description: 'AI strategy, agent development, and business transformation insights',
      publisher: { '@id': `${siteConfig.url}/#person` },
      inLanguage: 'en-US',
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
