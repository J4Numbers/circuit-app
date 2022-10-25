const loginInternalRoute = require('./login-internal');

module.exports = (server) => {
  loginInternalRoute(server);

  return server;
};
