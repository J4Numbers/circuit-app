/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  commandRunner: {
    command: 'npm run test:browser',
  },
  concurrency: 1,
  coverageAnalysis: 'perTest',
  files: [
    'config/*.js',
    'public/**/*',
    'src/**/*.js',
    'src/**/*.njk',
    'test/**/*.js',
    'test/.browser.mocharc.js',
    'test/spec/browser/**/*.js',
    'test/spec/browser/*.js',
  ],
  htmlReporter: {
    baseDir: 'reports/browser/',
  },
  mochaOptions: {
    config: 'test/.browser.mocharc.js',
  },
  packageManager: 'npm',
  reporters: ['html', 'progress'],
  testRunner: 'mocha',
};
