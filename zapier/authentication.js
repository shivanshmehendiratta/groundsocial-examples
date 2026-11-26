'use strict';

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      required: true,
      type: 'password',
      helpText:
        'Your Groundsocial API key (starts with `gs_live_`). Create one at [groundsocial.dev](https://groundsocial.dev/app/sign-in?new=1). New accounts get 100 free credits.',
    },
  ],
  // Reads one Hacker News story (1 credit) to check the key.
  test: {
    url: 'https://api.groundsocial.dev/v1/hackernews/stories',
    params: { limit: 1 },
  },
  connectionLabel: 'Groundsocial',
};
