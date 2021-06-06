// define host
var corsProxyHost = process.env.CORSPROXY_HOST || 'localhost';
// utilize the same pattern for exiting corsproxy package
var corsProxyPort = process.env.CORSPROXY_PORT || 1337;

var cors_proxy = require('cors-anywhere');

cors_proxy.createServer({
  // the cors proxy allows any domain as origin
  originWhitelist: [],

  redirectSameOrigin: true,

  // default in no requirements
  // requireHeader: ['origin', 'x-requested-with'],

  // default in suggested cookie removal settings
  removeHeaders: ['cookie', 'cookie2']
}).listen(corsProxyPort, corsProxyHost, function() {
  console.log(`CORS proxy running at: http://${corsProxyHost}:${corsProxyPort}`);
});
