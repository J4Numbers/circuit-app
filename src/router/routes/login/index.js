const loginInternalRoute = require('./login-internal');

/**
 * Load in all the login routes that this service is offering.
 *
 * @param {object} server - The server object we're loading all routes
 * on to.
 * @returns {object} - The server whose routes have been fleshed out.
 */
module.exports = (server) => {
  loginInternalRoute(server);

  return server;
};
