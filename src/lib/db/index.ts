import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });

// Re-export schema
export { subscribers, posts } from './schema';
export type { Subscriber, NewSubscriber, Post as DbPost, NewPost } from './schema';

