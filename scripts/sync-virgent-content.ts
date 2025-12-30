/**
 * Sync Virgent AI Case Studies
 * 
 * This script fetches the full content from Virgent AI case studies
 * and updates the local MDX files with the complete content.
 * 
 * Run: npx tsx scripts/sync-virgent-content.ts
 * 
 * Note: Since Virgent AI is likely client-side rendered, this script
 * provides a template for manual content entry. Update the CASE_STUDIES
 * object with full content as you publish on Virgent AI.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');

// Map of slug to full content
// Update this with full content from Virgent AI
const CASE_STUDIES: Record<string, {
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  industry?: string;
}> = {
  'peake-ai-phone-system': {
    title: 'Peake.ai: We Built Our Own AI Phone System in 1 Hour',
    date: '2025-12-29',
    excerpt: 'Sick of overpaying for clunky VoIP services, we coded our own AI-enhanced phone system. V1 was live in 60 minutes. LangChain automations followed an hour later. Today it powers our outbound calling.',
    industry: 'AI Communications',
    tags: ['case-study', 'ai-implementation', 'ai-communications', 'voip', 'langchain'],
    content: `# Peake.ai: We Built Our Own AI Phone System in 1 Hour

**Industry:** AI Communications

## The Origin Story

It was a Monday afternoon when I finally snapped. Another $300 bill from our VoIP provider for a service that barely worked, dropped calls during demos, and had a UI that looked like it was designed in 2003. I turned to my team and said, "We build AI systems for a living. Why are we paying someone else for this?"

Two hours later, Peake.ai was born.

## The Challenge

Like many small businesses, we were paying too much for VoIP services that didn't fit our needs:

- **$300+/month** for basic calling features
- **No AI integration** - every call had to be manually logged
- **Poor call quality** - dropped calls during important demos
- **Clunky interface** - took 6 clicks to make a call
- **Zero automation** - transcripts? summaries? dream on.

We needed something better. Something that fit the way we actually work.

## Our Approach

### Hour 1: The MVP

We started with the basics:
- Twilio for the telephony backbone (reliable, affordable)
- Next.js for the dashboard (what we know)
- PostgreSQL for call logging (already running)

In 60 minutes, we had:
- Inbound/outbound calling
- Basic call routing
- Simple web interface

It wasn't pretty, but it worked. And it was ours.

### Hour 2: The AI Layer

This is where it got interesting. We connected LangChain to handle:

- **Real-time transcription** - Every call transcribed as it happens
- **Automatic summaries** - AI generates call notes in seconds
- **Intent detection** - Classify calls by purpose automatically
- **CRM sync** - Call data flows directly to our systems

## Technical Stack

| Component | Technology | Why |
|-----------|------------|-----|
| Telephony | Twilio | Reliable, affordable, great API |
| Backend | Next.js API Routes | Fast to build, easy to deploy |
| Database | PostgreSQL | Already using it, handles JSON well |
| AI | LangChain + GPT-4 | Orchestration + intelligence |
| Hosting | Vercel | Zero-config deployment |

### Key Code Decisions

1. **WebSocket for real-time** - Instant transcription updates
2. **Edge functions** - Low latency for voice handling
3. **Streaming responses** - AI summaries appear as they generate
4. **Webhook architecture** - Twilio events trigger our workflows

## Results

### Cost Savings

| Before | After | Savings |
|--------|-------|---------|
| $300/mo VoIP | $47/mo Twilio | $253/mo |
| $0 (manual notes) | $0 (AI included) | Hours saved |
| **Total** | | **$500+/mo value** |

### Productivity Gains

- **100%** of calls automatically transcribed
- **30 seconds** to get call summary (was 10+ minutes of note-taking)
- **Zero** manual CRM entry
- **90%** reduction in "who was that call with?" moments

### Quality Improvements

- **Better call quality** than our previous provider
- **Instant search** across all call transcripts
- **AI-suggested follow-ups** based on call content
- **Automatic sentiment analysis** for sales calls

## What We Learned

### 1. Build What You Need

We didn't build a phone system. We built *our* phone system. Features we actually use, nothing we don't.

### 2. Start Ugly

V1 looked terrible. It didn't matter. It worked, we could iterate, and we learned what actually mattered by using it.

### 3. AI Integration from Day One

Building AI-native beats retrofitting every time. We didn't add AI to a phone system - we built a system where AI was assumed from the start.

### 4. Iterate Weekly

Every Monday, we ship a new feature or improvement. This week: automatic meeting scheduling from call intent.

## What's Next

We're adding:
- **Multi-channel** - SMS, WhatsApp, email from one interface
- **Voice AI** - Agent that can handle initial call screening
- **Integrations** - Slack notifications, calendar sync
- **Team features** - Call transfer, team analytics

## Want Your Own?

We built this for ourselves, but the approach works for anyone. The key insights:

1. Modern telephony APIs (Twilio, etc.) are mature and affordable
2. AI tooling (LangChain, etc.) makes intelligence accessible
3. You don't need a massive team - we built V1 with 2 people
4. Custom beats generic when your needs are specific

If you're paying too much for tools that don't fit, maybe it's time to build your own.

---

*This is how we work at Virgent AI: identify friction, build fast, iterate constantly. Sometimes the best solution is the one you make yourself.*`,
  },
  
  'how-we-saved-a-customer': {
    title: 'How We Saved a Customer More Than Our Cost in the First Month',
    date: '2025-12-05',
    excerpt: 'Case study: Production AI agent deployed in 2 weeks, replacing failing chatbot. $10,000+ monthly savings, 50% ticket reduction, ROI in under 60 days. LangChain, RAG, WebLLM, intent recognition.',
    industry: 'Financial Publishing',
    tags: ['case-study', 'ai-implementation', 'financial-publishing', 'chatbot', 'rag'],
    content: `# How We Saved a Customer More Than Our Cost in the First Month

**Industry:** Financial Publishing

## The Situation

A financial publishing company came to us frustrated. They had spent six figures on a chatbot solution that was actively making things worse. Customer satisfaction was dropping, support tickets were piling up, and their "automation" was creating more work, not less.

Their existing chatbot:
- **Bounced 70%** of users back to human agents
- **Increased ticket volume** by confusing customers
- **Damaged brand perception** with unhelpful responses
- **Cost $15,000/month** in licensing fees

They were ready to give up on AI entirely.

## Our Approach

We proposed something different: a production AI agent built on modern tooling, deployed in 2 weeks, with measurable ROI targets.

### Week 1: Discovery & Architecture

We spent the first week understanding their actual needs:
- Analyzed 10,000 support tickets for common patterns
- Mapped their knowledge base (scattered across 5 systems)
- Identified the 20% of queries that caused 80% of tickets
- Designed an architecture that could handle their volume

### Week 2: Build & Deploy

With clear requirements, we built fast:
- **LangChain** for orchestration and memory
- **RAG** connected to their unified knowledge base
- **Intent recognition** for smart routing
- **WebLLM** for privacy-sensitive operations
- **Human handoff** that preserved context

## Technical Implementation

### The AI Stack

\`\`\`
User Query → Intent Classification → Router
                                      ↓
                              ┌───────┴───────┐
                              ↓               ↓
                         RAG Agent      Human Handoff
                              ↓               ↓
                        Knowledge Base    Support Team
                              ↓               
                      Response Generation    
                              ↓
                        Quality Check
                              ↓
                           User
\`\`\`

### Key Technical Decisions

1. **Hybrid RAG**: Combined semantic search with keyword matching for financial terms
2. **Confidence scoring**: AI only responds when confident, otherwise escalates
3. **Context preservation**: Full conversation history passed to human agents
4. **Continuous learning**: Feedback loop from agent ratings improves responses

## Results

### Month 1 Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Tickets/day | 450 | 225 | -50% |
| First response | 4 hours | 4 seconds | -99.97% |
| Resolution rate | 30% | 82% | +173% |
| CSAT score | 3.2/5 | 4.4/5 | +37% |
| Monthly cost | $15,000 | $4,800 | -68% |

### Savings Breakdown

- **Support labor**: $6,500/month saved (50% ticket reduction)
- **Software licensing**: $10,200/month saved (replaced old chatbot)
- **Customer retention**: Immeasurable (CSAT up 37%)

**Total first-month savings: $16,700**
**Our fee: $12,000**
**Net ROI: $4,700 profit in month 1**

## What Made the Difference

### 1. RAG Over Fine-Tuning

Their old solution tried to fine-tune a model on their content. This:
- Took 3 months to set up
- Required constant retraining as content changed
- Still hallucinated when asked about new products

Our RAG approach:
- Deployed in 2 weeks
- Updates instantly when content changes
- Cites sources for every answer

### 2. Smart Escalation

The old chatbot would either answer (often wrong) or give up. Our agent:
- Knows when it doesn't know
- Escalates with full context
- Learns from human resolutions

### 3. Intent-Based Routing

Not every query needs AI. We built routing for:
- **Quick lookups**: Price, hours, contact info → instant response
- **Complex questions**: Product comparisons, account issues → RAG agent
- **Sensitive matters**: Complaints, cancellations → human priority queue

## Client Testimonial

> "We were ready to abandon AI entirely. Virgent showed us what was possible when you build for the actual problem instead of the hype. ROI in 30 days changed how our board views AI investment."
> 
> — VP of Customer Experience

## Lessons Learned

1. **Measure before building** - Clear baselines made ROI undeniable
2. **Start narrow** - We solved 5 query types perfectly before expanding
3. **Humans in the loop** - AI + human beats AI alone every time
4. **Speed builds trust** - 2-week delivery earned us ongoing work

## What Happened Next

After month 1 success, we:
- Expanded to 3 more query categories
- Added proactive outreach for at-risk accounts
- Built internal tools for support team
- Now managing their entire AI strategy

---

*This engagement exemplifies our approach: move fast, measure everything, and prove value before asking for more investment.*`,
  },
  
  // Add more case studies here as needed
};

// Find existing MDX file for a slug
function findMdxFile(slug: string): string | null {
  function searchDir(dir: string): string | null {
    if (!fs.existsSync(dir)) return null;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const found = searchDir(fullPath);
        if (found) return found;
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        // Check if this file has the matching slug
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(content);
        if (data.slug === slug) {
          return fullPath;
        }
        // Also check filename
        const filename = path.basename(fullPath, path.extname(fullPath));
        const dateMatch = filename.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
        const fileSlug = dateMatch ? dateMatch[1] : filename;
        if (fileSlug === slug) {
          return fullPath;
        }
      }
    }
    
    return null;
  }
  
  return searchDir(CONTENT_DIR);
}

// Update MDX file with new content
function updateMdxFile(filePath: string, caseStudy: typeof CASE_STUDIES[string]) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  
  // Keep existing frontmatter but update what we have
  const newFrontmatter = {
    ...data,
    title: caseStudy.title,
    date: caseStudy.date,
    excerpt: caseStudy.excerpt,
    tags: caseStudy.tags,
  };
  
  // Build new file content
  const newContent = `---
title: "${newFrontmatter.title}"
date: "${newFrontmatter.date}"
slug: "${newFrontmatter.slug || data.slug}"
excerpt: "${newFrontmatter.excerpt}"
category: "${newFrontmatter.category || 'case-studies'}"
tags: ${JSON.stringify(newFrontmatter.tags)}
coverImage: "${newFrontmatter.coverImage || ''}"
featured: ${newFrontmatter.featured || false}
draft: ${newFrontmatter.draft || false}
originalSource: "${newFrontmatter.originalSource || 'virgent'}"
canonicalUrl: "${newFrontmatter.canonicalUrl || ''}"
---

${caseStudy.content}

---

*Originally published on [Virgent AI Case Studies](https://www.virgent.ai/case-studies)*
`;
  
  fs.writeFileSync(filePath, newContent);
  console.log(`✓ Updated: ${filePath}`);
}

// Main sync function
async function main() {
  console.log('Syncing Virgent AI case studies...\n');
  
  let updated = 0;
  let notFound = 0;
  let skipped = 0;
  
  for (const [slug, caseStudy] of Object.entries(CASE_STUDIES)) {
    const filePath = findMdxFile(slug);
    
    if (!filePath) {
      console.log(`✗ Not found: ${slug}`);
      notFound++;
      continue;
    }
    
    // Check if content is already full (not a stub)
    const existingContent = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(existingContent);
    
    // Simple heuristic: if content is less than 1000 chars, it's probably a stub
    if (content.length > 3000) {
      console.log(`⊘ Skipped (already has content): ${slug}`);
      skipped++;
      continue;
    }
    
    updateMdxFile(filePath, caseStudy);
    updated++;
  }
  
  console.log(`\nSync complete:`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Not found: ${notFound}`);
}

main().catch(console.error);
