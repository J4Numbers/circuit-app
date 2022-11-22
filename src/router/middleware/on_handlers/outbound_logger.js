const { Request, Response } = require('restify');
const sessionManager = require('../../../js/session-management').default();

/**
 * After every request has completed itself, we want to print out a line to
 * the logs to state what the final state of that request was. We also
 * perform a sweep of any toasts that might exist for a user to remove them
 * now that they've seen them.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {Promise<void>} - Returned once all the logging has been done.
 */
const outboundLogger = async (req, res) => {
  req.log.info(`${req.method} call to ${req.getPath()} returned ${res.statusCode}`);
  if (res.contentType === 'text/html' && res.nunjucks.userSession.userIdent) {
    req.log.debug('Clearing toasts after single view');
    const latestSession = await sessionManager.getSession(res.cookies['user-session']);
    latestSession.toasts = [];
    await sessionManager.overwriteSession(res.cookies['user-session'], latestSession);
  }
};

module.exports = outboundLogger;
