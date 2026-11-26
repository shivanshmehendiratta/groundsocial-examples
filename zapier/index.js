'use strict';

const authentication = require('./authentication');
const { addApiKey, handleErrors } = require('./client');
const callEndpoint = require('./creates/callEndpoint');
const getYoutubeTranscript = require('./creates/getYoutubeTranscript');
const searchRedditPosts = require('./searches/searchRedditPosts');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication,
  beforeRequest: [addApiKey],
  afterResponse: [handleErrors],
  searches: { [searchRedditPosts.key]: searchRedditPosts },
  creates: { [callEndpoint.key]: callEndpoint, [getYoutubeTranscript.key]: getYoutubeTranscript },
};
