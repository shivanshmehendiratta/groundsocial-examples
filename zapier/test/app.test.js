const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const key = process.env.GROUNDSOCIAL_API_KEY;
const live = key ? describe : describe.skip;
const bundle = (inputData) => ({ authData: { apiKey: key }, inputData });

describe('schema', () => {
  it('validates', () => {
    const schema = require('zapier-platform-core/src/tools/schema');
    const errors = schema.validateApp(schema.prepareApp(App));
    expect(errors).toEqual([]);
  });
});

live('live API', () => {
  it('tests auth', async () => {
    const result = await appTester(App.authentication.test, bundle({}));
    expect(result.items).toHaveLength(1);
  });

  it('rejects a bad key', async () => {
    await expect(appTester(App.authentication.test, { authData: { apiKey: 'gs_live_bad' }, inputData: {} })).rejects.toThrow();
  });

  it('calls an endpoint', async () => {
    const result = await appTester(App.creates.call_endpoint.operation.perform, bundle({ endpoint: 'hackernews.stories.get', params: '{"feed":"top","limit":2}' }));
    expect(result.items).toHaveLength(2);
  });

  it('explains a missing input', async () => {
    await expect(appTester(App.creates.call_endpoint.operation.perform, bundle({ endpoint: 'reddit.subreddit.get', params: '{}' }))).rejects.toThrow(/needs the \\"name\\" input/);
  });

  it('searches reddit', async () => {
    const result = await appTester(App.searches.search_reddit_posts.operation.perform, bundle({ query: 'zapier', limit: 3 }));
    expect(result.length).toBeGreaterThan(0);
  });

  it('gets a transcript', async () => {
    const result = await appTester(App.creates.get_youtube_transcript.operation.perform, bundle({ video: 'dQw4w9WgXcQ' }));
    expect(result.videoId).toBe('dQw4w9WgXcQ');
  });
});
