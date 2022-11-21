const outboundLogger = require('./outbound_logger');
const restifyHandler = require('./restify_handler');

const onEventHandler = (server) => {
  server.on('after', outboundLogger);
  server.on('restifyError', restifyHandler);
};

module.exports = onEventHandler;
