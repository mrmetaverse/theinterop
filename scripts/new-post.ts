#!/usr/bin/env node
/**
 * New Post Scaffolding Script
 * 
 * Usage:
 *   pnpm new:post "Post Title"
 *   pnpm new:post "Post Title" --category=ai-strategy --tags=agents,interop
 * 
 * Creates:
 *   - MDX file at /content/posts/YYYY/YYYY-MM-DD-slug.mdx
 *   - Asset folder at /public/images/blog/YYYY/slug/
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const VALID_CATEGORIES = [
  'ai-strategy',
  'business-transformation', 
  'agent-development',
  'future-tech',
  'case-studies',
];

const CATEGORY_LABELS: Record<string, string> = {
  'ai-strategy': 'AI Strategy',
  'business-transformation': 'Business Transformation',
  'agent-development': 'Agent Development',
  'future-tech': 'Future Tech',
  'case-studies': 'Case Studies',
};

interface PostOptions {
  title: string;
  category: string;
  tags: string[];
  date: string;
  draft: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function parseArgs(): Partial<PostOptions> {
  const args = process.argv.slice(2);
  const options: Partial<PostOptions> = {};

  for (const arg of args) {
    if (arg.startsWith('--category=')) {
      options.category = arg.split('=')[1];
    } else if (arg.startsWith('--tags=')) {
      options.tags = arg.split('=')[1].split(',').map(t => t.trim());
    } else if (arg.startsWith('--date=')) {
      options.date = arg.split('=')[1];
    } else if (arg === '--published' || arg === '--no-draft') {
      options.draft = false;
    } else if (!arg.startsWith('--')) {
      options.title = arg;
    }
  }

  return options;
}

function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function prompt(rl: readline.Interface, question: string, defaultValue?: string): Promise<string> {
  const displayQuestion = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
  
  return new Promise((resolve) => {
    rl.question(displayQuestion, (answer) => {
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

async function selectCategory(rl: readline.Interface): Promise<string> {
  console.log('\nAvailable categories:');
  VALID_CATEGORIES.forEach((cat, index) => {
    console.log(`  ${index + 1}. ${CATEGORY_LABELS[cat]} (${cat})`);
  });
  
  const selection = await prompt(rl, '\nSelect category (number or slug)', '1');
  
  // Check if it's a number
  const num = parseInt(selection, 10);
  if (!isNaN(num) && num >= 1 && num <= VALID_CATEGORIES.length) {
    return VALID_CATEGORIES[num - 1];
  }
  
  // Check if it's a valid slug
  if (VALID_CATEGORIES.includes(selection)) {
    return selection;
  }
  
  console.log('Invalid selection, defaulting to ai-strategy');
  return 'ai-strategy';
}

function generateFrontmatter(options: PostOptions): string {
  const { title, category, tags, date, draft } = options;
  const slug = slugify(title);
  
  return `---
title: "${title}"
date: "${date}"
slug: "${slug}"
excerpt: "One to three sentence summary that shows up on listings and SEO."
category: "${category}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
coverImage: "/images/blog/${date.split('-')[0]}/${slug}/cover.png"
featured: false
draft: ${draft}
originalSource: "jessealton"
canonicalUrl: ""
---`;
}

function generateBody(title: string): string {
  return `

# ${title}

_Add your introduction here. This should hook the reader and set up what they will learn._

## The Problem

<!-- Describe the challenge or situation -->

## The Approach

<!-- Your methodology or framework -->

## Key Takeaways

1. **First insight** — Explanation
2. **Second insight** — Explanation  
3. **Third insight** — Explanation

## Conclusion

<!-- Wrap up with actionable next steps -->

---

_What do you think? [Let me know on Twitter](https://twitter.com/mrmetaverse) or [drop me an email](mailto:jesse@jessealton.com)._
`;
}

async function main() {
  console.log('\n📝 The Interop — New Post Generator\n');
  
  const parsedArgs = parseArgs();
  const rl = createReadlineInterface();
  
  try {
    // Get title
    let title = parsedArgs.title;
    if (!title) {
      title = await prompt(rl, 'Post title');
      if (!title) {
        console.log('❌ Title is required');
        process.exit(1);
      }
    }
    
    // Get category
    let category = parsedArgs.category;
    if (!category || !VALID_CATEGORIES.includes(category)) {
      category = await selectCategory(rl);
    }
    
    // Get tags
    let tags = parsedArgs.tags || [];
    if (tags.length === 0) {
      const tagsInput = await prompt(rl, 'Tags (comma-separated)', '');
      if (tagsInput) {
        tags = tagsInput.split(',').map(t => t.trim().toLowerCase());
      }
    }
    
    // Get date
    const today = formatDate(new Date());
    const date = parsedArgs.date || today;
    
    // Draft by default
    const draft = parsedArgs.draft !== false;
    
    rl.close();
    
    // Generate paths
    const slug = slugify(title);
    const year = date.split('-')[0];
    const filename = `${date}-${slug}.mdx`;
    const postsDir = path.join(process.cwd(), 'content', 'posts', year);
    const filePath = path.join(postsDir, filename);
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'blog', year, slug);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`\n❌ File already exists: ${filePath}`);
      process.exit(1);
    }
    
    // Create directories
    fs.mkdirSync(postsDir, { recursive: true });
    fs.mkdirSync(imagesDir, { recursive: true });
    
    // Create placeholder for cover image directory
    const gitkeepPath = path.join(imagesDir, '.gitkeep');
    fs.writeFileSync(gitkeepPath, '');
    
    // Generate content
    const frontmatter = generateFrontmatter({ title, category, tags, date, draft });
    const body = generateBody(title);
    const content = frontmatter + body;
    
    // Write file
    fs.writeFileSync(filePath, content);
    
    // Success output
    console.log('\n✅ Post created successfully!\n');
    console.log('📄 File:', path.relative(process.cwd(), filePath));
    console.log('🖼️  Images:', path.relative(process.cwd(), imagesDir));
    console.log('\n📋 Frontmatter:');
    console.log('   Title:', title);
    console.log('   Date:', date);
    console.log('   Slug:', slug);
    console.log('   Category:', CATEGORY_LABELS[category]);
    console.log('   Tags:', tags.length > 0 ? tags.join(', ') : '(none)');
    console.log('   Draft:', draft);
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Edit the post:', filePath);
    console.log('   2. Update the excerpt');
    console.log('   3. Add a cover image to:', imagesDir);
    console.log('   4. Preview: pnpm dev');
    console.log('   5. When ready, set draft: false');
    console.log('   6. Commit and push to publish\n');
    
  } catch (error) {
    rl.close();
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

