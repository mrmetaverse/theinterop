import { pgTable, serial, varchar, timestamp, index } from 'drizzle-orm/pg-core';

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

