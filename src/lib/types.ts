export type OriginalSource = 'jessealton' | 'substack' | 'medium' | 'virgent';

export interface PostFrontmatter {
  title: string;
  date: string; // ISO YYYY-MM-DD
  slug: string; // kebab-case, unique
  excerpt: string; // 1-3 sentences
  category: Category;
  tags?: string[];
  coverImage?: string; // path under /public/images/...
  featured?: boolean;
  draft?: boolean; // if true, excluded from production builds
  originalSource?: OriginalSource; // where the post was originally published
  canonicalUrl?: string; // for legacy URLs
  updatedDate?: string; // ISO YYYY-MM-DD
  series?: string; // for grouped navigation
}

export const ORIGINAL_SOURCES: Record<OriginalSource, { label: string; url: string }> = {
  'jessealton': {
    label: 'jessealton.com',
    url: 'https://jessealton.com',
  },
  'substack': {
    label: 'The Interop (Substack)',
    url: 'https://mrmetaverse.substack.com/',
  },
  'medium': {
    label: 'Medium',
    url: 'https://medium.com/@mrmetaverse',
  },
  'virgent': {
    label: 'Virgent AI Case Studies',
    url: 'https://www.virgent.ai/case-studies',
  },
};

export interface Post extends PostFrontmatter {
  content: string;
  readingTime: number;
  filePath: string; // relative path to MDX file
}

export interface PostMeta extends Omit<PostFrontmatter, 'draft'> {
  readingTime: number;
  filePath?: string; // Optional for sample data
}

export type Category = 
  | 'ai-strategy'
  | 'business-transformation'
  | 'agent-development'
  | 'future-tech'
  | 'case-studies';

export const CATEGORIES: Record<Category, { label: string; description: string; color: string }> = {
  'ai-strategy': {
    label: 'AI Strategy',
    description: 'Strategic frameworks for AI adoption and implementation',
    color: 'var(--color-category-ai-strategy)',
  },
  'business-transformation': {
    label: 'Business Transformation',
    description: 'Organizational change and digital transformation insights',
    color: 'var(--color-category-business-transformation)',
  },
  'agent-development': {
    label: 'Agent Development',
    description: 'Building and deploying AI agents and autonomous systems',
    color: 'var(--color-category-agent-development)',
  },
  'future-tech': {
    label: 'Future Tech',
    description: 'Emerging technologies and forward-looking analysis',
    color: 'var(--color-category-future-tech)',
  },
  'case-studies': {
    label: 'Case Studies',
    description: 'Real-world implementations and lessons learned',
    color: 'var(--color-category-case-studies)',
  },
};

// Helper to get all valid category slugs
export const VALID_CATEGORIES = Object.keys(CATEGORIES) as Category[];

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
    linkedin: string;
    substack: string;
    youtube: string;
    youtubeArchive: string;
    website: string;
  };
  author: {
    name: string;
    twitter: string;
    email: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'The Interop by Jesse Alton',
  description: 'Content for Builders, Founders, and Funders. Weekly insights at the intersection of AI, business transformation, and emerging technology.',
  url: 'https://jessealton.com',
  ogImage: 'https://jessealton.com/og.png',
  links: {
    twitter: 'https://twitter.com/mrmetaverse',
    github: 'https://github.com/mrmetaverse',
    linkedin: 'https://linkedin.com/in/mrmetaverse',
    substack: 'https://mrmetaverse.substack.com',
    youtube: 'https://www.youtube.com/@jessealton',
    youtubeArchive: 'https://www.youtube.com/@1metaverse',
    website: 'https://alton.tech',
  },
  author: {
    name: 'Jesse Alton',
    twitter: '@mrmetaverse',
    email: 'jesse@jessealton.com',
  },
};

// Validation errors
export interface ContentValidationError {
  file: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}
