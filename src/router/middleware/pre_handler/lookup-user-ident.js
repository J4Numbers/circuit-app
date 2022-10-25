const sessionManager = require('../../../js/session-management').default();

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
