const { Request, Response, Next } = require('restify');

/**
 * Whenever we receive a new request from someone, log it out as the method
 * against a given path.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const inboundLogger = (req, res, next) => {
  req.log.info(`found new ${req.method} request to ${req.getPath()}`);
  next();
};

module.exports = inboundLogger;
