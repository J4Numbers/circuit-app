const requestId = require('./request_id');
const localsStarter = require('./locals_starter');
const inboundLogger = require('./inbound_logger');
const cookieTranslator = require('./cookie-translator');
const lookupUserSession = require('./lookup-user-ident');

const loadHandlers = (server) => {
  server.pre(requestId);
  server.pre(localsStarter);
  server.pre(inboundLogger);
  server.pre(cookieTranslator);
  server.pre(lookupUserSession);
};

module.exports = loadHandlers;
