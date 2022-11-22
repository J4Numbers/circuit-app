const { Request, Response, Next } = require('restify');

/**
 * This is the first to be run in terms of cookie management. It focuses purely
 * on extracting the session ID from any users which have visited the site.
 *
 * @param {Request} req - The incoming request.
 * @param {Response} res - The outgoing response.
 * @param {Next} next - The callback to continue the chain of ptr handlers.
 */
const cookieTranslator = (req, res, next) => {
  res.cookies = {};
  // Start a basic regex for reading the user's cookies.
  const regexCookies = {
    'user-session': /(user-session)=([^ ;]*)/gi,
  };
  let tokenHeader;
  // For each cookie we're interested in...
  Object.keys(regexCookies).forEach((cookieName) => {
    tokenHeader = regexCookies[cookieName].exec(req.header('cookie'));
    while (tokenHeader) {
      // If it exists, we set the cookie in our local memory...
      if (tokenHeader) {
        // eslint-disable-next-line no-unused-vars
        const [_wholeCookie, realCookieName, cookieValue] = tokenHeader;
        res.cookies[realCookieName] = cookieValue;
        req.log.debug(`${realCookieName} cookie is ${res.cookies[realCookieName]}`);
        tokenHeader = regexCookies[cookieName].exec(req.header('cookie'));
      // If it doesn't, we set the cookie to blank in our local memory.
      } else {
        req.log.debug(`Unable to find cookie value for ${cookieName}. Setting to blank.`);
        res.cookies[cookieName] = '';
      }
    }
  });
  next();
};

module.exports = cookieTranslator;
