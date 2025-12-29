import { Metadata } from 'next';
import Link from 'next/link';
import { 
  getPodcastData, 
  getVideoData, 
  getAllPodcastEpisodes, 
  getAllVideos,
  getAllChannels,
} from '@/lib/media';
import { siteConfig } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Media',
  description: 'Videos from Jesse Alton on AI, the metaverse, and emerging technology.',
  openGraph: {
    title: 'Media | The Interop',
    description: 'Videos from Jesse Alton on AI, the metaverse, and emerging technology.',
  },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function MediaPage() {
  const podcastData = getPodcastData();
  const videoData = getVideoData();
  const episodes = getAllPodcastEpisodes();
  const videos = getAllVideos();
  const channels = getAllChannels();
  
  // Separate videos by channel
  const activeChannelVideos = videos.filter(v => {
    const channel = channels.find(c => c.id === v.channelId);
    return channel?.active;
  });
  
  const archiveChannelVideos = videos.filter(v => {
    const channel = channels.find(c => c.id === v.channelId);
    return !channel?.active;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-foreground">The Interop</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/media" className="text-sm text-foreground font-medium">
              Media
            </Link>
            <Link href="/about" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Media
          </h1>
          <p className="text-lg text-foreground-muted">
            Videos on AI, the metaverse, and emerging technology.
          </p>
          <p className="text-sm text-foreground-muted mt-2">
            Looking for blog posts? Visit the{' '}
            <Link href="/blog" className="text-accent hover:underline">Blog</Link>
            {' '}section for articles from{' '}
            <a href="https://mrmetaverse.substack.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              The Interop on Substack
            </a>.
          </p>
        </div>

        {/* Active YouTube Channel Section */}
        {activeChannelVideos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Latest Videos
                </h2>
                <p className="text-foreground-muted">
                  Originally posted on{' '}
                  <a 
                    href="https://www.youtube.com/@jessealton" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    YouTube @jessealton
                  </a>
                </p>
              </div>
              <a 
                href="https://www.youtube.com/@jessealton/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                View all on YouTube
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeChannelVideos.map((video) => (
                <article 
                  key={video.id}
                  className="group neumorphic-card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </span>
                    <span className="text-xs text-foreground-muted">{video.duration}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-foreground-muted">
                      {formatDate(video.date)}
                    </time>
                    <a 
                      href={`https://www.youtube.com/@jessealton/videos`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      Watch →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Archive YouTube Channel Section - Metaverse Interop Show */}
        {archiveChannelVideos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Metaverse Interop Show (Archive)
                </h2>
                <p className="text-foreground-muted">
                  Video episodes originally posted on{' '}
                  <a 
                    href="https://www.youtube.com/@1metaverse" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    YouTube @1metaverse
                  </a>
                  {' '}• This show is now archived
                </p>
              </div>
              <a 
                href="https://www.youtube.com/@1metaverse/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                View all on YouTube
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {archiveChannelVideos.map((video) => (
                <article 
                  key={video.id}
                  className="group neumorphic-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 opacity-90"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </span>
                    <span className="text-xs text-foreground-muted">{video.duration}</span>
                    <span className="text-xs bg-foreground-muted/20 text-foreground-muted px-2 py-0.5 rounded">Archive</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-foreground-muted">
                      {formatDate(video.date)}
                    </time>
                    <a 
                      href={`https://www.youtube.com/@1metaverse/videos`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      Watch →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Archived Podcast Section - Only show if there are episodes OR as a reference */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                The Metaverse Interop Show, the Podcast (Archive)
              </h2>
              <p className="text-foreground-muted">
                Archived audio episodes on{' '}
                <a 
                  href={podcastData.source.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Substack
                </a>
                {' '}• This podcast is now archived
              </p>
            </div>
            <a 
              href={podcastData.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              Listen on Substack
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          
          {episodes.length > 0 ? (
            <div className="space-y-4">
              {episodes.map((episode) => (
                <article 
                  key={episode.id}
                  className="group neumorphic-card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <time className="text-xs text-foreground-muted">
                          {formatDate(episode.date)}
                        </time>
                        <span className="text-xs text-foreground-muted">•</span>
                        <span className="text-xs text-foreground-muted">{episode.duration}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        <a 
                          href={episode.episodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {episode.title}
                        </a>
                      </h3>
                      <p className="text-sm text-foreground-muted line-clamp-2">
                        {episode.description}
                      </p>
                    </div>
                    <a 
                      href={episode.episodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-background hover:bg-accent/90 transition-colors"
                      aria-label={`Listen to ${episode.title}`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="neumorphic-card rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground-muted/10 text-foreground-muted mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-foreground-muted mb-4">
                The audio podcast episodes are archived on Substack.
              </p>
              <a 
                href={podcastData.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                Listen to archived episodes on Substack
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </section>

        {/* Channel Links */}
        <section className="border-t border-border pt-12">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Follow Jesse Alton
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <a 
              href="https://www.youtube.com/@jessealton"
              target="_blank"
              rel="noopener noreferrer"
              className="neumorphic-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </span>
              <div>
                <p className="font-semibold text-foreground">@jessealton</p>
                <p className="text-sm text-foreground-muted">Active Channel</p>
              </div>
            </a>
            
            <a 
              href="https://www.youtube.com/@1metaverse"
              target="_blank"
              rel="noopener noreferrer"
              className="neumorphic-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </span>
              <div>
                <p className="font-semibold text-foreground">@1metaverse</p>
                <p className="text-sm text-foreground-muted">Metaverse Interop Show (Archive)</p>
              </div>
            </a>
            
            <a 
              href={podcastData.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="neumorphic-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-foreground">Podcast (Archive)</p>
                <p className="text-sm text-foreground-muted">Substack Audio</p>
              </div>
            </a>
          </div>
        </section>

        {/* Blog Reference */}
        <section className="mt-12 neumorphic-card rounded-xl p-8 text-center bg-gradient-to-br from-card to-background">
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Looking for Written Content?
          </h2>
          <p className="text-foreground-muted mb-6">
            Blog posts from &quot;The Interop&quot; on Substack are available in the Blog section.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-colors"
            >
              View Blog Posts
            </Link>
            <a 
              href="https://mrmetaverse.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              Visit Substack Archive
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-foreground-muted">
          <p>© {new Date().getFullYear()} {siteConfig.author.name}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
