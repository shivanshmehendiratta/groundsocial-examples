'use strict';

const { callEndpoint } = require('../client');

const perform = async (z, bundle) => {
  let params = bundle.inputData.params || {};
  if (typeof params === 'string') params = JSON.parse(params || '{}');
  const data = await callEndpoint(z, bundle.inputData.endpoint, params);
  // Zapier needs an object; wrap arrays.
  return Array.isArray(data) ? { results: data } : data;
};

module.exports = {
  key: 'call_endpoint',
  noun: 'Endpoint',
  display: {
    label: 'Call Endpoint',
    description: "Calls any Groundsocial endpoint (Reddit, X, TikTok, Instagram, YouTube, LinkedIn, Google and more) and returns the platform's JSON.",
  },
  operation: {
    perform,
    inputFields: [
      {
        key: 'endpoint',
        label: 'Endpoint ID',
        required: true,
        helpText: 'For example `reddit.search.posts` or `youtube.video.transcript`. Every endpoint is listed at https://groundsocial.dev/docs/api',
      },
      {
        key: 'params',
        label: 'Parameters (JSON)',
        type: 'text',
        helpText: 'The endpoint inputs as a JSON object, for example `{"q": "zapier", "sort": "top"}`.',
      },
    ],
    sample: { feed: 'top', page: 1, limit: 1, items: [{ id: 1, title: 'Example story' }] },
  },
};
