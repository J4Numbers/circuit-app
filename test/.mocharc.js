module.exports = {
  require: [
    'test/spec/helpers/setup.js',
    'test/spec/helpers/server-setup.js',
  ],
  globals: [
    '__coverage__',
    'Generator',
  ],
  spec: 'test/spec/app/**/*.js',
  ignore: [],
  timeout: 10000,
  exit: true,
};
