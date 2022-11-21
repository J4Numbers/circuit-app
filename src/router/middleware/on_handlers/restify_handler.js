const renderer = require('../../../js/renderer/nunjucks-renderer').default();

const restifyHandler = (req, res, err, callback) => {
  req.log.info(`Error thrown within restify: ${err}`);
  res.header('content-type', 'text/html');
  // eslint-disable-next-line no-param-reassign
  err.toHTML = () => renderer.render('pages/error.njk', { ...res.nunjucks, error: err });
  return callback();
};

module.exports = restifyHandler;
