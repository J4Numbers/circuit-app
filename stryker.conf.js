/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  commandRunner: {
    command: 'npm run test:js',
  },
  coverageAnalysis: 'perTest',
  files: [
    'config/*.js',
    'public/**/*',
    'src/**/*.js',
    'src/**/*.njk',
    'src/app.js',
    'test/.mocharc.js',
    'test/**/*.js',
    'test/spec/app/**/*.js',
    'test/spec/app/test_app_spec.js',
  ],
  htmlReporter: {
    baseDir: 'reports/js/',
  },
  mochaOptions: {
    config: 'test/.mocharc.js',
  },
  mutate: [
    'src/app.js',
    'src/**/*.js',
    '!src/js/**/*.js',
  ],
  packageManager: 'npm',
  reporters: ['html', 'progress'],
  testRunner: 'mocha',
};
