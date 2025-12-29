# The Interop

> Content for Builders, Founders, and Funders

A minimal, neumorphic personal site for **The Interop** newsletter — weekly insights at the intersection of AI, business transformation, and emerging technology.

## 🌐 Live Sites

- **Primary**: [jessealton.com](https://jessealton.com)
- **Redirect**: [theinterop.com](https://theinterop.com) → jessealton.com

## ✨ Features

- **Neumorphic Design** — Soft, modern UI with tasteful shadows and depth
- **Three.js Hero** — Interactive constellation visualization (progressive enhancement)
- **Dark/Light Mode** — System-aware with manual toggle
- **MDX Blog** — Rich content with code highlighting and embeds
- **SEO Optimized** — Sitemap, RSS, OpenGraph, structured data
- **Reduced Motion Support** — Respects user preferences
- **Git-First Authoring** — Write in Cursor/IDE, push to publish
- **Content Validation** — CI fails on broken frontmatter or missing assets

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (includes content validation)
npm run build

# Start production server
npm start
```

---

## 📝 Authoring Workflow

### Creating a New Post

```bash
# Interactive mode
npm run new:post

# With arguments
npm run new:post "Your Post Title" --category=ai-strategy --tags=agents,interop
```

This creates:
- `content/posts/YYYY/YYYY-MM-DD-your-post-title.mdx`
- `public/images/blog/YYYY/your-post-title/` (asset folder)

### Post File Structure

Posts use the **canonical format**:

```
content/posts/
├── 2025/
│   ├── 2025-12-29-call-tracking-is-dead.mdx
│   └── 2025-10-01-on-ai-modernization.mdx
└── 2024/
    └── 2024-04-03-we-ask-ai-to-do-things.mdx
```

### Frontmatter Schema

```yaml
---
title: "Your Post Title"                    # Required
date: "2025-12-29"                          # Required, ISO format
slug: "your-post-title"                     # Required, kebab-case, unique
excerpt: "One to three sentence summary."   # Required
category: "ai-strategy"                     # Required, from controlled list
tags: ["agents", "interop"]                 # Optional but recommended
coverImage: "/images/blog/2025/slug/cover.png"  # Optional
featured: false                             # Optional
draft: true                                 # Optional, excludes from production
canonicalUrl: ""                            # Optional, for Substack legacy URLs
updatedDate: "2025-12-30"                   # Optional
series: "Interop Notes"                     # Optional, for grouped navigation
---
```

### Valid Categories

| Slug | Label |
|------|-------|
| `ai-strategy` | AI Strategy |
| `business-transformation` | Business Transformation |
| `agent-development` | Agent Development |
| `future-tech` | Future Tech |
| `case-studies` | Case Studies |

### Draft Posts

Set `draft: true` in frontmatter to exclude a post from production builds. Draft posts still appear in development mode.

### Publishing Workflow

1. Create post: `npm run new:post "Title"`
2. Edit in Cursor/IDE
3. Preview: `npm run dev`
4. Set `draft: false` when ready
5. Commit and push to GitHub
6. Vercel deploys automatically

---

## ✅ Content Validation

The build validates all posts for:
- Required frontmatter fields
- Valid ISO date format (`YYYY-MM-DD`)
- Unique slugs (no duplicates)
- Valid category (from controlled list)
- Existing cover image files (if specified)

### Manual Validation

```bash
# Run content validation only
npm run lint:content
```

### CI Integration

The `npm run build` command runs content validation first. CI will fail if:
- Required fields are missing or empty
- Date format is invalid
- Slug is duplicated
- Category is not in the controlled list

---

## 🧩 MDX Components

Posts support standard Markdown plus these MDX components:

### Callout

```mdx
<Callout type="info" title="Note">
  Important information here.
</Callout>
```

Types: `note`, `info`, `warn`, `success`, `tip`

### Figure

```mdx
<Figure 
  src="/images/blog/2025/slug/diagram.png" 
  alt="Architecture diagram"
  caption="System architecture overview"
/>
```

### PullQuote

```mdx
<PullQuote author="Jesse Alton" source="The Interop">
  The future belongs to those who can make different systems work together.
</PullQuote>
```

### Embed

```mdx
<Embed type="youtube" id="dQw4w9WgXcQ" title="Video title" />
<Embed type="twitter" id="1234567890" />
<Embed type="loom" id="abc123" />
```

---

## 🔄 Migrating from Substack

1. Export your Substack data:
   - Go to Settings → Exports → Export posts
   - Download and unzip the export

2. Run the migration script:
   ```bash
   npm run migrate ./path/to/substack-export
   ```

3. Review and validate:
   ```bash
   npm run lint:content
   ```

4. Preview the site:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
theinterop/
├── content/
│   └── posts/              # MDX blog posts (by year)
│       ├── 2025/
│       └── 2024/
├── public/
│   └── images/
│       └── blog/           # Post assets (by year/slug)
├── scripts/
│   ├── new-post.ts         # Post scaffolding CLI
│   ├── validate-content.ts # Content validation
│   └── migrate-substack.ts # Migration tool
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/
│   │   ├── layout/         # Header, Footer
│   │   ├── mdx/            # Callout, Figure, PullQuote, Embed
│   │   ├── three/          # Three.js scenes
│   │   └── ui/             # Reusable UI components
│   └── lib/                # Utilities and types
└── ...config files
```

---

## 🎨 Design System

The site uses a **neumorphic design system** with CSS custom properties:

### Colors

| Variable | Light | Dark |
|----------|-------|------|
| `--color-background` | `hsl(240 10% 96%)` | `hsl(240 15% 8%)` |
| `--color-foreground` | `hsl(240 10% 10%)` | `hsl(240 10% 95%)` |
| `--color-accent-primary` | `hsl(220 90% 56%)` | Same |

### Typography

- **Display**: Sora
- **Body**: Inter
- **Mono**: JetBrains Mono

### Key Components

- `.neu-card` — Neumorphic card with hover elevation
- `.neu-button` — Neumorphic button with press effect
- `.neu-input` — Inset input fields
- `.text-gradient` — Accent gradient text

---

## 🔧 Configuration

### Site Config (`src/lib/types.ts`)

```typescript
export const siteConfig: SiteConfig = {
  name: 'The Interop',
  description: 'Content for Builders, Founders, and Funders...',
  url: 'https://jessealton.com',
  // ... more config
};
```

### Environment Variables

```env
# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add domains:
   - `jessealton.com` (primary)
   - `theinterop.com` (redirect to primary)

### Domain Redirects

`vercel.json` configures 301 redirects from `theinterop.com` → `jessealton.com`.

---

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **3D Graphics**: Three.js + React Three Fiber
- **Content**: MDX with gray-matter
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 📄 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (validates content first) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:content` | Validate all posts |
| `npm run new:post` | Scaffold a new post |
| `npm run migrate` | Migrate Substack export |
| `npm run type-check` | TypeScript type check |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ☕ by [Jesse Alton](https://jessealton.com)
