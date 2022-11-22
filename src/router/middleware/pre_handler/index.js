const requestId = require('./request_id');
const localsStarter = require('./locals_starter');
const inboundLogger = require('./inbound_logger');
const cookieTranslator = require('./cookie-translator');
const lookupUserSession = require('./lookup-user-ident');

/**
 * Set up all the handlers that we're going to iterate through whenever we
 * receive a new request into the webserver.
 *
 * @param {object} server - The restify server for which we are updating its
 * pre-work functionality.
 */
const loadHandlers = (server) => {
  server.pre(requestId);
  server.pre(localsStarter);
  server.pre(inboundLogger);
  server.pre(cookieTranslator);
  server.pre(lookupUserSession);
};

module.exports = loadHandlers;
