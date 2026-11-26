import { createMCPClient } from '@ai-sdk/mcp';

// The server exposes every endpoint (~590 tools). Keep the ones this agent needs;
// utility_find_get finds the right endpoint for anything else.
export const TOOLS = ['utility_find_get', 'reddit_search_posts', 'youtube_search_videos', 'youtube_video_transcript'];

export async function connectGroundsocial() {
  const client = await createMCPClient({
    transport: {
      type: 'http',
      url: 'https://api.groundsocial.dev/mcp',
      headers: { Authorization: `Bearer ${process.env.GROUNDSOCIAL_API_KEY}` },
    },
  });
  const all = await client.tools();
  const tools = Object.fromEntries(Object.entries(all).filter(([name]) => TOOLS.includes(name)));
  return { client, tools };
}
