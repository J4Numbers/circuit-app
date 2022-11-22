const { Request, Response, Next } = require('restify');
const sessionManager = require('../../../js/session-management').default();

/**
 * The second half of cookie management, where we attempt to look up the
 * user session of our users if it has been set. If it hasn't, we don't need
 * to do anything quite yet, but if it has, we just look up the identity
 * associated with the session and attach it to our local memory objects.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} Resolves after all steps have been completed.
 */
const lookupUserSession = async (req, res, next) => {
  try {
    if (res.cookies['user-session'] !== '') {
      res.nunjucks.userSession = await sessionManager.getSession(res.cookies['user-session']);
      req.log.debug(`Found session object associated with user session - ${res.nunjucks.userSession.userIdent.id}`);
    }
  } catch (e) {
    req.log.warn(`Unable to lookup user ident :: ${e.message}`);
  }
  next();
};

module.exports = lookupUserSession;
