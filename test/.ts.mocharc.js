module.exports = {
  require: ['ts-node/register', 'test/spec/helpers/setup.js'],
  spec: 'test/spec/ts/**/*.ts',
  timeout: 5000,
  exit: true,
};
