const sessionManager = require('../../../js/session-management').default();

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
