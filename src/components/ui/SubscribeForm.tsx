'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react';
import { siteConfig } from '@/lib/types';

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

    // For now, redirect to Substack subscribe
    // In production, this would connect to your email provider API
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Open Substack subscribe in new tab as interim solution
      window.open(`${siteConfig.links.substack}/subscribe?email=${encodeURIComponent(email)}`, '_blank');
      
      setStatus('success');
      setMessage('Redirecting to complete subscription...');
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="neu-input"
            disabled={status === 'loading' || status === 'success'}
            required
          />
          
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="neu-button-primary w-full"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'success' ? (
              <>
                <Check className="w-5 h-5" />
                Subscribed!
              </>
            ) : (
              <>
                Subscribe
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {message && (
            <p className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-foreground-muted'}`}>
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-xs text-foreground-muted text-center">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Inline variant
  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="neu-input pl-12"
          disabled={status === 'loading' || status === 'success'}
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="neu-button-primary whitespace-nowrap"
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : status === 'success' ? (
          <>
            <Check className="w-5 h-5" />
            Done!
          </>
        ) : (
          <>
            Subscribe
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {message && (
        <p className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-foreground-muted'}`}>
          {message}
        </p>
      )}
    </form>
  );
}

