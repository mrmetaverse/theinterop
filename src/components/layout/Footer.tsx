import Link from 'next/link';
import { Github, Linkedin, Rss, Youtube, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/types';

const footerLinks = {
  content: [
    { href: '/blog', label: 'All Articles' },
    { href: '/categories/ai-strategy', label: 'AI Strategy' },
    { href: '/categories/agent-development', label: 'Agent Development' },
    { href: '/categories/case-studies', label: 'Case Studies' },
  ],
  connect: [
    { href: 'https://virgent.ai', label: 'Get AI Help', external: true, highlight: true },
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
    <footer className="border-t border-border mt-16 bg-background-elevated">
      <div className="container-editorial py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-border">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-tight">The Interop</span>
            </Link>
            <p className="mt-4 text-foreground-muted max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            
            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-subtle hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Content Links */}
          <div className="md:col-span-3">
            <h3 className="section-label mb-4">Content</h3>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div className="md:col-span-2">
            <h3 className="section-label mb-4">Connect</h3>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm inline-flex items-center gap-1 ${
                        'highlight' in link && link.highlight 
                          ? 'text-accent-gold font-semibold hover:underline' 
                          : 'text-foreground-muted hover:text-foreground'
                      } transition-colors`}
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="section-label mb-4">Newsletter</h3>
            <p className="text-sm text-foreground-muted mb-4">
              Weekly insights delivered to your inbox.
            </p>
            <Link 
              href="/subscribe" 
              className="btn-secondary text-xs py-2 px-4"
            >
              Subscribe
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground-subtle">
            © {currentYear} {siteConfig.author.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-foreground-subtle">
            <a
              href="https://alton.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              alton.tech
            </a>
            <a
              href="/rss.xml"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Rss className="w-3 h-3" />
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
