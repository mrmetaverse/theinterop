'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleVisuals?: () => void;
  visualsEnabled?: boolean;
}

const navItems = [
  { href: '/blog', label: 'Blog' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
];

export default function Header({ onToggleVisuals, visualsEnabled = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDark(darkMode);

    // Handle scroll
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
        isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-neu-sm' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col font-display text-foreground hover:text-accent-primary transition-colors"
          >
            <span className="text-xl font-bold text-gradient leading-tight">The Interop</span>
            <span className="text-xs text-foreground-muted font-normal">with Jesse Alton</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-card transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Visuals Toggle */}
            {onToggleVisuals && (
              <button
                onClick={onToggleVisuals}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  visualsEnabled
                    ? 'text-accent-primary bg-card shadow-neu-sm'
                    : 'text-foreground-muted hover:text-foreground'
                )}
                title={visualsEnabled ? 'Disable 3D visuals' : 'Enable 3D visuals'}
                aria-label={visualsEnabled ? 'Disable 3D visuals' : 'Enable 3D visuals'}
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-card transition-all"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-card transition-all"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in-down">
            <div className="neu-card-sm space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-foreground-muted hover:text-foreground hover:bg-card-hover transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

