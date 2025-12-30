import { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Calendar, Newspaper } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { siteConfig } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Press',
  description: 'Press coverage and media mentions featuring Jesse Alton - entrepreneur, AI strategist, and founder.',
  openGraph: {
    title: `Press | ${siteConfig.name}`,
    description: 'Press coverage and media mentions featuring Jesse Alton.',
    url: `${siteConfig.url}/press`,
  },
};

interface PressItem {
  title: string;
  publication: string;
  date: string;
  url: string;
  excerpt: string;
  featured?: boolean;
  coverFeature?: boolean;
}

const pressItems: PressItem[] = [
  // 2025+
  {
    title: 'Google DeepMind AI Research Foundations - 5-Week Winter Study Group',
    publication: 'GDG Annapolis',
    date: '2026-01-15',
    url: 'https://gdg.community.dev/events/details/google-gdg-annapolis-presents-google-deepmind-ai-research-foundations-a-5-week-winter-study-group-2026-01-15/',
    excerpt: 'Co-organizing a 5-week study group on Google DeepMind AI research foundations for the Annapolis developer community.',
    featured: true,
  },
  {
    title: 'TEDCO Announces Panel Discussion on Unlocking AI Strategy at 2025 Entrepreneur Expo',
    publication: 'TEDCO Maryland',
    date: '2025-08-21',
    url: 'https://www.tedcomd.com/news-events/press-releases/2025/tedco-announces-panel-discussion-unlocking-ai-strategy-2025',
    excerpt: 'Jesse Alton, Virgent AI, joins the "AI Strategy Unlocked!" panel at TEDCO\'s 2025 Entrepreneur Expo to share real-world strategies for leveraging AI in business—from concept to scale.',
    featured: true,
  },
  {
    title: 'Virgent AI: Move Beyond AI-Curious to AI-Powered',
    publication: 'Innovations of the World',
    date: '2025-06-01',
    url: 'https://innovationsoftheworld.com/virgent-ai-move-beyond-ai-curious-to-ai-powered/',
    excerpt: 'Profile of Virgent AI and its mission to help organizations move from AI-curious to AI-powered through practical implementation.',
    featured: true,
  },
  {
    title: 'Take AI Seriously or Risk Being Left Behind',
    publication: 'The AI CEO Podcast (iHeart)',
    date: '2025-03-01',
    url: 'https://www.iheart.com/podcast/263-the-ai-ceo-with-seema-alex-112672379/episode/take-ai-seriously-or-risk-being-270326630/',
    excerpt: 'Jesse Alton joins Seema Alexander on The AI CEO podcast to discuss why businesses must take AI seriously or risk being left behind.',
    featured: true,
  },
  {
    title: 'MTC CRC Emerging Industries Forum: MedTech and the Future of Medicine',
    publication: 'Maryland Tech Council',
    date: '2025-01-15',
    url: 'https://members.mdtechcouncil.com/calendar/Details/mtc-crc-emerging-industries-forum-medtech-and-the-future-of-medicine-and-how-it-fits-into-our-innovation-system-900580?sourceTypeId=Website',
    excerpt: 'Participating in the MTC Chesapeake Regional Chapter forum on emerging industries and the future of medicine in Maryland\'s innovation system.',
  },
  {
    title: 'Welcome to GDG Annapolis',
    publication: 'GDG Annapolis',
    date: '2024-12-01',
    url: 'https://gdg.community.dev/events/details/google-gdg-annapolis-presents-welcome-to-gdg-annapolis/',
    excerpt: 'Launch event for Google Developer Group Annapolis, bringing together local developers to build community around Google technologies.',
  },
  // 2022-2023 - Metaverse Era
  {
    title: 'OMI Elects New Chairs',
    publication: 'Open Metaverse Interoperability Group',
    date: '2022-09-01',
    url: 'https://omigroup.org/omi-elects-new-chairs/',
    excerpt: 'Jesse Alton elected as Co-chair of the Open Metaverse Interoperability Group, leading efforts to establish open standards for virtual worlds.',
  },
  {
    title: 'Magick ML - No-Code AI Development Environment',
    publication: 'Automate and Tweak',
    date: '2023-06-01',
    url: 'https://automateandtweak.com/tool/magickml/',
    excerpt: 'Feature on Magick ML, the open-source no-code visual node-graph AI development environment founded by Jesse Alton.',
  },
  // 2021 - CNN Metaverse
  {
    title: 'The Metaverse Has Arrived. Here\'s What That Actually Means',
    publication: 'CNN',
    date: '2021-08-08',
    url: 'https://www.cnn.com/2021/08/08/tech/metaverse-explainer/',
    excerpt: 'Contributing expert perspective on the emerging metaverse and what it means for the future of virtual worlds and digital interaction.',
    featured: true,
  },
  // Educational
  {
    title: 'Jesse Alton - MICA Art Articles',
    publication: 'Maryland Institute College of Art',
    date: '2020-01-15',
    url: 'https://www.mica.edu/art-articles/details/jesse-alton/',
    excerpt: 'Profile and articles featuring Jesse Alton\'s work at the intersection of technology and creativity at MICA.',
  },
  {
    title: 'To The Verge - Interview',
    publication: 'To The Verge (YouTube)',
    date: '2019-06-01',
    url: 'https://www.youtube.com/watch?v=0Q1QWQdIEtg',
    excerpt: 'Video interview discussing emerging technology, entrepreneurship, and the future of immersive experiences.',
  },
  // 2014 - Early Press
  {
    title: 'Advice from local entrepreneurs: Be prepared to make a switch, lose money',
    publication: 'Capital Gazette',
    date: '2014-11-06',
    url: 'https://www.capitalgazette.com/2014/11/06/advice-from-local-entrepreneurs-be-prepared-to-make-a-switch-lose-money/',
    excerpt: '"Entrepreneurship is what wakes me up. I don\'t regret any of the money I lost. All of it was a learning opportunity and all it\'s going to do is make me into a better entrepreneur." — Jesse Alton, discussing his transition from Native Flats to Alton Alternative Technologies.',
  },
  {
    title: 'For Annapolis entrepreneurs, what\'s next?',
    publication: 'Capital Gazette',
    date: '2014-07-21',
    url: 'https://www.capitalgazette.com/2014/07/21/for-annapolis-entrepreneurs-whats-next/',
    excerpt: 'Featured on the cover, Jesse Alton discusses the future of entrepreneurship in the Annapolis community and the evolving tech landscape.',
    coverFeature: true,
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PressPage() {
  const sortedPress = [...pressItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              Press & Media
            </h1>
            <p className="text-xl text-foreground-muted max-w-2xl">
              Coverage and mentions from publications featuring Jesse Alton&apos;s work in entrepreneurship, AI strategy, and technology innovation.
            </p>
            <p className="mt-4 text-foreground-muted">
              For more about Jesse and current projects, visit{' '}
              <a
                href="https://alton.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:underline"
              >
                alton.tech
              </a>
            </p>
          </div>

          {/* Featured Press */}
          {sortedPress.filter(p => p.featured).length > 0 && (
            <section className="mb-12">
              <h2 className="text-sm font-semibold text-accent-primary uppercase tracking-wider mb-6">
                Featured
              </h2>
              {sortedPress
                .filter(p => p.featured)
                .map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block neu-card group mb-6 border-l-4 border-accent-primary"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-accent-primary">
                            {item.publication}
                          </span>
                          <span className="text-foreground-muted">•</span>
                          <time className="text-sm text-foreground-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.date)}
                          </time>
                        </div>
                        <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-accent-primary transition-colors mb-3">
                          {item.title}
                        </h3>
                        <p className="text-foreground-muted">
                          {item.excerpt}
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-foreground-muted group-hover:text-accent-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </a>
                ))}
            </section>
          )}

          {/* All Press */}
          <section>
            <h2 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-6">
              All Coverage
            </h2>
            <div className="space-y-6">
              {sortedPress.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block neu-card group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-sm font-medium text-accent-primary">
                          {item.publication}
                        </span>
                        <span className="text-foreground-muted">•</span>
                        <time className="text-sm text-foreground-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.date)}
                        </time>
                        {item.coverFeature && (
                          <>
                            <span className="text-foreground-muted">•</span>
                            <span className="text-xs bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-full font-medium">
                              Cover Feature
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-accent-primary transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-foreground-muted text-sm">
                        {item.excerpt}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-foreground-muted group-hover:text-accent-primary transition-colors flex-shrink-0 mt-1" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* More Info */}
          <section className="mt-16 text-center neu-card bg-gradient-to-br from-card to-background-elevated">
            <Newspaper className="w-10 h-10 text-accent-primary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              Media Inquiries
            </h2>
            <p className="text-foreground-muted mb-6">
              For press inquiries, interviews, or speaking engagements, please reach out directly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`mailto:${siteConfig.author.email}`}
                className="neu-button-primary"
              >
                Contact for Press
              </a>
              <a
                href="https://alton.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-button"
              >
                Visit alton.tech
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

