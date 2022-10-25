const fs = require('fs');
const config = require('config');
const restify = require('restify');

const logger = require('./js/logger/bunyan-logger').default();
const routingEngine = require('./router/routes');
const onEventHandlers = require('./router/middleware/on_handlers');
const preRequestHandlers = require('./router/middleware/pre_handler');

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

server.pre(restify.plugins.pre.dedupeSlashes());
server.pre(restify.plugins.pre.sanitizePath());
preRequestHandlers(server);

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.requestLogger());

onEventHandlers(server);

routingEngine(server);

server.listen(config.get('app.port'), () => {
  logger.info(`${server.name} listening at ${server.url}`);
});

module.exports = server;
