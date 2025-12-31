import { pgTable, serial, varchar, timestamp, index, text, boolean } from 'drizzle-orm/pg-core';

export const subscribers = pgTable(
  'subscribers',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'confirmed', 'unsubscribed'
    token: varchar('token', { length: 64 }).unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    confirmedAt: timestamp('confirmed_at'),
    unsubscribedAt: timestamp('unsubscribed_at'),
  },
  (table) => ({
    statusIdx: index('idx_subscribers_status').on(table.status),
    tokenIdx: index('idx_subscribers_token').on(table.token),
  })
);

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;

// Posts table for storing full content from all sources
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 500 }).notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(), // Full markdown content
    category: varchar('category', { length: 100 }),
    tags: text('tags'), // JSON array stored as text
    coverImage: varchar('cover_image', { length: 500 }),
    date: timestamp('date').notNull(),
    updatedDate: timestamp('updated_date'),
    featured: boolean('featured').default(false),
    draft: boolean('draft').default(false),
    originalSource: varchar('original_source', { length: 50 }), // 'virgent', 'substack', 'medium', 'original'
    canonicalUrl: varchar('canonical_url', { length: 500 }),
    sourceUrl: varchar('source_url', { length: 500 }), // URL to fetch content from
    lastFetched: timestamp('last_fetched'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index('idx_posts_slug').on(table.slug),
    categoryIdx: index('idx_posts_category').on(table.category),
    dateIdx: index('idx_posts_date').on(table.date),
    sourceIdx: index('idx_posts_source').on(table.originalSource),
  })
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// Newsletter sends tracking
export const newsletterSends = pgTable(
  'newsletter_sends',
  {
    id: serial('id').primaryKey(),
    postSlug: varchar('post_slug', { length: 255 }).notNull(),
    sentAt: timestamp('sent_at').defaultNow().notNull(),
    recipientCount: serial('recipient_count').notNull(),
    successCount: serial('success_count').notNull(),
    failedCount: serial('failed_count').notNull(),
  },
  (table) => ({
    postSlugIdx: index('idx_newsletter_sends_post_slug').on(table.postSlug),
    sentAtIdx: index('idx_newsletter_sends_sent_at').on(table.sentAt),
  })
);

export type NewsletterSend = typeof newsletterSends.$inferSelect;
export type NewNewsletterSend = typeof newsletterSends.$inferInsert;

// Contact messages from users
export const contactMessages = pgTable(
  'contact_messages',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    subject: varchar('subject', { length: 500 }),
    message: text('message').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('unread'), // 'unread', 'read', 'replied'
    repliedAt: timestamp('replied_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index('idx_contact_messages_status').on(table.status),
    createdAtIdx: index('idx_contact_messages_created_at').on(table.createdAt),
  })
);

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;

// Admin sessions
export const adminSessions = pgTable(
  'admin_sessions',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: index('idx_admin_sessions_token').on(table.token),
    expiresAtIdx: index('idx_admin_sessions_expires_at').on(table.expiresAt),
  })
);

export type AdminSession = typeof adminSessions.$inferSelect;
export type NewAdminSession = typeof adminSessions.$inferInsert;
