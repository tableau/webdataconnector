const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

// server port
const serverPortNumber = process.env.SERVER_PORT || 8888;

// disable cache
const setCustomCacheControl = (res, path) => {
  // eslint-disable-next-line no-console
  console.log(`[HTTP Server] serving resource: ${path}`);

  // avoid caching for hosting resources
  res.setHeader('Cache-Control', 'public, max-age=0');
};

// serve root folder but route to simulator's index based on existing setup documented
// serve-static supports recursive hosting and relative path for accessing resources
const serve = serveStatic('./', {
  index: ['/Simulator/index.html'],
  setHeaders: setCustomCacheControl,
});

// serve resources
http.createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
}).listen(serverPortNumber);

// eslint-disable-next-line no-console
console.log(`[HTTP Server] running at: http://localhost:${serverPortNumber}`);
