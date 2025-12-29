#!/usr/bin/env node
/**
 * Fetch and migrate posts directly from Substack RSS feed
 * 
 * Usage: npm run fetch:substack
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const SUBSTACK_FEED = 'https://mrmetaverse.substack.com/feed';

// Category mapping based on content keywords
const CATEGORY_MAP: Record<string, string> = {
  'ai strategy': 'ai-strategy',
  'ai modernization': 'ai-strategy',
  'budget': 'ai-strategy',
  'business': 'business-transformation',
  'transformation': 'business-transformation',
  'okr': 'business-transformation',
  'founder': 'business-transformation',
  'agents': 'agent-development',
  'ai agent': 'agent-development',
  'rag': 'agent-development',
  'clusters': 'agent-development',
  'model agnostic': 'agent-development',
  'deepseek': 'agent-development',
  'metaverse': 'future-tech',
  'ar': 'future-tech',
  'transparency': 'future-tech',
  'regulation': 'future-tech',
  'data': 'future-tech',
  'pearl': 'future-tech',
};

interface Post {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content: string;
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
    .slice(0, 50);
}

function inferCategory(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (text.includes(keyword)) {
      return category;
    }
  }
  
  return 'ai-strategy';
}

function extractTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
  const tagPatterns = [
    { pattern: /\bai\b|artificial intelligence/i, tag: 'ai' },
    { pattern: /\bagent/i, tag: 'agents' },
    { pattern: /\bllm\b/i, tag: 'llm' },
    { pattern: /\brag\b/i, tag: 'rag' },
    { pattern: /\bstrateg/i, tag: 'strategy' },
    { pattern: /\benterprise/i, tag: 'enterprise' },
    { pattern: /\bmetaverse/i, tag: 'metaverse' },
    { pattern: /\bokr/i, tag: 'okr' },
    { pattern: /\bfound/i, tag: 'founders' },
    { pattern: /\bregulat/i, tag: 'regulation' },
    { pattern: /\bdata/i, tag: 'data' },
    { pattern: /\bscale|scaling/i, tag: 'scaling' },
    { pattern: /\bdeepseek/i, tag: 'deepseek' },
    { pattern: /\bopen.?source/i, tag: 'open-source' },
  ];
  
  for (const { pattern, tag } of tagPatterns) {
    if (pattern.test(text) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }
  
  return tags.slice(0, 5);
}

function htmlToMarkdown(html: string): string {
  return html
    // Remove CDATA wrappers
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
    // Paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    // Bold/Strong
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    // Italic/Em
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Images
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '\n![$2]($1)\n')
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '\n![]($1)\n')
    // Lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // Blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n')
    // Code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
    // Divs and spans (remove)
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    // Break tags
    .replace(/<br\s*\/?>/gi, '\n')
    // Horizontal rules
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractDescription(content: string): string {
  // Get first paragraph as excerpt
  const plainText = htmlToMarkdown(content)
    .replace(/^#+ .+$/gm, '') // Remove headers
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove link formatting
    .replace(/[*_`]/g, '') // Remove formatting
    .replace(/\n+/g, ' ')
    .trim();
  
  // Get first ~160 chars ending at a sentence
  if (plainText.length <= 160) return plainText;
  
  const truncated = plainText.slice(0, 160);
  const lastPeriod = truncated.lastIndexOf('. ');
  if (lastPeriod > 80) {
    return truncated.slice(0, lastPeriod + 1);
  }
  
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace) + '...';
}

async function fetchRSS(): Promise<Post[]> {
  console.log('📡 Fetching RSS feed from Substack...');
  const xml = await fetchUrl(SUBSTACK_FEED);
  
  const posts: Post[] = [];
  
  // Extract items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
    const contentMatch = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
    
    if (titleMatch && linkMatch && pubDateMatch) {
      posts.push({
        title: titleMatch[1],
        link: linkMatch[1],
        pubDate: pubDateMatch[1],
        description: descMatch ? descMatch[1] : '',
        content: contentMatch ? contentMatch[1] : (descMatch ? descMatch[1] : ''),
      });
    }
  }
  
  return posts;
}

function createMDX(post: Post): { filename: string; content: string; year: string } {
  const date = parseDate(post.pubDate);
  const year = date.split('-')[0];
  const slug = slugify(post.title);
  const filename = `${date}-${slug}.mdx`;
  
  const markdownContent = htmlToMarkdown(post.content);
  const excerpt = extractDescription(post.content);
  const category = inferCategory(post.title, markdownContent);
  const tags = extractTags(post.title, markdownContent);
  
  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
date: "${date}"
slug: "${slug}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
category: "${category}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
coverImage: ""
featured: false
draft: false
canonicalUrl: "${post.link}"
---`;

  return {
    filename,
    year,
    content: `${frontmatter}\n\n${markdownContent}`,
  };
}

async function main() {
  console.log('\n🚀 Fetching posts from Substack...\n');
  
  try {
    const posts = await fetchRSS();
    console.log(`📝 Found ${posts.length} posts\n`);
    
    let created = 0;
    let skipped = 0;
    
    for (const post of posts) {
      const { filename, year, content } = createMDX(post);
      
      const yearDir = path.join(process.cwd(), 'content', 'posts', year);
      const filePath = path.join(yearDir, filename);
      
      // Check if already exists
      if (fs.existsSync(filePath)) {
        console.log(`⏭️  Skip (exists): ${post.title}`);
        skipped++;
        continue;
      }
      
      // Create directory
      fs.mkdirSync(yearDir, { recursive: true });
      
      // Create image directory
      const slug = slugify(post.title);
      const imageDir = path.join(process.cwd(), 'public', 'images', 'blog', year, slug);
      fs.mkdirSync(imageDir, { recursive: true });
      
      // Write file
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created: ${post.title}`);
      console.log(`   → content/posts/${year}/${filename}`);
      created++;
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📁 Total posts: ${posts.length}`);
    
    if (created > 0) {
      console.log('\n🔍 Next steps:');
      console.log('   1. Run: npm run lint:content');
      console.log('   2. Review and edit posts as needed');
      console.log('   3. Run: npm run dev to preview');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

