'use strict';

const { callEndpoint } = require('../client');

module.exports = {
  key: 'get_youtube_transcript',
  noun: 'Transcript',
  display: { label: 'Get YouTube Transcript', description: 'Gets the transcript of a YouTube video (2 credits).' },
  operation: {
    perform: (z, bundle) =>
      callEndpoint(z, 'youtube.video.transcript', { id: bundle.inputData.video, language: bundle.inputData.language }),
    inputFields: [
      { key: 'video', label: 'Video ID or URL', required: true },
      { key: 'language', label: 'Language', helpText: 'e.g. en. Defaults to the original language.' },
    ],
    sample: { kind: 'youtube#transcript', videoId: 'dQw4w9WgXcQ', languageCode: 'en', text: '...' },
  },
};
