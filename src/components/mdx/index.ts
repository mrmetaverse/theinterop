export { default as Callout } from './Callout';
export { default as Figure } from './Figure';
export { default as PullQuote } from './PullQuote';
export { default as Embed } from './Embed';

// MDX component map for use with next-mdx-remote
export const mdxComponents = {
  Callout: require('./Callout').default,
  Figure: require('./Figure').default,
  PullQuote: require('./PullQuote').default,
  Embed: require('./Embed').default,
};

