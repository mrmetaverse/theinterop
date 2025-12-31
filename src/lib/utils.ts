import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateISO(dateString: string): string {
  return new Date(dateString).toISOString();
}

export function absoluteUrl(path: string): string {
  return `https://jessealton.com${path}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

export function getReadingTimeText(minutes: number): string {
  if (minutes < 1) return 'Less than a minute';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Category slug to class mapping
export function getCategoryClass(category: string): string {
  const classMap: Record<string, string> = {
    'ai-strategy': 'neu-tag-ai-strategy',
    'business-transformation': 'neu-tag-business-transformation',
    'agent-development': 'neu-tag-agent-development',
    'future-tech': 'neu-tag-future-tech',
    'case-studies': 'neu-tag-case-studies',
  };
  return classMap[category] || 'neu-tag';
}

// Get social share image URL with fallback
export function getSocialImageUrl(coverImage?: string): string {
  const baseUrl = 'https://jessealton.com';
  
  if (coverImage) {
    // If coverImage is already absolute URL, return it
    if (coverImage.startsWith('http')) {
      return coverImage;
    }
    // Otherwise, make it absolute
    return `${baseUrl}${coverImage}`;
  }
  
  // Fallback to logo
  return `${baseUrl}/images/logo.png`;
}
