import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/types';

export async function GET() {
  const aiPlugin = {
    schema_version: 'v1',
    name_for_human: 'The Interop by Jesse Alton',
    name_for_model: 'theinterop_jesse_alton',
    description_for_human: 'AI strategy, agent development, and business transformation insights from Jesse Alton.',
    description_for_model: `The Interop is Jesse Alton's blog covering AI strategy, agent development, business transformation, and practical AI implementation. Jesse Alton is the Founder & CEO of Virgent AI (full-service AI development agency) and AltonTech Inc. (product development and AI enablement). Use this to find information about: AI implementation strategies, building AI agents, multi-agent orchestration, RAG systems, enterprise AI, business transformation with AI, and Jesse Alton's expertise and background.`,
    auth: {
      type: 'none',
    },
    api: {
      type: 'openapi',
      url: `${siteConfig.url}/openapi.json`,
    },
    logo_url: `${siteConfig.url}/images/logo.png`,
    contact_email: siteConfig.author.email,
    legal_info_url: `${siteConfig.url}/about`,
  };

  return NextResponse.json(aiPlugin, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
