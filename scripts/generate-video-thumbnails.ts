#!/usr/bin/env node
/**
 * Generate static thumbnails from videos for social media sharing
 * Run: npx tsx scripts/generate-video-thumbnails.ts
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

function findVideoFiles(dir: string): string[] {
  const files: string[] = [];
  
  function walk(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.mp4') || entry.name.endsWith('.webm'))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function generateThumbnail(videoPath: string): string | null {
  try {
    const dir = path.dirname(videoPath);
    const ext = path.extname(videoPath);
    const basename = path.basename(videoPath, ext);
    const thumbnailPath = path.join(dir, `${basename}-thumb.jpg`);
    
    // Skip if thumbnail already exists
    if (fs.existsSync(thumbnailPath)) {
      console.log(`✓ Thumbnail already exists: ${thumbnailPath}`);
      return thumbnailPath;
    }
    
    // Generate thumbnail from first frame using ffmpeg
    execSync(
      `ffmpeg -i "${videoPath}" -vframes 1 -vf "scale=1200:-1" -q:v 2 "${thumbnailPath}"`,
      { stdio: 'pipe' }
    );
    
    console.log(`✓ Generated thumbnail: ${thumbnailPath}`);
    return thumbnailPath;
  } catch (error) {
    console.error(`✗ Failed to generate thumbnail for ${videoPath}:`, error);
    return null;
  }
}

async function main() {
  console.log('🎬 Generating video thumbnails for social media...\n');
  
  // Check if ffmpeg is installed
  try {
    execSync('which ffmpeg', { stdio: 'pipe' });
  } catch {
    console.error('❌ ffmpeg is not installed. Please install it first:');
    console.error('   - macOS: brew install ffmpeg');
    console.error('   - Ubuntu/Debian: sudo apt install ffmpeg');
    console.error('   - Arch: sudo pacman -S ffmpeg');
    process.exit(1);
  }
  
  const videoFiles = findVideoFiles(publicDir);
  
  if (videoFiles.length === 0) {
    console.log('No video files found in public directory.');
    return;
  }
  
  console.log(`Found ${videoFiles.length} video file(s)\n`);
  
  let generated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const videoPath of videoFiles) {
    const relativePath = path.relative(publicDir, videoPath);
    console.log(`Processing: ${relativePath}`);
    
    const result = generateThumbnail(videoPath);
    if (result) {
      if (fs.existsSync(result)) {
        generated++;
      } else {
        skipped++;
      }
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log(`  Generated: ${generated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
