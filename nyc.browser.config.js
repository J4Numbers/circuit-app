const baseConfig = require('./nyc.config');

module.exports = {
  ...baseConfig,
  _reportDir: './coverage/browser/',
  all: true,
  exclude: [
    ...baseConfig.exclude,
    'src/ts',
  ],
};
