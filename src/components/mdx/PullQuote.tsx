import { ReactNode } from 'react';
import { Quote } from 'lucide-react';

interface PullQuoteProps {
  children: ReactNode;
  author?: string;
  source?: string;
}

export default function PullQuote({ children, author, source }: PullQuoteProps) {
  return (
    <aside className="my-10 relative">
      {/* Decorative quote mark */}
      <Quote className="absolute -top-2 -left-2 w-12 h-12 text-accent-primary/20 rotate-180" />
      
      <blockquote className="relative pl-8 pr-4 py-4 border-l-0">
        <p className="text-2xl font-display font-medium text-foreground leading-relaxed italic">
          {children}
        </p>
        
        {(author || source) && (
          <footer className="mt-4 text-foreground-muted">
            {author && (
              <cite className="font-semibold not-italic">— {author}</cite>
            )}
            {source && (
              <span className="text-sm">
                {author && ', '}
                {source}
              </span>
            )}
          </footer>
        )}
      </blockquote>
    </aside>
  );
}

