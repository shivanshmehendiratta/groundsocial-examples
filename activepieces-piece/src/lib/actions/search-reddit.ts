import { createAction, Property } from '@activepieces/pieces-framework';
import { callEndpoint, groundsocialAuth, keyOf } from '../common';

export const searchRedditAction = createAction({
  auth: groundsocialAuth,
  name: 'search_reddit_posts',
  displayName: 'Search Reddit Posts',
  description: 'Search posts across Reddit or in one subreddit (2 credits).',
  props: {
    query: Property.ShortText({ displayName: 'Query', required: true }),
    subreddit: Property.ShortText({ displayName: 'Subreddit', description: 'Without r/', required: false }),
    sort: Property.StaticDropdown({
      displayName: 'Sort',
      required: false,
      defaultValue: 'relevance',
      options: { options: ['relevance', 'new', 'top', 'comments', 'hot'].map((v) => ({ label: v, value: v })) },
    }),
    time: Property.StaticDropdown({
      displayName: 'Time',
      required: false,
      defaultValue: 'week',
      options: { options: ['hour', 'day', 'week', 'month', 'year', 'all'].map((v) => ({ label: v, value: v })) },
    }),
    limit: Property.Number({ displayName: 'Limit', description: '1 to 100', required: false, defaultValue: 25 }),
  },
  async run({ auth, propsValue }) {
    const data = (await callEndpoint(keyOf(auth), 'reddit.search.posts', {
      q: propsValue.query,
      subreddit: propsValue.subreddit,
      sort: propsValue.sort,
      t: propsValue.time,
      limit: propsValue.limit,
    })) as { data?: { children?: Array<{ data: unknown }> } };
    return (data.data?.children ?? []).map((c) => c.data);
  },
});
