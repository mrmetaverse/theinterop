import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

/**
 * Convert markdown content to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm) // Support tables, strikethrough, autolinks, etc.
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // Allow raw HTML in markdown
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

