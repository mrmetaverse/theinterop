import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/types';

export async function GET() {
  const openapi = {
    openapi: '3.0.0',
    info: {
      title: 'The Interop API',
      description: 'Access articles and content from The Interop by Jesse Alton',
      version: '1.0.0',
      contact: {
        name: 'Jesse Alton',
        email: siteConfig.author.email,
        url: siteConfig.url,
      },
    },
    servers: [
      {
        url: siteConfig.url,
        description: 'Production',
      },
    ],
    paths: {
      '/rss.xml': {
        get: {
          operationId: 'getRssFeed',
          summary: 'Get RSS feed of all articles',
          description: 'Returns an RSS feed containing all published articles',
          responses: {
            '200': {
              description: 'RSS feed',
              content: {
                'application/xml': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      '/sitemap.xml': {
        get: {
          operationId: 'getSitemap',
          summary: 'Get sitemap',
          description: 'Returns XML sitemap of all pages',
          responses: {
            '200': {
              description: 'Sitemap XML',
              content: {
                'application/xml': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          summary: 'Get LLMs.txt file',
          description: 'Returns structured information about the site for AI assistants',
          responses: {
            '200': {
              description: 'LLMs.txt content',
              content: {
                'text/plain': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openapi, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
