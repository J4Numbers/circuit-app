import Logger, { createLogger, Stream } from 'bunyan';
import config from 'config';

let logger: Logger;

/**
 * Generate a new bunyan Logger which will be used for this installation of
 * the application, gathering the configuration of the logger straight from
 * the config files.
 *
 * @returns {Logger} The generated bunyan Logger.
 */
const generateLogger = (): Logger => {
  const loggingStreams: Array<Stream> = [
    {
      level: config.get('logger.level'),
      stream: process.stdout,
    },
  ];
  if (config.get('logger.file')) {
    loggingStreams.push({
      level: config.get('logger.level'),
      path: config.get('logger.file_location'),
    });
  }
  return createLogger({
    name: config.get('app.name'),
    streams: loggingStreams,
  });
};

/**
 * Return a singleton instance of a bunyan logger that will be used throughout
 * the application.
 *
 * @returns {Logger} The singleton logger which is in use.
 */
export default (): Logger => {
  if (logger === undefined) {
    logger = generateLogger();
  }
  return logger;
};
