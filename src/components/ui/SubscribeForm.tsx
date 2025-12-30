'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

interface SubscribeFormProps {
  variant?: 'inline' | 'card';
  className?: string;
}

export default function SubscribeForm({ variant = 'inline', className = '' }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Check your email to confirm your subscription!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setMessage('');
  };

  if (variant === 'card') {
    return (
      <div className={`editorial-card ${className}`}>
        <span className="section-label">Newsletter</span>
        <h3 className="headline-md mt-2 mb-2">Subscribe to The Interop</h3>
        <p className="text-sm text-foreground-muted mb-6">Weekly insights on AI strategy and implementation.</p>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-green-600 text-green-600 mb-4">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-semibold mb-2">Check your inbox</p>
            <p className="text-sm text-foreground-muted mb-4">{message}</p>
            <button
              onClick={resetForm}
              className="text-sm font-semibold uppercase tracking-wider hover:underline"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="editorial-input"
              disabled={status === 'loading'}
              required
            />
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {message && status === 'error' && (
              <p className="text-sm text-red-600 text-center">{message}</p>
            )}
          </form>
        )}

        <p className="mt-4 text-xs text-foreground-subtle text-center">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Inline variant
  if (status === 'success') {
    return (
      <div className={`flex flex-col items-center gap-4 py-6 ${className}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-green-600 text-green-600">
          <Check className="w-6 h-6" />
        </div>
        <p className="font-semibold">{message}</p>
        <button
          onClick={resetForm}
          className="text-sm font-semibold uppercase tracking-wider hover:underline"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`max-w-md mx-auto ${className}`}>
      <div className="flex flex-col sm:flex-row border border-border">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 bg-background text-foreground border-none focus:outline-none"
          disabled={status === 'loading'}
          required
        />
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-foreground text-background font-semibold text-sm uppercase tracking-wider hover:bg-foreground-muted transition-colors flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {message && status === 'error' && (
        <p className="text-sm text-red-600 mt-3 text-center">{message}</p>
      )}
    </form>
  );
}
