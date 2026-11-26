'use strict';

const { callEndpoint } = require('../client');

const perform = async (z, bundle) => {
  const data = await callEndpoint(z, 'reddit.search.posts', {
    q: bundle.inputData.query,
    subreddit: bundle.inputData.subreddit,
    sort: bundle.inputData.sort,
    t: bundle.inputData.time,
    limit: bundle.inputData.limit,
  });
  return ((data.data && data.data.children) || []).map((c) => c.data);
};

module.exports = {
  key: 'search_reddit_posts',
  noun: 'Reddit Post',
  display: { label: 'Search Reddit Posts', description: 'Searches posts across Reddit or in one subreddit (2 credits).' },
  operation: {
    perform,
    inputFields: [
      { key: 'query', label: 'Query', required: true },
      { key: 'subreddit', label: 'Subreddit', helpText: 'Without r/' },
      { key: 'sort', label: 'Sort', choices: ['relevance', 'new', 'top', 'comments', 'hot'], default: 'relevance' },
      { key: 'time', label: 'Time', choices: ['hour', 'day', 'week', 'month', 'year', 'all'], default: 'week' },
      { key: 'limit', label: 'Limit', type: 'integer', default: '25' },
    ],
    sample: { id: '1y3brum', title: 'Anyone moved from Firebase to Supabase on a Next js app?', subreddit: 'nextjs', score: 19, num_comments: 24, permalink: '/r/nextjs/comments/1y3brum/anyone_moved_from_firebase_to_supabase_on_a_next/' },
    outputFields: [
      { key: 'id' },
      { key: 'title' },
      { key: 'subreddit' },
      { key: 'score', type: 'integer' },
      { key: 'num_comments', type: 'integer' },
      { key: 'permalink' },
    ],
  },
};
