const baseConfig = require('./nyc.config');

module.exports = {
  ...baseConfig,
  _reportDir: './coverage/ts/',
  all: false,
  include: [
    'src/ts/**/*.ts',
  ],
};
