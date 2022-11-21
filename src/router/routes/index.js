const assetRoutes = require('./assets');
const actuatorRoutes = require('./actuators');
const homepageRoute = require('./homepage');
const calendarRoute = require('./calendar');
const managerRoutes = require('./manager');
const loginRoute = require('./login');

module.exports = (server) => {
  assetRoutes(server);
  actuatorRoutes(server);
  homepageRoute(server);
  calendarRoute(server);
  managerRoutes(server);
  loginRoute(server);

  return server;
};
