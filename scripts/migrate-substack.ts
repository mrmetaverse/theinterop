#!/usr/bin/env node
/**
 * Substack Migration Script
 * 
 * This script converts Substack export data to MDX files compatible with The Interop site.
 * 
 * Usage:
 * 1. Export your Substack data (Settings → Exports → Export posts)
 * 2. Unzip the export to a folder (e.g., ./substack-export)
 * 3. Run: npm run migrate ./substack-export
 * 
 * The script will:
 * - Parse the posts.csv file to get post metadata
 * - Convert HTML content to MDX/Markdown
 * - Download and save images locally
 * - Generate frontmatter with appropriate metadata
 * - Save posts to content/posts/YYYY/YYYY-MM-DD-slug.mdx (canonical format)
 */

import fs from 'fs';
import path from 'path';
import TurndownService from 'turndown';

// Category mapping from Substack tags to site categories
const CATEGORY_MAP: Record<string, string> = {
  'ai': 'ai-strategy',
  'artificial intelligence': 'ai-strategy',
  'strategy': 'ai-strategy',
  'business': 'business-transformation',
  'transformation': 'business-transformation',
  'digital transformation': 'business-transformation',
  'agents': 'agent-development',
  'ai agents': 'agent-development',
  'llm': 'agent-development',
  'future': 'future-tech',
  'metaverse': 'future-tech',
  'emerging tech': 'future-tech',
  'case study': 'case-studies',
  'implementation': 'case-studies',
  'lessons': 'case-studies',
};

interface SubstackPost {
  title: string;
  subtitle: string;
  post_date: string;
  is_published: boolean;
  slug: string;
  audience: string;
  write_comment_permissions: string;
  section_id: string;
  canonical_url: string;
  post_id: string;
  html_body?: string;
}

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Custom rules for better conversion
turndownService.addRule('codeBlocks', {
  filter: ['pre'],
  replacement: (content, node) => {
    const code = (node as HTMLPreElement).textContent || '';
    return `\n\`\`\`\n${code}\n\`\`\`\n`;
  },
});

turndownService.addRule('substackImages', {
  filter: 'img',
  replacement: (content, node) => {
    const img = node as HTMLImageElement;
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    
    // For now, keep Substack CDN URLs
    // TODO: Download and save images locally
    return `\n![${alt}](${src})\n`;
  },
});

function parseCSV(csvContent: string): SubstackPost[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  
  const posts: SubstackPost[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Handle CSV with quoted fields
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const post: Record<string, string> = {};
    headers.forEach((header, index) => {
      post[header] = values[index] || '';
    });
    
    posts.push(post as unknown as SubstackPost);
  }
  
  return posts;
}

function inferCategory(title: string, subtitle: string, tags: string[]): string {
  const text = `${title} ${subtitle} ${tags.join(' ')}`.toLowerCase();
  
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (text.includes(keyword)) {
      return category;
    }
  }
  
  // Default category
  return 'ai-strategy';
}

