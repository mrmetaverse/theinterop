import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { Post, PostMeta, Category, VALID_CATEGORIES } from './types';

const postsDirectory = path.join(process.cwd(), 'content/posts');

function calculateReadingTime(content: string): number {
  const stats = readingTime(content);
  return Math.ceil(stats.minutes);
}

/**
 * Recursively find all MDX/MD files in the posts directory
 * Supports both flat and year-based structures:
 * - /content/posts/slug.mdx (flat)
 * - /content/posts/YYYY/YYYY-MM-DD-slug.mdx (canonical)
 */
function getAllPostFiles(): string[] {
  const files: string[] = [];

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        files.push(fullPath);
      }
    }
  }

  walkDir(postsDirectory);
  return files;
}

/**
 * Parse a post file and return the Post object
 */
function parsePostFile(filePath: string): Post | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Get relative path from content/posts
    const relativePath = path.relative(postsDirectory, filePath);
    
    // Extract slug from frontmatter or filename
    let slug = data.slug;
    if (!slug) {
      const filename = path.basename(filePath, path.extname(filePath));
      // Handle YYYY-MM-DD-slug format
      const dateMatch = filename.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
      slug = dateMatch ? dateMatch[1] : filename;
    }

    return {
      title: data.title || 'Untitled',
      date: data.date ? formatDate(data.date) : new Date().toISOString().split('T')[0],
      slug,
      excerpt: data.excerpt || '',
      category: validateCategory(data.category),
      tags: data.tags || [],
      coverImage: data.coverImage,
      featured: data.featured || false,
      draft: data.draft || false,
      originalSource: data.originalSource,
      canonicalUrl: data.canonicalUrl,
      updatedDate: data.updatedDate ? formatDate(data.updatedDate) : undefined,
      series: data.series,
      content,
      readingTime: calculateReadingTime(content),
      filePath: relativePath,
    };
  } catch (error) {
    console.error(`Error parsing post file ${filePath}:`, error);
    return null;
  }
}

/**
 * Format date to ISO YYYY-MM-DD
 */
function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    return new Date(date).toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

/**
 * Validate and return category, defaulting to 'ai-strategy' if invalid
 */
function validateCategory(category: string | undefined): Category {
  if (category && VALID_CATEGORIES.includes(category as Category)) {
    return category as Category;
  }
  return 'ai-strategy';
}

/**
 * Check if we're in production mode
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get all posts (excluding drafts in production)
 */
export function getAllPosts(): Post[] {
  const files = getAllPostFiles();
  const posts = files
    .map((file) => parsePostFile(file))
    .filter((post): post is Post => {
      if (post === null) return false;
      // Exclude drafts in production
      if (isProduction() && post.draft) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Get all posts metadata (without content)
 */
export function getAllPostsMeta(): PostMeta[] {
  return getAllPosts().map(({ content, draft, ...meta }) => meta);
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: Category): PostMeta[] {
  return getAllPostsMeta().filter((post) => post.category === category);
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostsMeta().filter((post) => post.tags?.includes(tag));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(): PostMeta[] {
  return getAllPostsMeta().filter((post) => post.featured);
}

/**
 * Get latest posts
 */
export function getLatestPosts(count: number = 5): PostMeta[] {
  return getAllPostsMeta().slice(0, count);
}

/**
 * Get related posts based on category and tags
 */
export function getRelatedPosts(currentSlug: string, count: number = 3): PostMeta[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPostsMeta().filter((post) => post.slug !== currentSlug);

  // Score posts by relevance
  const scoredPosts = allPosts.map((post) => {
    let score = 0;
    if (post.category === currentPost.category) score += 3;
    if (post.series && post.series === currentPost.series) score += 5;
    post.tags?.forEach((tag) => {
      if (currentPost.tags?.includes(tag)) score += 1;
    });
    return { post, score };
  });

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ post }) => post);
}

/**
 * Get adjacent posts for navigation
 */
export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPostsMeta();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
  };
}

/**
 * Get posts in a series
 */
export function getPostsInSeries(seriesName: string): PostMeta[] {
  return getAllPostsMeta()
    .filter((post) => post.series === seriesName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get all series names
 */
export function getAllSeries(): string[] {
  const posts = getAllPosts();
  const seriesSet = new Set<string>();
  posts.forEach((post) => {
    if (post.series) seriesSet.add(post.series);
  });
  return Array.from(seriesSet).sort();
}

/**
 * Get post count by category
 */
export function getPostCountByCategory(): Record<Category, number> {
  const posts = getAllPostsMeta();
  const counts: Record<Category, number> = {
    'ai-strategy': 0,
    'business-transformation': 0,
    'agent-development': 0,
    'future-tech': 0,
    'case-studies': 0,
  };

  posts.forEach((post) => {
    counts[post.category]++;
  });

  return counts;
}

/**
 * Generate an excerpt from content if not provided
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove MDX/Markdown formatting
  const plainText = content
    .replace(/^#+ .+$/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/[*_`]/g, '') // Remove formatting
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last complete sentence within maxLength
  const truncated = plainText.slice(0, maxLength);
  const lastSentence = truncated.lastIndexOf('. ');
  
  if (lastSentence > maxLength / 2) {
    return truncated.slice(0, lastSentence + 1);
  }

  // Fall back to word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace) + '...';
}
