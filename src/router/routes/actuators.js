/**
 * If a user is able to reach this endpoint and to see a response, it is
 * up. Therefore, we can just print out a simple status for all requests.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const defineHealthcheck = (req, res, next) => {
  res.contentType = 'application/json';
  res.header('content-type', 'application/json');
  res.send(200, { status: 'UP' });
  next();
};

/**
 * Load in all the actuator endpoints for automation and metrics gathering
 * from third party applications (if there were any that consumed this).
 *
 * @param {object} server - The server whose routes we are fleshing out.
 */
module.exports = (server) => {
  server.get('/health', defineHealthcheck);
};
