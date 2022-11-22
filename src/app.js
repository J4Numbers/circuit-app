// The base includes for creating our server.
const fs = require('fs');
const config = require('config');
const restify = require('restify');

// Include some standard handlers that we will plug into the server during
// its creation.
const logger = require('./js/logger/bunyan-logger').default();
const routingEngine = require('./router/routes');
const onEventHandlers = require('./router/middleware/on_handlers');
const preRequestHandlers = require('./router/middleware/pre_handler');

// Create any required HTTP2 configuration depending on several configuration
// flags.
let http2Config;
if (config.get('app.http2.enabled')) {
  logger.info('HTTP/2 configuration accepted...');
  http2Config = {
    allowHTTP1: true,
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.2',
    key: fs.readFileSync(config.get('app.http2.key')),
    cert: fs.readFileSync(config.get('app.http2.cert')),
  };
  if (config.has('app.http2.ca')) {
    http2Config.ca = fs.readFileSync(config.get('app.http2.ca'));
  }
}

// Create a new server using all the configuration details we have available.
// We also plug in our preferred logger to the central server, and set up a
// specific formatter for dealing with errors ahead of time.
const server = restify.createServer({
  name: config.get('app.name'),
  url: config.get('app.hostname'),
  ignoreTrailingSlash: true,
  log: logger,
  formatters: {
    'text/html': (req, res, body) => {
      if (body instanceof Error) {
        return body.toHTML();
      }
      return body;
    },
  },
  http2: http2Config,
  allowHTTP1: true,
});

// Set up any pre-request handlers. These being operations that are carried
// out before any request sees any of the inner logic of an application.
server.pre(restify.plugins.pre.dedupeSlashes());
server.pre(restify.plugins.pre.sanitizePath());
preRequestHandlers(server);

// Set up any parsers or other plugins that the server is going to use.
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.requestLogger());

// Set up event handlers which will listen out for various events within the
// restify stack to respond appropriately as required.
onEventHandlers(server);

// Set up the routes for the server. This means every single route that is
// available can be traced back to this top-level request to spin out all the
// available endpoints on this application.
routingEngine(server);

// Allow the server to listen and accept traffic.
server.listen(config.get('app.port'), () => {
  logger.info(`${server.name} listening at ${server.url}`);
});

module.exports = server;
