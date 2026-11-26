import { createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { callEndpointAction } from './lib/actions/call-endpoint';
import { findEndpointsAction } from './lib/actions/find-endpoints';
import { searchRedditAction } from './lib/actions/search-reddit';
import { youtubeTranscriptAction } from './lib/actions/youtube-transcript';
import { groundsocialAuth } from './lib/common';

export const groundsocial = createPiece({
  displayName: 'Groundsocial',
  description: 'Public posts, comments, profiles, transcripts and search results from 80+ platforms.',
  auth: groundsocialAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://storage.googleapis.com/supersend-public-assets/groundsocial/press/logo-mark-256.png',
  authors: ['shivanshmehendiratta'],
  categories: [PieceCategory.MARKETING, PieceCategory.ARTIFICIAL_INTELLIGENCE],
  actions: [callEndpointAction, findEndpointsAction, searchRedditAction, youtubeTranscriptAction],
  triggers: [],
});
