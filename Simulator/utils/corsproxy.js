/* eslint-disable no-console */
const corsProxy = require('cors-anywhere');

// define proxy host and utilize the same pattern for exiting corsproxy
const corsProxyHost = process.env.CORSPROXY_HOST || 'localhost';

// define proxy port and utilize the same pattern for exiting corsproxy
const corsProxyPort = process.env.CORSPROXY_PORT || 8889;

corsProxy.createServer({
  // in default the cors proxy allows any domain as origin
  originWhitelist: [],

  redirectSameOrigin: true,

  // no requirements in default
  requireHeader: [],

  // no requirements in default
  // for instance cookie could be added to ensure no cookie is shared
  removeHeaders: [],
}).listen(corsProxyPort, corsProxyHost, () => {
  // log corsproxy's host and port
  console.log(`[CORS Proxy] serving at: http://${corsProxyHost}:${corsProxyPort}`);
});
