const outboundLogger = require('./outbound_logger');
const restifyHandler = require('./restify_handler');

/**
 * Set up all the events that we're going to be paying attention to, and
 * the handlers that will do something whenever those events are emitted.
 *
 * @param {object} server - The restify server for whose events we are
 * listening to.
 */
const onEventHandler = (server) => {
  server.on('after', outboundLogger);
  server.on('restifyError', restifyHandler);
};

module.exports = onEventHandler;
