#!/usr/bin/env node
/**
 * Import posts from Medium and Virgent.ai case studies
 * And update all existing posts with their original source
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const MEDIUM_FEED = 'https://medium.com/feed/@mrmetaverse';

// Case studies from Virgent.ai (manually extracted from the page)
const VIRGENT_CASE_STUDIES = [
  {
    title: 'How We Saved a Customer More Than Our Cost in the First Month',
    slug: 'sixty-days-kickoff-to-roi',
    description: 'Production AI agent deployed in 2 weeks, replacing failing chatbot. $10,000+ monthly savings, 50% ticket reduction, ROI in under 60 days.',
    industry: 'Financial Publishing',
    url: 'https://www.virgent.ai/case-studies/sixty-days-kickoff-to-roi',
  },
  {
    title: 'The $2 Million Mistake Most CEOs Are Making Right Now',
    slug: 'task-specific-ai-agents-2026',
    description: 'Gartner predicts 40% of enterprise apps will have task-specific AI agents by 2026. Your competitors are deploying them now.',
    industry: 'Enterprise AI Strategy',
    url: 'https://www.virgent.ai/case-studies/task-specific-ai-agents-2026',
  },
  {
    title: 'Multi-Agent AI Orchestration',
    slug: 'multi-agent-orchestration-sandbox',
    description: 'Building intelligent multi-agent systems with WebLLM, democratic governance, and spatial coordination.',
    industry: 'Enterprise AI Strategy',
    url: 'https://www.virgent.ai/case-studies/multi-agent-orchestration-sandbox',
  },
  {
    title: 'Stopping Fake Leads with Agentic Validation on Our Website',
    slug: 'agentic-contact-form-validation',
    description: 'How we added an explainable agentic layer to our Contact page to filter gibberish and low-quality submissions.',
    industry: 'AI Consulting',
    url: 'https://www.virgent.ai/case-studies/agentic-contact-form-validation',
  },
  {
    title: 'Create And Power Your Own Models - WebLLM',
    slug: 'create-and-power-your-own-models-webllm',
    description: 'How enterprises are deploying browser-native AI models with complete privacy, zero data transmission, and maximum security compliance.',
    industry: 'Enterprise AI Strategy',
    url: 'https://www.virgent.ai/case-studies/create-and-power-your-own-models-webllm',
  },
  {
    title: 'Copilot or ChatGPT: Choosing What Actually Delivers ROI',
    slug: 'beyond-copilot-or-chatgpt',
    description: 'How a pragmatic, vendor-agnostic approach outperforms single-vendor choices and unlocks measurable ROI with hybrid AI.',
    industry: 'Enterprise Software / M365',
    url: 'https://www.virgent.ai/case-studies/beyond-copilot-or-chatgpt',
  },
  {
    title: 'Local Software Agency AI Practice Partnership',
    slug: 'agency-ai-practice-partnership',
    description: 'How we help established software agencies build AI practices and create strategic partnerships in the DMV area.',
    industry: 'Software Development',
    url: 'https://www.virgent.ai/case-studies/agency-ai-practice-partnership',
  },
  {
    title: 'DJ Audio Stems Automation Agent',
    slug: 'dj-audio-stems-agent',
    description: 'How we built a conversational AI agent that saves a professional DJ hundreds of hours by automating audio stem discovery.',
    industry: 'Entertainment & Music',
    url: 'https://www.virgent.ai/case-studies/dj-audio-stems-agent',
  },
  {
    title: 'Manufacturing AI Transformation Discovery',
    slug: 'manufacturing-ai-transformation',
    description: 'Comprehensive AI readiness and process optimization discovery across four divisions of a publicly traded manufacturing company.',
    industry: 'Manufacturing',
    url: 'https://www.virgent.ai/case-studies/manufacturing-ai-transformation',
  },
  {
    title: 'Non-Profit AI Education Workshops',
    slug: 'nonprofit-ai-workshops',
    description: 'How we delivered our signature AI workshop series to diverse audiences, from high school students to business owners.',
    industry: 'Non-Profit Education',
    url: 'https://www.virgent.ai/case-studies/nonprofit-ai-workshops',
  },
  {
    title: 'University AI Curriculum Development',
    slug: 'university-ai-curriculum',
    description: 'How we developed a comprehensive four-part AI lecture series for art students.',
    industry: 'Higher Education',
    url: 'https://www.virgent.ai/case-studies/university-ai-curriculum',
  },
  {
    title: 'How We Built Our Own Website with Agentic Design',
    slug: 'virgent-ai-website-agents',
    description: 'A meta case study: How Virgent AI uses agents and agentic design principles on our own website.',
    industry: 'AI Consulting',
    url: 'https://www.virgent.ai/case-studies/virgent-ai-website-agents',
  },
];

interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  content: string;
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : require('http');
    client.get(url, (res: any) => {
      let data = '';
      res.on('data', (chunk: string) => data += chunk);
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

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '\n![$2]($1)\n')
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '\n![]($1)\n')
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<[^>]+>/g, '')
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
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function fetchMediumPosts(): Promise<MediumPost[]> {
  console.log('📡 Fetching Medium RSS feed...');
  const xml = await fetchUrl(MEDIUM_FEED);
  
  const posts: MediumPost[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const contentMatch = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
    
    if (titleMatch && linkMatch && pubDateMatch) {
      posts.push({
        title: titleMatch[1],
        link: linkMatch[1],
        pubDate: pubDateMatch[1],
        content: contentMatch ? contentMatch[1] : '',
      });
    }
  }
  
  return posts;
}

function createMediumMDX(post: MediumPost): { filename: string; content: string; year: string } {
  const date = parseDate(post.pubDate);
  const year = date.split('-')[0];
  const slug = slugify(post.title);
  const filename = `${date}-${slug}.mdx`;
  
  const markdownContent = htmlToMarkdown(post.content);
  
  // Extract first paragraph as excerpt
  const excerpt = markdownContent
    .replace(/^#+ .+$/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 160) + '...';
  
  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
date: "${date}"
slug: "${slug}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
category: "business-transformation"
tags: ["product-design", "innovation", "startups"]
coverImage: ""
featured: false
draft: false
originalSource: "medium"
canonicalUrl: "${post.link}"
---`;

  const sourceNote = `

---

*Originally published on [Medium](${post.link})*
`;

  return {
    filename,
    year,
    content: `${frontmatter}\n\n${markdownContent}${sourceNote}`,
  };
}

function createCaseStudyMDX(study: typeof VIRGENT_CASE_STUDIES[0]): { filename: string; content: string } {
  const date = '2025-01-01'; // Default date for case studies
  const filename = `${date}-${study.slug}.mdx`;
  
  const frontmatter = `---
title: "${study.title.replace(/"/g, '\\"')}"
date: "${date}"
slug: "${study.slug}"
excerpt: "${study.description.replace(/"/g, '\\"')}"
category: "case-studies"
tags: ["case-study", "ai-implementation", "${study.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"]
coverImage: ""
featured: false
draft: false
originalSource: "virgent"
canonicalUrl: "${study.url}"
---`;

  const content = `
# ${study.title}

**Industry:** ${study.industry}

${study.description}

---

*Read the full case study on [Virgent AI](${study.url})*

---

*Originally published on [Virgent AI Case Studies](https://www.virgent.ai/case-studies)*
`;

  return {
    filename,
    content: `${frontmatter}\n${content}`,
  };
}

async function addSourceToExistingPosts() {
  console.log('\n📝 Updating existing posts with source attribution...\n');
  
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  let updated = 0;
  
  function processDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        processDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Skip if already has originalSource
        if (content.includes('originalSource:')) {
          continue;
        }
        
        // Check if it's a Substack post (has canonicalUrl with substack)
        if (content.includes('mrmetaverse.substack.com')) {
          // Add originalSource field
          content = content.replace(
            /canonicalUrl: "([^"]*)"/,
            'originalSource: "substack"\ncanonicalUrl: "$1"'
          );
          
          // Add source note at the end if not present
          if (!content.includes('Originally published on')) {
            const canonicalMatch = content.match(/canonicalUrl: "([^"]*)"/);
            const canonicalUrl = canonicalMatch ? canonicalMatch[1] : 'https://mrmetaverse.substack.com/';
            content = content.trim() + `\n\n---\n\n*Originally published on [The Interop (Substack)](${canonicalUrl})*\n`;
          }
          
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Updated: ${entry.name}`);
          updated++;
        }
      }
    }
  }
  
  processDir(postsDir);
  console.log(`\n📊 Updated ${updated} Substack posts with source attribution`);
}

async function main() {
  console.log('\n🚀 Importing content from all sources...\n');
  
  // 1. Update existing Substack posts with source attribution
  await addSourceToExistingPosts();
  
  // 2. Import Medium posts
  console.log('\n📰 Importing Medium posts...\n');
  try {
    const mediumPosts = await fetchMediumPosts();
    console.log(`Found ${mediumPosts.length} Medium posts`);
    
    let mediumCreated = 0;
    for (const post of mediumPosts) {
      const { filename, year, content } = createMediumMDX(post);
      const yearDir = path.join(process.cwd(), 'content', 'posts', year);
      const filePath = path.join(yearDir, filename);
      
      if (fs.existsSync(filePath)) {
        console.log(`⏭️  Skip (exists): ${post.title}`);
        continue;
      }
      
      fs.mkdirSync(yearDir, { recursive: true });
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created: ${post.title}`);
      mediumCreated++;
    }
    console.log(`\n📊 Created ${mediumCreated} Medium posts`);
  } catch (error) {
    console.error('⚠️  Error fetching Medium posts:', error);
  }
  
  // 3. Import Virgent case studies
  console.log('\n📊 Importing Virgent AI case studies...\n');
  let casesCreated = 0;
  
  for (const study of VIRGENT_CASE_STUDIES) {
    const { filename, content } = createCaseStudyMDX(study);
    const yearDir = path.join(process.cwd(), 'content', 'posts', '2025');
    const filePath = path.join(yearDir, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skip (exists): ${study.title}`);
      continue;
    }
    
    fs.mkdirSync(yearDir, { recursive: true });
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${study.title}`);
    casesCreated++;
  }
  console.log(`\n📊 Created ${casesCreated} case studies`);
  
  console.log('\n🎉 Import complete!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run lint:content');
  console.log('  2. Review and edit posts as needed');
  console.log('  3. Run: npm run dev to preview');
}

main();

