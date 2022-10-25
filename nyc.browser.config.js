const baseConfig = require('./nyc.config');

module.exports = {
  ...baseConfig,
  _reportDir: './coverage/browser/',
  all: true,
  exclude: [
    ...baseConfig.exclude,
    'src/ts',
    'src/router/routes/login/login-internal.js',
    'src/router/routes/login/login-localstack.js',
  ],
};
