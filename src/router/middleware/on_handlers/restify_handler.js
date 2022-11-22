const { Request, Response, Next } = require('restify');
const renderer = require('../../../js/renderer/nunjucks-renderer').default();

/**
 * For any events which fail, or which accrue errors in any case, we may
 * need to perform some error handling and recovery. Part of that is tracking
 * what the errors are and showing them to the user in order for them to pass
 * the errors back up to the developers.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Error} err - The error that has been passed on to us from the
 * application.
 * @param {Next} callback - A callback to use after the service has scrubbed
 * as much information as it can from it.
 * @returns {void} - Absolutely nothing once the chain has passed on.
 */
const restifyHandler = (req, res, err, callback) => {
  req.log.info(`Error thrown within restify: ${err}`);
  res.header('content-type', 'text/html');
  // eslint-disable-next-line no-param-reassign
  err.toHTML = () => renderer.render('pages/error.njk', { ...res.nunjucks, error: err });
  return callback();
};

module.exports = restifyHandler;