function extractTags(title: string, subtitle: string): string[] {
  const text = `${title} ${subtitle}`.toLowerCase();
  const tags: string[] = [];
  
  const tagPatterns = [
    { pattern: /\bai\b|artificial intelligence/i, tag: 'ai' },
    { pattern: /\bagent/i, tag: 'agents' },
    { pattern: /\bllm\b|large language model/i, tag: 'llm' },
    { pattern: /\brag\b|retrieval/i, tag: 'rag' },
    { pattern: /\bstrategy/i, tag: 'strategy' },
    { pattern: /\benterprise/i, tag: 'enterprise' },
    { pattern: /\bproduction/i, tag: 'production' },
    { pattern: /\btransformation/i, tag: 'transformation' },
    { pattern: /\bmetaverse/i, tag: 'metaverse' },
    { pattern: /\bopen.?source/i, tag: 'open-source' },
    { pattern: /\bmcp\b|model context protocol/i, tag: 'mcp' },
  ];
  
  for (const { pattern, tag } of tagPatterns) {
    if (pattern.test(text) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }
  
  return tags.slice(0, 5); // Limit to 5 tags
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

function generateFrontmatter(post: SubstackPost, content: string): string {
  const tags = extractTags(post.title, post.subtitle);
  const category = inferCategory(post.title, post.subtitle, tags);
  const slug = sanitizeSlug(post.slug || post.title);
  const date = formatDate(post.post_date);
  
  // Calculate reading time
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return `---
title: "${post.title.replace(/"/g, '\\"')}"
date: "${date}"
slug: "${slug}"
excerpt: "${(post.subtitle || '').replace(/"/g, '\\"')}"
category: "${category}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
coverImage: ""
featured: false
draft: false
canonicalUrl: "${post.canonical_url || ''}"
---
`;
}

async function convertPost(post: SubstackPost, htmlContent: string): Promise<{ content: string; date: string; slug: string }> {
  // Convert HTML to Markdown
  const markdownContent = turndownService.turndown(htmlContent);
  
  // Generate frontmatter
  const frontmatter = generateFrontmatter(post, markdownContent);
  const date = formatDate(post.post_date);
  const slug = sanitizeSlug(post.slug || post.title);
  
  return {
    content: `${frontmatter}\n${markdownContent}`,
    date,
    slug,
  };
}

async function migrateSubstack(exportDir: string): Promise<void> {
  console.log('🚀 Starting Substack migration...\n');
  
  const postsBase = path.join(process.cwd(), 'content/posts');
  const imagesBase = path.join(process.cwd(), 'public/images/blog');
  
  // Check for posts.csv
  const csvPath = path.join(exportDir, 'posts.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('❌ posts.csv not found in export directory');
    console.log('   Make sure you have extracted the Substack export ZIP file.');
    process.exit(1);
  }
  
  // Parse CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const posts = parseCSV(csvContent);
  
  console.log(`📝 Found ${posts.length} posts in export\n`);
  
  let successCount = 0;
  let skipCount = 0;
  
  for (const post of posts) {
    // Skip unpublished posts
    if (post.is_published === false || post.is_published.toString().toLowerCase() === 'false') {
      console.log(`⏭️  Skipping draft: ${post.title}`);
      skipCount++;
      continue;
    }
    
    const htmlPath = path.join(exportDir, 'posts', `${post.post_id}.html`);
    
    // Check if HTML file exists
    let htmlContent = '';
    if (fs.existsSync(htmlPath)) {
      htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    } else {
      // Try alternative naming
      const slug = sanitizeSlug(post.slug || post.title);
      const altHtmlPath = path.join(exportDir, 'posts', `${slug}.html`);
      if (fs.existsSync(altHtmlPath)) {
        htmlContent = fs.readFileSync(altHtmlPath, 'utf-8');
      } else {
        console.log(`⚠️  No HTML file found for: ${post.title}`);
        // Create a minimal post with just the subtitle
        htmlContent = `<p>${post.subtitle || ''}</p>`;
      }
    }
    
    try {
      const { content: mdxContent, date, slug } = await convertPost(post, htmlContent);
      
      // Create year directory
      const year = date.split('-')[0];
      const yearDir = path.join(postsBase, year);
      fs.mkdirSync(yearDir, { recursive: true });
      
      // Create image directory
      const imageDir = path.join(imagesBase, year, slug);
      fs.mkdirSync(imageDir, { recursive: true });
      fs.writeFileSync(path.join(imageDir, '.gitkeep'), '');
      
      // Write MDX file with canonical naming
      const filename = `${date}-${slug}.mdx`;
      const outputPath = path.join(yearDir, filename);
      
      fs.writeFileSync(outputPath, mdxContent);
      console.log(`✅ Converted: ${post.title}`);
      console.log(`   → ${path.relative(process.cwd(), outputPath)}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error converting ${post.title}:`, error);
    }
  }
  
  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Successfully converted: ${successCount}`);
  console.log(`   ⏭️  Skipped (drafts): ${skipCount}`);
  console.log(`   📁 Output directory: ${postsBase}`);
  console.log('\n🎉 Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Review the generated MDX files in content/posts/');
  console.log('2. Run: npm run lint:content');
  console.log('3. Update categories and tags as needed');
  console.log('4. Download and localize any images');
  console.log('5. Run npm run dev to preview the site');
}

// Main execution
const exportDir = process.argv[2];

if (!exportDir) {
  console.log('Usage: npm run migrate <substack-export-dir>');
  console.log('\nExample: npm run migrate ./substack-export');
  process.exit(1);
}

if (!fs.existsSync(exportDir)) {
  console.error(`❌ Export directory not found: ${exportDir}`);
  process.exit(1);
}

migrateSubstack(exportDir);
