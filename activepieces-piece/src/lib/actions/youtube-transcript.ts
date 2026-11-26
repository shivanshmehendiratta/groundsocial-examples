import { createAction, Property } from '@activepieces/pieces-framework';
import { callEndpoint, groundsocialAuth, keyOf } from '../common';

export const youtubeTranscriptAction = createAction({
  auth: groundsocialAuth,
  name: 'get_youtube_transcript',
  displayName: 'Get YouTube Transcript',
  description: 'Get the transcript of a YouTube video (2 credits).',
  props: {
    video: Property.ShortText({ displayName: 'Video ID or URL', required: true }),
    language: Property.ShortText({ displayName: 'Language', description: 'e.g. en', required: false }),
  },
  async run({ auth, propsValue }) {
    return callEndpoint(keyOf(auth), 'youtube.video.transcript', { id: propsValue.video, language: propsValue.language });
  },
});
