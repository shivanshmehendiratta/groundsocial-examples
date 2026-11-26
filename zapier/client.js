'use strict';

const BASE_URL = 'https://api.groundsocial.dev';

const addApiKey = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.apiKey) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${bundle.authData.apiKey}`;
  }
  return request;
};

// Groundsocial errors look like {"error": {"code", "message", "hint"}}.
const handleErrors = (response, z) => {
  if (response.status >= 400) {
    let err = {};
    try {
      err = JSON.parse(response.content).error || {};
    } catch (e) {
      // not JSON
    }
    const message = `${err.message || response.content}${err.hint ? ` ${err.hint}` : ''}`;
    if (response.status === 401) throw new z.errors.RefreshAuthError(message);
    throw new z.errors.Error(message, err.code || `http_${response.status}`, response.status);
  }
  return response;
};

const listEndpoints = async (z) => {
  const response = await z.request({ url: `${BASE_URL}/v1/utility/endpoints` });
  return response.data.endpoints;
};

const callEndpoint = async (z, endpointId, params = {}) => {
  const endpoints = await listEndpoints(z);
  const ep = endpoints.find((e) => e.id === endpointId || e.tool === endpointId);
  if (!ep) throw new z.errors.Error(`No endpoint called "${endpointId}". Use Find Endpoints.`, 'unknown_endpoint', 404);
  const input = { ...params };
  let path = ep.path;
  for (const [placeholder, name] of ep.path.matchAll(/\{([^}]+)\}/g)) {
    if (input[name] === undefined || input[name] === null || input[name] === '') {
      throw new z.errors.Error(`${ep.id} needs the "${name}" input (inputs: ${ep.inputs.join(', ')}).`, 'invalid_request', 400);
    }
    path = path.replace(placeholder, encodeURIComponent(String(input[name])));
    delete input[name];
  }
  for (const k of Object.keys(input)) if (input[k] === undefined || input[k] === null || input[k] === '') delete input[k];
  const method = ep.method.toUpperCase();
  const response = await z.request(
    method === 'GET' ? { url: BASE_URL + path, method, params: input } : { url: BASE_URL + path, method, body: input },
  );
  return response.data;
};

module.exports = { BASE_URL, addApiKey, handleErrors, listEndpoints, callEndpoint };
