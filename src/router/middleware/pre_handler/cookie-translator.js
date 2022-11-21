const cookieTranslator = (req, res, next) => {
  res.cookies = {};
  const regexCookies = {
    'user-session': /(user-session)=([^ ;]*)/gi,
  };
  let tokenHeader;
  Object.keys(regexCookies).forEach((cookieName) => {
    tokenHeader = regexCookies[cookieName].exec(req.header('cookie'));
    while (tokenHeader) {
      if (tokenHeader) {
        // eslint-disable-next-line no-unused-vars
        const [_wholeCookie, realCookieName, cookieValue] = tokenHeader;
        res.cookies[realCookieName] = cookieValue;
        req.log.debug(`${realCookieName} cookie is ${res.cookies[realCookieName]}`);
        tokenHeader = regexCookies[cookieName].exec(req.header('cookie'));
      } else {
        req.log.debug(`Unable to find cookie value for ${cookieName}. Setting to blank.`);
        res.cookies[cookieName] = '';
      }
    }
  });
  next();
};

module.exports = cookieTranslator;
