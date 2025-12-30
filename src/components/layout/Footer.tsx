import Link from 'next/link';
import { Github, Linkedin, Rss, Youtube } from 'lucide-react';
import { siteConfig } from '@/lib/types';

const footerLinks = {
  content: [
    { href: '/blog', label: 'Blog' },
    { href: '/categories/ai-strategy', label: 'AI Strategy' },
    { href: '/categories/agent-development', label: 'Agent Development' },
    { href: '/categories/case-studies', label: 'Case Studies' },
    { href: '/categories/media', label: 'Media' },
  ],
  connect: [
    { href: 'https://virgent.ai', label: 'Get AI Help', external: true },
    { href: '/about', label: 'About' },
    { href: '/rss.xml', label: 'RSS Feed' },
  ],
};

const socialLinks = [
  { href: siteConfig.links.youtube, icon: Youtube, label: 'YouTube' },
  { href: siteConfig.links.github, icon: Github, label: 'GitHub' },
  { href: siteConfig.links.linkedin, icon: Linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-elevated border-t border-border mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold font-display text-gradient">
              The Interop
            </Link>
            <p className="mt-4 text-foreground-muted max-w-md">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-foreground-muted hover:text-accent-primary hover:bg-card transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Content Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Content</h3>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-primary hover:text-foreground transition-colors font-medium"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-foreground-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground-muted">
            © {currentYear} {siteConfig.author.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-foreground-muted">
            <a
              href="https://alton.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-primary transition-colors"
            >
              alton.tech
            </a>
            <span>•</span>
            <a
              href="/rss.xml"
              className="flex items-center gap-1 hover:text-accent-primary transition-colors"
            >
              <Rss className="w-4 h-4" />
              RSS
            </a>
            <span>•</span>
            <a
              href={siteConfig.links.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-primary transition-colors"
            >
              Substack Archive
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

