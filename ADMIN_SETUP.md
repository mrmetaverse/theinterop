# Admin Dashboard Setup

## 1. Database Migration

Run the Drizzle migration to add the new tables:

```bash
npm run db:push
# or
pnpm db:push
```

This adds:
- `newsletter_sends` - Track newsletter sends per post
- `contact_messages` - Store contact form messages
- `admin_sessions` - Secure admin authentication

## 2. Generate Admin Password

```bash
npm run tsx scripts/generate-admin-password.ts
```

Copy the generated password and add it to your `.env.local`:

```bash
ADMIN_PASSWORD=<generated-password-here>
```

## 3. GitHub Secrets

Add these to your GitHub repository secrets (Settings → Secrets and variables → Actions):

```
SITE_URL=https://jessealton.com
NEWSLETTER_API_KEY=<your-existing-newsletter-api-key>
```

## 4. Access Admin Dashboard

Navigate to: `https://jessealton.com/admin`

Login with:
- Email: `jesse@alton.tech`
- Password: `<your-generated-password>`

## Features

### Overview Tab
- KPI cards showing:
  - Total confirmed subscribers
  - Published posts count
  - Newsletters sent
  - Unread messages
- Recent subscribers list
- Last 30 days growth

### Posts Tab
- List of recent published posts
- See which posts have newsletter sent
- Manual "Send Newsletter" button for posts that haven't been emailed

### Messages Tab
- View all contact form messages
- Unread message count badge
- Mark messages as read
- Reply directly to users via email (uses Resend)
- Messages auto-marked as "replied" after sending

## Automatic Newsletter Sending

When you push a new post to GitHub:

1. GitHub Action detects new `.mdx` file in `content/posts/`
2. Checks if `draft: false` in frontmatter
3. Automatically calls `/api/send-newsletter` with the post slug
4. Newsletter sent to all confirmed subscribers
5. Send tracked in `newsletter_sends` table

## Contact Form

Users can contact you through a contact form (you'll need to add this to your site).

Create `/app/contact/page.tsx`:

```tsx
// Simple contact form component
// POST to /api/contact with { email, name, subject, message }
```

Messages appear in Admin → Messages tab.

## Security

- Admin sessions expire after 7 days
- HTTP-only cookies prevent XSS
- Password stored as environment variable
- All admin routes require authentication
- Newsletter API protected with Bearer token

## Notes

- The GitHub Action only sends newsletters for NEW posts (not edits)
- Drafts are ignored by the automation
- You can still manually send newsletters from the admin dashboard
- All email sending uses your existing Resend configuration
