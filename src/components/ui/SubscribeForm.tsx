'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react';

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
      <div className={`neu-card ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-accent">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Subscribe to The Interop</h3>
            <p className="text-sm text-foreground-muted">Get insights delivered weekly</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-4">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-foreground font-medium mb-2">Check your inbox!</p>
            <p className="text-sm text-foreground-muted mb-4">{message}</p>
            <button
              onClick={resetForm}
              className="text-sm text-accent-primary hover:underline"
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
              placeholder="Enter your email"
              className="neu-input"
              disabled={status === 'loading'}
              required
            />
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="neu-button-primary w-full"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {message && status === 'error' && (
              <p className="text-sm text-red-500 text-center">{message}</p>
            )}
          </form>
        )}

        <p className="mt-4 text-xs text-foreground-muted text-center">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Inline variant
  if (status === 'success') {
    return (
      <div className={`flex flex-col items-center gap-3 py-4 ${className}`}>
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-500">
          <Check className="w-5 h-5" />
        </div>
        <p className="text-foreground font-medium">{message}</p>
        <button
          onClick={resetForm}
          className="text-sm text-accent-primary hover:underline"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted pointer-events-none" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="neu-input"
          style={{ paddingLeft: '3rem' }}
          disabled={status === 'loading'}
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className="neu-button-primary whitespace-nowrap"
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Subscribe
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {message && status === 'error' && (
        <p className="text-sm text-red-500 mt-2 sm:mt-0">{message}</p>
      )}
    </form>
  );
}
