import { MCPClient } from '@mastra/mcp';

export const groundsocialMcp = new MCPClient({
  id: 'groundsocial',
  servers: {
    groundsocial: {
      url: new URL('https://api.groundsocial.dev/mcp'),
      requestInit: { headers: { Authorization: `Bearer ${process.env.GROUNDSOCIAL_API_KEY}` } },
    },
  },
  timeout: 60_000,
});

// The server exposes every endpoint (~590 tools). Keep the ones this agent needs;
// utility_find_get finds the right endpoint for anything else.
export const TOOLS = [
  'utility_find_get',
  'reddit_search_posts',
  'reddit_post_get',
  'tiktok_search_videos',
  'youtube_search_videos',
  'youtube_video_transcript',
];

export async function groundsocialTools() {
  const all = await groundsocialMcp.listTools();
  return Object.fromEntries(
    Object.entries(all).filter(([name]) => TOOLS.some((tool) => name === `groundsocial_${tool}`)),
  );
}
