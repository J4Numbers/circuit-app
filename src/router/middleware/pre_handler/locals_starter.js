const localsStarter = (req, res, next) => {
  res.locals = {};
  res.nunjucks = { userSession: {} };
  next();
};

module.exports = localsStarter;
