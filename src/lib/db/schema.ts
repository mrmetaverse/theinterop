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
