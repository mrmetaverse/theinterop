'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Moon, Sun, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleVisuals?: () => void;
  visualsEnabled?: boolean;
}

const navItems = [
  { href: '/blog', label: 'Articles' },
  { href: '/categories', label: 'Topics' },
  { href: '/about', label: 'About' },
];

export default function Header({ onToggleVisuals, visualsEnabled = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDark(darkMode);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      )}
    >
      <nav className="container-editorial">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <Image
              src="/images/logo.png"
              alt="The Interop Logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight group-hover:text-foreground-muted transition-colors">
                The Interop
              </span>
              <span className="text-[10px] uppercase tracking-widest text-foreground-subtle font-medium -mt-0.5">
                Jesse Alton
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors uppercase tracking-wider"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Visuals Toggle */}
            {onToggleVisuals && (
              <button
                onClick={onToggleVisuals}
                className={cn(
                  'p-2 transition-colors',
                  visualsEnabled
                    ? 'text-accent-gold'
                    : 'text-foreground-subtle hover:text-foreground'
                )}
                title={visualsEnabled ? 'Disable visuals' : 'Enable visuals'}
                aria-label={visualsEnabled ? 'Disable visuals' : 'Enable visuals'}
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-foreground-subtle hover:text-foreground transition-colors"
              title={isDark ? 'Light mode' : 'Dark mode'}
              aria-label={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Subscribe button - desktop */}
            <Link
              href="/subscribe"
              className="hidden md:inline-flex btn-secondary text-xs py-2 px-4"
            >
              Subscribe
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground-subtle hover:text-foreground transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in-down border-t border-border">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 text-sm font-medium text-foreground-muted hover:text-foreground uppercase tracking-wider transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/subscribe"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-sm font-medium text-accent-gold uppercase tracking-wider"
              >
                Subscribe
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
