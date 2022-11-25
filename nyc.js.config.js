const baseConfig = require('./nyc.config');

module.exports = {
  ...baseConfig,
  _reportDir: './coverage/js/',
  all: true,
  exclude: [
    ...baseConfig.exclude,
    'src/ts',
  ],
  include: [
    'src/',
  ],
};
