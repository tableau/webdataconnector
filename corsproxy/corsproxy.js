// defined by env variable or npm scripting
var corsProxyHost = process.env.CORSPROXY_HOST || 'localhost';
// as for specific values, utilize the same pattern for exiting corsproxy
var corsProxyPort = process.env.CORSPROXY_PORT || 1337;

var cors_proxy = require('cors-anywhere');

cors_proxy.createServer({
  // cors proxy allows any domain as origin
  originWhitelist: [],

  redirectSameOrigin: true,

  // default in no requirements
  // requireHeader: ['origin', 'x-requested-with'],
  // default in suggested cooki removal settings
  removeHeaders: ['cookie', 'cookie2']
}).listen(corsProxyPort, corsProxyHost, function() {
  console.log(`CORS Proxy running at: http://${corsProxyHost}:${corsProxyPort}`);
});
