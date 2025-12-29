'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Play } from 'lucide-react';

type EmbedType = 'youtube' | 'twitter' | 'tweet' | 'vimeo' | 'codepen' | 'loom';

interface EmbedProps {
  type: EmbedType;
  id: string;
  title?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

// YouTube embed
function YouTubeEmbed({ id, title }: { id: string; title?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  if (!isLoaded) {
    return (
      <button
        onClick={() => setIsLoaded(true)}
        className="relative w-full aspect-video rounded-xl overflow-hidden group cursor-pointer"
        aria-label={`Play video: ${title || 'YouTube video'}`}
      >
        {/* Thumbnail */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={title || 'Video thumbnail'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        
        {/* Title */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-medium">{title}</p>
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Twitter/X embed
function TwitterEmbed({ id }: { id: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      // Load Twitter widgets script
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="my-6 neu-card">
        <div className="flex items-center justify-between">
          <p className="text-foreground-muted">Twitter/X Post</p>
          <button
            onClick={() => setIsLoaded(true)}
            className="neu-button text-sm"
          >
            Load Tweet
          </button>
        </div>
        <a
          href={`https://twitter.com/i/status/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-accent-primary mt-2 text-sm hover:underline"
        >
          View on X <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="my-6 flex justify-center">
      <blockquote className="twitter-tweet" data-theme="dark">
        <a href={`https://twitter.com/i/status/${id}`}>Loading tweet...</a>
      </blockquote>
    </div>
  );
}

// Vimeo embed
function VimeoEmbed({ id, title }: { id: string; title?: string }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://player.vimeo.com/video/${id}?dnt=1`}
        title={title || 'Vimeo video'}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Loom embed
function LoomEmbed({ id, title }: { id: string; title?: string }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.loom.com/embed/${id}`}
        title={title || 'Loom video'}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// CodePen embed
function CodePenEmbed({ id, title }: { id: string; title?: string }) {
  // id format: "user/pen-slug" e.g., "mrmetaverse/abcdef"
  const [user, penSlug] = id.split('/');
  
  return (
    <div className="my-6">
      <iframe
        height="400"
        style={{ width: '100%' }}
        scrolling="no"
        title={title || 'CodePen'}
        src={`https://codepen.io/${user}/embed/${penSlug}?default-tab=result&theme-id=dark`}
        frameBorder="no"
        loading="lazy"
        allowFullScreen
        className="rounded-xl"
      >
        See the Pen on{' '}
        <a href={`https://codepen.io/${user}/pen/${penSlug}`}>CodePen</a>.
      </iframe>
    </div>
  );
}

export default function Embed({ type, id, title, aspectRatio = '16:9' }: EmbedProps) {
  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  };

  return (
    <div className={`my-8 ${aspectClasses[aspectRatio] || ''}`}>
      {type === 'youtube' && <YouTubeEmbed id={id} title={title} />}
      {(type === 'twitter' || type === 'tweet') && <TwitterEmbed id={id} />}
      {type === 'vimeo' && <VimeoEmbed id={id} title={title} />}
      {type === 'loom' && <LoomEmbed id={id} title={title} />}
      {type === 'codepen' && <CodePenEmbed id={id} title={title} />}
    </div>
  );
}

