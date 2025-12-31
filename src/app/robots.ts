import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/types';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/', '/mradmin/'],
      },
      // OpenAI
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      // Anthropic
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      // Google (Search + Gemini)
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      // Perplexity
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      // Cohere
      {
        userAgent: 'cohere-ai',
        allow: '/',
      },
      // Meta
      {
        userAgent: 'FacebookBot',
        allow: '/',
      },
      {
        userAgent: 'meta-externalagent',
        allow: '/',
      },
      // Microsoft/Bing (powers some AI)
      {
        userAgent: 'bingbot',
        allow: '/',
      },
      // Apple
      {
        userAgent: 'Applebot',
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
      // You.com
      {
        userAgent: 'YouBot',
        allow: '/',
      },
      // Common crawlers used for AI training
      {
        userAgent: 'CCBot',
        allow: '/',
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

// Export additional routes for AI discovery (referenced in output)
// llms.txt: ${siteConfig.url}/llms.txt
// ai-plugin.json: ${siteConfig.url}/.well-known/ai-plugin.json
// openapi.json: ${siteConfig.url}/openapi.json
