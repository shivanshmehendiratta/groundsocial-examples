import { describe, expect, it } from 'vitest';
import { groundsocial } from '../src/index';
import { groundsocialAuth } from '../src/lib/common';

const KEY = process.env.GROUNDSOCIAL_API_KEY;
const live = KEY ? describe : describe.skip;
const actions = groundsocial.actions();

function run(name: string, propsValue: Record<string, unknown>, key = KEY) {
  const auth = { type: 'SECRET_TEXT', secret_text: key };
  return (actions[name] as any).run({ auth, propsValue } as any);
}

describe('piece', () => {
  it('declares its actions and auth', () => {
    expect(Object.keys(actions).sort()).toEqual(['call_endpoint', 'find_endpoints', 'get_youtube_transcript', 'search_reddit_posts']);
    expect(groundsocial.auth).toBe(groundsocialAuth);
  });

  it('finds endpoints without a key', async () => {
    const results = await run('find_endpoints', { task: 'tiktok video comments' }, undefined);
    expect(results[0].id).toMatch(/^tiktok\./);
  });

  it('loads the endpoint dropdown', async () => {
    const dropdown = (actions.call_endpoint.props as any).endpoint;
    const { options } = await dropdown.options({}, {});
    expect(options.length).toBeGreaterThan(100);
  });

  it('rejects a bad key', async () => {
    const result = await (groundsocialAuth as any).validate({ auth: 'gs_live_bad' });
    expect(result.valid).toBe(false);
  });
});

live('live API', () => {
  it('validates a good key', async () => {
    expect(await (groundsocialAuth as any).validate({ auth: KEY })).toEqual({ valid: true });
  });

  it('calls GET and POST endpoints', async () => {
    const hn = await run('call_endpoint', { endpoint: 'hackernews.stories.get', params: { feed: 'top', limit: 2 } });
    expect(hn.items).toHaveLength(2);
    const batch = await run('call_endpoint', { endpoint: 'reddit.subreddit.batch', params: '{"names":["python"]}' });
    expect(batch.subreddits.length).toBe(1);
    await expect(run('call_endpoint', { endpoint: 'reddit.subreddit.get', params: {} })).rejects.toThrow(/invalid_request/);
  });

  it('runs the shortcut actions', async () => {
    const posts = await run('search_reddit_posts', { query: 'activepieces', limit: 3, sort: 'top', time: 'year' });
    expect(posts.length).toBeGreaterThan(0);
    const transcript = await run('get_youtube_transcript', { video: 'dQw4w9WgXcQ' });
    expect(transcript.videoId).toBe('dQw4w9WgXcQ');
  });
}, 60_000);
