const assetRoutes = require('./assets');
const actuatorRoutes = require('./actuators');
const homepageRoute = require('./homepage');
const calendarRoute = require('./calendar');
const managerRoutes = require('./manager');
const loginRoute = require('./login');

/**
 * Load in all the available routes that are on this application.
 *
 * @param {object} server - The server object we're loading all routes
 * on to.
 * @returns {object} - The server whose routes have been fleshed out.
 */
module.exports = (server) => {
  assetRoutes(server);
  actuatorRoutes(server);
  homepageRoute(server);
  calendarRoute(server);
  managerRoutes(server);
  loginRoute(server);

  return server;
};
