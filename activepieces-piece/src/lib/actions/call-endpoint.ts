import { createAction, Property } from '@activepieces/pieces-framework';
import { callEndpoint, groundsocialAuth, keyOf, listEndpoints } from '../common';

export const callEndpointAction = createAction({
  auth: groundsocialAuth,
  name: 'call_endpoint',
  displayName: 'Call Endpoint',
  description: "Call any Groundsocial endpoint (Reddit, X, TikTok, Instagram, YouTube, LinkedIn, Google and 70+ more) and get the platform's JSON.",
  props: {
    endpoint: Property.Dropdown({
      auth: groundsocialAuth,
      displayName: 'Endpoint',
      description: 'The endpoint to call. Each one is documented at https://groundsocial.dev/docs/api',
      required: true,
      refreshers: [],
      options: async () => {
        const endpoints = await listEndpoints();
        return {
          disabled: false,
          options: endpoints.map((e) => ({ label: `${e.id}: ${e.title} (${e.credits ?? '?'} cr)`, value: e.id })),
        };
      },
    }),
    params: Property.Json({
      displayName: 'Parameters',
      description: 'The endpoint inputs as JSON, e.g. {"q": "activepieces", "sort": "top"}',
      required: false,
      defaultValue: {},
    }),
  },
  async run({ auth, propsValue }) {
    const params = (typeof propsValue.params === 'string' ? JSON.parse(propsValue.params) : propsValue.params) ?? {};
    return callEndpoint(keyOf(auth), propsValue.endpoint as string, params as Record<string, unknown>);
  },
});
