import { Metadata } from 'next';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail, ExternalLink, Globe, Target, Trees, Heart, Dog } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { siteConfig } from '@/lib/types';

export const metadata: Metadata = {
  title: 'About Jesse Alton',
  description: 'Jesse Alton is the founder of Virgent AI and AltonTech, specializing in AI strategy, agent development, and business transformation. Based in Maryland, serving the DMV area and beyond.',
  keywords: ['Jesse Alton', 'AI consultant', 'Virgent AI', 'AltonTech', 'Maryland AI', 'AI strategy', 'AI implementation'],
  openGraph: {
    title: 'About Jesse Alton | The Interop',
    description: 'Founder of Virgent AI and AltonTech. AI strategist, agent developer, and entrepreneur helping businesses implement AI that ships.',
    url: `${siteConfig.url}/about`,
    type: 'profile',
    images: [{ url: `${siteConfig.url}/images/logo.png`, width: 400, height: 400, alt: 'Jesse Alton' }],
  },
  twitter: {
    card: 'summary',
    title: 'About Jesse Alton',
    description: 'AI strategist, founder of Virgent AI, and builder of production AI systems.',
    images: [`${siteConfig.url}/images/logo.png`],
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

const socialLinks = [
  { href: 'https://alton.tech', icon: Globe, label: 'alton.tech' },
  { href: siteConfig.links.twitter, icon: Twitter, label: 'Twitter' },
  { href: siteConfig.links.github, icon: Github, label: 'GitHub' },
  { href: siteConfig.links.linkedin, icon: Linkedin, label: 'LinkedIn' },
  { href: `mailto:${siteConfig.author.email}`, icon: Mail, label: 'Email' },
];

const companies = [
  {
    name: 'Virgent AI',
    role: 'Co-founder & CEO',
    description: 'Full-service AI development agency helping organizations implement AI solutions that actually ship. Need AI help? Start here.',
    url: 'https://virgent.ai',
    highlight: true,
  },
  {
    name: 'AltonTech Inc.',
    role: 'Founder',
    description: 'Product development, sales, and AI enablement with 100+ successful commercial and government projects.',
    url: 'https://alton.tech',
  },
];

const previousWork = [
  {
    name: 'Magick ML',
    role: 'Founder (Previous)',
    description: 'Open-source no-code visual node-graph AI Development Environment for building, deploying, and scaling AI agents.',
    url: 'https://magickml.com',
  },
  {
    name: 'OMI Group',
    role: 'Co-chair (Previous)',
    description: 'Open Metaverse Interoperability Group promoting open standards and interoperability across virtual worlds.',
    url: 'https://omigroup.org',
  },
];

const volunteerWork = [
  {
    name: 'Maryland Tech Council (MTC)',
    role: 'Chesapeake Regional Chapter',
    description: 'Co-creator of the Chesapitch and Hackathon series, helping foster innovation in the Maryland tech ecosystem.',
    url: 'https://members.mdtechcouncil.com',
  },
  {
    name: 'TEDCO',
    role: 'LENA Executive Network Advisor',
    description: 'Active advisor in TEDCO\'s Leadership, Education, Networking & Accountability program supporting Maryland entrepreneurs.',
    url: 'https://www.tedcomd.com',
  },
  {
    name: 'GDG Annapolis',
    role: 'Co-organizer & Contributor',
    description: 'Google Developer Group Annapolis - building community around Google technologies and developer education.',
    url: 'https://gdg.community.dev/gdg-annapolis/',
  },
  {
    name: 'UMD Blockchain Accelerator',
    role: 'Mentor',
    description: 'Supporting early-stage blockchain and Web3 ventures at the University of Maryland.',
    url: 'https://www.umd.edu',
  },
  {
    name: 'AACC',
    role: 'Former Ratcliffe Scholar',
    description: 'Supporting various entrepreneurship events annually at Anne Arundel Community College.',
    url: 'https://www.aacc.edu',
  },
];

const passions = [
  {
    icon: Target,
    title: 'Archery & Bowmaking',
    description: 'Avid archer, fletcher, and bowyer. My real passion is working on traditional bows and wooden arrows—there\'s something deeply satisfying about the craftsmanship.',
  },
  {
    icon: Heart,
    title: 'Family',
    description: 'Husband and new father. Nothing matters more than time with family, especially getting out into nature together.',
  },
  {
    icon: Trees,
    title: 'Wilderness & Adventure',
    description: 'Triathlete and yogi who spends as much time in the wilderness as possible. Hiking, trail running, and exploring the outdoors keeps me grounded.',
  },
  {
    icon: Dog,
    title: 'Daily Dog Walks',
    description: 'My three dogs get a daily hike—rain or shine. It\'s the best way to start the day and clear the mind before diving into code.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-accent flex items-center justify-center text-white text-5xl font-bold shadow-neu mb-8">
              JA
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              About The Interop
            </h1>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Weekly insights at the intersection of AI, business transformation, and emerging technology—from the frontlines of real-world implementation.
            </p>
            <a
              href="https://alton.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-accent-primary hover:underline"
            >
              <Globe className="w-4 h-4" />
              Visit alton.tech for all projects & press
            </a>
          </div>

          {/* About The Interop */}
          <section className="neu-card mb-12">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              What is The Interop?
            </h2>
            <div className="prose-interop">
              <p>
                The Interop is where I share what I am learning from the trenches of AI implementation. This is not academic theory or research paper summaries—it is practical insights from building and deploying AI systems for real organizations with real constraints.
              </p>
              <p>
                The name reflects my core belief: the future belongs to those who can make different systems, ideas, and technologies work together. Interoperability is not just a technical challenge—it is a business imperative.
              </p>
              <p>
                Whether you are a founder evaluating AI investment, a builder architecting agent systems, or a leader navigating digital transformation, you will find actionable insights here.
              </p>
            </div>
          </section>

          {/* About Jesse */}
          <section className="neu-card mb-12">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              About Jesse Alton
            </h2>
            <div className="prose-interop">
              <p>
                I am a founder, AI strategist, and builder operating at the intersection of AI and business transformation. Based in Annapolis, Maryland, I work with organizations—from startups to government agencies—to implement AI solutions that actually ship.
              </p>
              <p>
                My approach is pragmatic: start with real problems, build iteratively, and measure ruthlessly. I have seen too many AI projects fail from over-ambition and under-execution. The organizations that win are not the ones with the biggest budgets—they are the ones that treat AI as a business capability, not a science experiment.
              </p>
              <p>
                While I spend time every day coding, building, and selling, my entrepreneurial journey started over a decade ago. From the early days featured in the <Link href="/press" className="text-accent-primary hover:underline">Capital Gazette</Link> to speaking at <a href="https://www.tedcomd.com/news-events/press-releases/2025/tedco-announces-panel-discussion-unlocking-ai-strategy-2025" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">TEDCO&apos;s 2025 Entrepreneur Expo</a> on AI strategy, I have always been driven by the desire to build things that matter.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl text-foreground-muted hover:text-accent-primary hover:bg-card-hover shadow-neu-sm transition-all"
                  aria-label={social.label}
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </section>

          {/* Beyond Work - Personal Passions */}
          <section className="mb-12">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
              Beyond the Screen
            </h2>
            <p className="text-foreground-muted mb-6">
              Outside of being an entrepreneur and technologist, I believe life is best lived with balance. Here&apos;s what keeps me grounded:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {passions.map((passion) => (
                <div key={passion.title} className="neu-card">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                      <passion.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {passion.title}
                      </h3>
                      <p className="text-foreground-muted text-sm">
                        {passion.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-foreground-muted mt-6 text-center italic">
              Engaging with the Annapolis, Maryland community is where it all comes together—building, connecting, and making a difference locally.
            </p>
          </section>

          {/* Current Work */}
          <section className="mb-12">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
              Current Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((company) => (
                <a
                  key={company.name}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`neu-card group ${'highlight' in company && company.highlight ? 'ring-2 ring-accent-primary' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground group-hover:text-accent-primary transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-sm text-accent-primary">{company.role}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-foreground-muted group-hover:text-accent-primary transition-colors" />
                  </div>
                  <p className="mt-3 text-foreground-muted text-sm">{company.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Community & Volunteering */}
          <section className="mb-12">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              Community & Volunteering
            </h2>
            <p className="text-foreground-muted mb-6">
              I take great pride in the Maryland tech ecosystem and volunteer regularly with organizations that support entrepreneurs and developers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteerWork.map((org) => (
                <a
                  key={org.name}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-card-sm group p-4"
                >
                  <h3 className="font-display font-semibold text-foreground group-hover:text-accent-primary transition-colors text-sm">
                    {org.name}
                  </h3>
                  <p className="text-xs text-accent-primary mt-1">{org.role}</p>
                  <p className="mt-2 text-foreground-muted text-xs">{org.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Previous Startups */}
          <section className="mb-12">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
              Previous Startups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previousWork.map((company) => (
                <a
                  key={company.name}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-card group opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground group-hover:text-accent-primary transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-sm text-foreground-muted">{company.role}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-foreground-muted group-hover:text-accent-primary transition-colors" />
                  </div>
                  <p className="mt-3 text-foreground-muted text-sm">{company.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Press Mention */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-semibold text-foreground">
                In the Press
              </h2>
              <Link href="/press" className="text-accent-primary hover:underline text-sm">
                View all coverage →
              </Link>
            </div>
            <div className="neu-card">
              <blockquote className="text-lg text-foreground italic mb-4">
                &ldquo;Entrepreneurship is what wakes me up. I don&apos;t regret any of the money I lost. All of it was a learning opportunity and all it&apos;s going to do is make me into a better entrepreneur.&rdquo;
              </blockquote>
              <p className="text-foreground-muted text-sm">
                — Capital Gazette,{' '}
                <a
                  href="https://www.capitalgazette.com/2014/11/06/advice-from-local-entrepreneurs-be-prepared-to-make-a-switch-lose-money/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  November 2014
                </a>
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center neu-card bg-gradient-to-br from-card to-background-elevated">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              Let&apos;s Connect
            </h2>
            <p className="text-foreground-muted mb-6">
              Have a project in mind, want to discuss AI strategy, or just want to say hello? I am always happy to chat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`mailto:${siteConfig.author.email}`}
                className="neu-button-primary"
              >
                <Mail className="w-5 h-5" />
                Get in Touch
              </a>
              <Link href="/subscribe" className="neu-button">
                Subscribe to The Interop
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
