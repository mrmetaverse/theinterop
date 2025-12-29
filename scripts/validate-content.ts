#!/usr/bin/env node
/**
 * Content Validation Script
 * 
 * Validates all MDX posts for:
 * - Required frontmatter fields
 * - Valid date format (ISO YYYY-MM-DD)
 * - Unique slugs
 * - Valid category (from controlled list)
 * - Existing cover image files
 * 
 * Usage:
 *   pnpm lint:content
 *   pnpm lint:content --fix  (auto-fix where possible)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const VALID_CATEGORIES = [
  'ai-strategy',
  'business-transformation',
  'agent-development',
  'future-tech',
  'case-studies',
];

const REQUIRED_FIELDS = ['title', 'date', 'slug', 'excerpt', 'category'];

interface ValidationError {
  file: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationError[];
  postCount: number;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * Recursively find all MDX/MD files
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
 * Validate a single post file
 */
function validatePost(filePath: string, allSlugs: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];
  const relativePath = path.relative(process.cwd(), filePath);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!frontmatter[field]) {
        errors.push({
          file: relativePath,
          field,
          message: `Missing required field: ${field}`,
          severity: 'error',
        });
      } else if (typeof frontmatter[field] === 'string' && frontmatter[field].trim() === '') {
        errors.push({
          file: relativePath,
          field,
          message: `Field is empty: ${field}`,
          severity: 'error',
        });
      }
    }

    // Validate date format (YYYY-MM-DD)
    if (frontmatter.date) {
      const dateStr = String(frontmatter.date);
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      // Handle Date objects from gray-matter
      let dateToCheck = dateStr;
      if (frontmatter.date instanceof Date) {
        dateToCheck = frontmatter.date.toISOString().split('T')[0];
      }
      
      if (!isoDateRegex.test(dateToCheck)) {
        // Try parsing as date
        const parsed = new Date(dateStr);
        if (isNaN(parsed.getTime())) {
          errors.push({
            file: relativePath,
            field: 'date',
            message: `Invalid date format: "${dateStr}". Use ISO format: YYYY-MM-DD`,
            severity: 'error',
          });
        } else {
          errors.push({
            file: relativePath,
            field: 'date',
            message: `Date should be ISO format YYYY-MM-DD, got: "${dateStr}"`,
            severity: 'warning',
          });
        }
      }
    }

    // Validate slug uniqueness
    if (frontmatter.slug) {
      const slug = String(frontmatter.slug);
      if (allSlugs.has(slug)) {
        errors.push({
          file: relativePath,
          field: 'slug',
          message: `Duplicate slug: "${slug}"`,
          severity: 'error',
        });
      } else {
        allSlugs.add(slug);
      }

      // Validate slug format (kebab-case)
      const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
      if (!kebabRegex.test(slug)) {
        errors.push({
          file: relativePath,
          field: 'slug',
          message: `Slug should be kebab-case: "${slug}"`,
          severity: 'warning',
        });
      }
    }

    // Validate category
    if (frontmatter.category && !VALID_CATEGORIES.includes(frontmatter.category)) {
      errors.push({
        file: relativePath,
        field: 'category',
        message: `Invalid category: "${frontmatter.category}". Valid options: ${VALID_CATEGORIES.join(', ')}`,
        severity: 'error',
      });
    }

    // Validate cover image exists (if specified and not a placeholder)
    if (frontmatter.coverImage) {
      const coverPath = frontmatter.coverImage;
      if (!coverPath.includes('placeholder') && !coverPath.includes('example')) {
        const fullCoverPath = path.join(process.cwd(), 'public', coverPath);
        if (!fs.existsSync(fullCoverPath)) {
          errors.push({
            file: relativePath,
            field: 'coverImage',
            message: `Cover image not found: ${coverPath}`,
            severity: 'warning',
          });
        }
      }
    }

    // Validate tags format (should be array)
    if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
      errors.push({
        file: relativePath,
        field: 'tags',
        message: 'Tags should be an array',
        severity: 'error',
      });
    }

    // Validate excerpt length
    if (frontmatter.excerpt) {
      const excerpt = String(frontmatter.excerpt);
      if (excerpt.length < 20) {
        errors.push({
          file: relativePath,
          field: 'excerpt',
          message: `Excerpt is too short (${excerpt.length} chars). Should be 1-3 sentences.`,
          severity: 'warning',
        });
      }
      if (excerpt.length > 300) {
        errors.push({
          file: relativePath,
          field: 'excerpt',
          message: `Excerpt is too long (${excerpt.length} chars). Keep under 300 characters.`,
          severity: 'warning',
        });
      }
    }

    // Check for empty content
    if (!content || content.trim().length < 50) {
      errors.push({
        file: relativePath,
        field: 'content',
        message: 'Post content is too short or empty',
        severity: 'warning',
      });
    }

    // Validate updatedDate if present
    if (frontmatter.updatedDate) {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const dateStr = String(frontmatter.updatedDate);
      
      let dateToCheck = dateStr;
      if (frontmatter.updatedDate instanceof Date) {
        dateToCheck = frontmatter.updatedDate.toISOString().split('T')[0];
      }
      
      if (!isoDateRegex.test(dateToCheck)) {
        errors.push({
          file: relativePath,
          field: 'updatedDate',
          message: `Invalid updatedDate format: "${dateStr}". Use ISO format: YYYY-MM-DD`,
          severity: 'warning',
        });
      }
    }

  } catch (error) {
    errors.push({
      file: relativePath,
      field: 'parse',
      message: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Main validation function
 */
function validateContent(): ValidationResult {
  const files = getAllPostFiles();
  const allSlugs = new Set<string>();
  const allErrors: ValidationError[] = [];

  for (const file of files) {
    const errors = validatePost(file, allSlugs);
    allErrors.push(...errors);
  }

  return {
    errors: allErrors.filter(e => e.severity === 'error'),
    warnings: allErrors.filter(e => e.severity === 'warning'),
    postCount: files.length,
  };
}

/**
 * Format and print results
 */
function printResults(result: ValidationResult): void {
  console.log('\n📝 Content Validation Report\n');
  console.log(`Found ${result.postCount} post(s)\n`);

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('✅ All posts are valid!\n');
    return;
  }

  if (result.errors.length > 0) {
    console.log(`❌ ${result.errors.length} error(s):\n`);
    for (const error of result.errors) {
      console.log(`  ${error.file}`);
      console.log(`    └─ [${error.field}] ${error.message}\n`);
    }
  }

  if (result.warnings.length > 0) {
    console.log(`⚠️  ${result.warnings.length} warning(s):\n`);
    for (const warning of result.warnings) {
      console.log(`  ${warning.file}`);
      console.log(`    └─ [${warning.field}] ${warning.message}\n`);
    }
  }

  console.log('─'.repeat(50));
  console.log(`Summary: ${result.errors.length} error(s), ${result.warnings.length} warning(s)\n`);
}

// Main execution
const result = validateContent();
printResults(result);

// Exit with error code if there are errors
if (result.errors.length > 0) {
  console.log('❌ Validation failed. Fix errors before building.\n');
  process.exit(1);
} else {
  console.log('✅ Validation passed.\n');
  process.exit(0);
}

