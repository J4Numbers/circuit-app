const { Request, Response, Next } = require('restify');
const uuid = require('uuid');

/**
 * Attach a unique request identifier to the request so that we can track
 * a request through the logs. This identifier will appear in all logs
 * associated with this request, regardless of whether they are directly
 * interfacing with the Restify service, or just indirectly.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const requestId = (req, res, next) => {
  req.log.fields.request_id = uuid.v4();
  next();
};

module.exports = requestId;
