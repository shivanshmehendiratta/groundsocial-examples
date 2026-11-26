import { createAction, Property } from '@activepieces/pieces-framework';
import { groundsocialAuth, request } from '../common';

export const findEndpointsAction = createAction({
  auth: groundsocialAuth,
  name: 'find_endpoints',
  displayName: 'Find Endpoints',
  description: 'Find the Groundsocial endpoints that fit a task in plain words, with their inputs and cost. Free.',
  props: {
    task: Property.ShortText({ displayName: 'Task', description: 'e.g. comments on a TikTok video', required: true }),
    platform: Property.ShortText({ displayName: 'Platform', description: 'Only this platform, e.g. reddit', required: false }),
  },
  async run({ propsValue }) {
    const data = (await request(undefined, 'GET', '/v1/utility/find', { task: propsValue.task, platform: propsValue.platform })) as {
      results: unknown[];
    };
    return data.results;
  },
});
