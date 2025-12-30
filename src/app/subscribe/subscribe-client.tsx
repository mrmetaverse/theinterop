'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function SubscribeStatus() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const error = searchParams.get('error');

  if (status === 'confirmed') {
    return (
      <div className="mb-8 neu-card border-l-4 border-green-500 bg-green-500/5">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground">You are subscribed!</h3>
            <p className="text-foreground-muted mt-1">
              Welcome to The Interop. You will receive weekly insights on AI strategy, agent development, and emerging technology.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'already-confirmed') {
    return (
      <div className="mb-8 neu-card border-l-4 border-accent-primary bg-accent-primary/5">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-accent-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground">Already subscribed</h3>
            <p className="text-foreground-muted mt-1">
              Your email is already confirmed. You are all set to receive The Interop newsletter!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unsubscribed') {
    return (
      <div className="mb-8 neu-card border-l-4 border-foreground-muted bg-foreground-muted/5">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-foreground-muted flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground">Unsubscribed successfully</h3>
            <p className="text-foreground-muted mt-1">
              You have been removed from the mailing list. You can always re-subscribe below if you change your mind.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'already-unsubscribed') {
    return (
      <div className="mb-8 neu-card border-l-4 border-foreground-muted bg-foreground-muted/5">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-foreground-muted flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground">Already unsubscribed</h3>
            <p className="text-foreground-muted mt-1">
              This email is not currently subscribed. You can subscribe below to start receiving The Interop newsletter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'invalid') {
    return (
      <div className="mb-8 neu-card border-l-4 border-red-500 bg-red-500/5">
        <div className="flex items-start gap-4">
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground">Invalid or expired link</h3>
            <p className="text-foreground-muted mt-1">
              The confirmation link is invalid or has expired. Please subscribe again to receive a new confirmation email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'server') {
    return (
      <div className="mb-8 neu-card border-l-4 border-red-500 bg-red-500/5">
        <div className="flex items-start gap-4">
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground">Something went wrong</h3>
            <p className="text-foreground-muted mt-1">
              We encountered an error processing your request. Please try again or contact us if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

