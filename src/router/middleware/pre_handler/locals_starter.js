const { Request, Response, Next } = require('restify');

/**
 * Start up our local memory storage for all future handlers to use as
 * they see fit. Items on the response are forever linked to a single request,
 * so we can track data from a call coming in to when we want to display
 * something to our users.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const localsStarter = (req, res, next) => {
  res.locals = {};
  res.nunjucks = { userSession: {} };
  next();
};

module.exports = localsStarter;
