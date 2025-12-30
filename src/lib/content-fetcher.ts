/**
 * Content Fetcher - Fetches full content from external sources
 * Supports: Virgent AI, Substack, Medium
 */

import { db } from './db';
import { posts, type NewPost } from './db/schema';
import { eq } from 'drizzle-orm';

// Source configurations
export const CONTENT_SOURCES = {
  virgent: {
    name: 'Virgent AI',
    baseUrl: 'https://www.virgent.ai',
    casesUrl: 'https://www.virgent.ai/case-studies',
    // Known case study slugs - these will be fetched
    cases: [
      'peake-ai-phone-system',
      'how-we-saved-a-customer',
      'the-two-million-dollar-mistake',
      'multi-agent-orchestration',
      'agentic-contact-form-validation',
      'webllm',
      'copilot-or-chatgpt',
      'agency-ai-practice-partnership',
      'dj-audio-stems-agent',
      'manufacturing-ai-transformation',
      'nonprofit-ai-workshops',
      'university-ai-curriculum',
      'virgent-ai-website-agents',
    ],
  },
  substack: {
    name: 'The Interop (Substack)',
    baseUrl: 'https://mrmetaverse.substack.com',
    feedUrl: 'https://mrmetaverse.substack.com/feed',
  },
} as const;

// Content extraction from HTML (basic implementation)
function extractTextContent(html: string): string {
  // Remove scripts, styles, and HTML tags
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Convert HTML to Markdown (basic)
function htmlToMarkdown(html: string): string {
  let md = html;
  
  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  
  // Paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  
  // Lists
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?[uo]l[^>]*>/gi, '\n');
  
  // Bold and italic
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  
  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n\n');
  
  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');
  
  // Remove remaining tags
  md = md.replace(/<[^>]+>/g, '');
  
  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();
  
  return md;
}

// Fetch content from a URL with proper headers
async function fetchWithHeaders(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheInteropBot/1.0; +https://jessealton.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 0 }, // Don't cache
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

// Parse Virgent AI case study page
interface ParsedContent {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  date?: string;
}

function parseVirgentCaseStudy(html: string, slug: string): ParsedContent | null {
  try {
    // Extract title from og:title or h1
    const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
                       html.match(/<h1[^>]*>([^<]*)<\/h1>/);
    const title = titleMatch?.[1] || slug.replace(/-/g, ' ');
    
    // Extract description/excerpt
    const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
                      html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
    const excerpt = descMatch?.[1] || '';
    
    // Extract cover image
    const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/);
    const coverImage = imgMatch?.[1];
    
    // Try to find the main content area
    // Look for common content containers
    let contentHtml = '';
    
    // Try article tag first
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      contentHtml = articleMatch[1];
    } else {
      // Try main content div patterns
      const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                        html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                        html.match(/<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (mainMatch) {
        contentHtml = mainMatch[1];
      }
    }
    
    // Convert to markdown
    const content = contentHtml ? htmlToMarkdown(contentHtml) : '';
    
    return {
      title,
      content: content || `Content for ${title} - Visit the original source for full content.`,
      excerpt,
      coverImage,
    };
  } catch (error) {
    console.error(`Error parsing Virgent case study ${slug}:`, error);
    return null;
  }
}

// Fetch and parse a Virgent AI case study
export async function fetchVirgentCaseStudy(slug: string): Promise<ParsedContent | null> {
  const url = `${CONTENT_SOURCES.virgent.casesUrl}/${slug}`;
  const html = await fetchWithHeaders(url);
  
  if (!html) {
    return null;
  }
  
  return parseVirgentCaseStudy(html, slug);
}

// Save or update a post in the database
export async function upsertPost(postData: Omit<NewPost, 'id' | 'createdAt'>): Promise<void> {
  const existing = await db.select().from(posts).where(eq(posts.slug, postData.slug)).limit(1);
  
  if (existing.length > 0) {
    // Update existing post
    await db.update(posts)
      .set({
        ...postData,
        updatedAt: new Date(),
        lastFetched: new Date(),
      })
      .where(eq(posts.slug, postData.slug));
  } else {
    // Insert new post
    await db.insert(posts).values({
      ...postData,
      lastFetched: new Date(),
    });
  }
}

// Get post from database by slug
export async function getPostFromDb(slug: string) {
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result[0] || null;
}

// Get all posts from database
export async function getAllPostsFromDb() {
  return await db.select().from(posts).orderBy(posts.date);
}

// Sync all Virgent AI case studies
export async function syncVirgentCaseStudies(): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  
  for (const slug of CONTENT_SOURCES.virgent.cases) {
    try {
      const content = await fetchVirgentCaseStudy(slug);
      
      if (content) {
        await upsertPost({
          slug,
          title: content.title,
          excerpt: content.excerpt,
          content: content.content,
          category: 'case-studies',
          tags: JSON.stringify(['case-study', 'ai-implementation']),
          coverImage: content.coverImage || null,
          date: new Date(), // Will be updated with actual date if available
          originalSource: 'virgent',
          canonicalUrl: `${CONTENT_SOURCES.virgent.casesUrl}/${slug}`,
          sourceUrl: `${CONTENT_SOURCES.virgent.casesUrl}/${slug}`,
          updatedAt: new Date(),
        });
        success++;
        console.log(`✓ Synced: ${slug}`);
      } else {
        failed++;
        console.error(`✗ Failed: ${slug}`);
      }
    } catch (error) {
      failed++;
      console.error(`✗ Error syncing ${slug}:`, error);
    }
    
    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return { success, failed };
}

// Check if content needs refresh (older than 24 hours)
export function needsRefresh(lastFetched: Date | null): boolean {
  if (!lastFetched) return true;
  const hoursSinceUpdate = (Date.now() - lastFetched.getTime()) / (1000 * 60 * 60);
  return hoursSinceUpdate > 24;
}
