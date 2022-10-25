/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  checkers: ['typescript'],
  commandRunner: {
    command: 'npm run test:ts',
  },
  coverageAnalysis: 'perTest',
  files: [
    'config/*.js',
    'public/**/*',
    'src/**/*.ts',
    'src/**/*.njk',
    'src/tsconfig.json',
    'test/.ts.mocharc.js',
    'test/**/*.js',
    'test/**/*.ts',
    'nyc.*.js',
    'package*.json',
  ],
  htmlReporter: {
    baseDir: 'reports/ts/',
  },
  mochaOptions: {
    config: 'test/.ts.mocharc.js',
  },
  packageManager: 'npm',
  reporters: ['html', 'progress'],
  testRunner: 'mocha',
  tsconfigFile: 'src/tsconfig.json',
  // disableTypeChecks: false,
};
