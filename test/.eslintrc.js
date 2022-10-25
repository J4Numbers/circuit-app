module.exports = {
  // eslint-disable-next-line global-require,import/no-extraneous-dependencies
  ...require('@dwp/eslint-config-mocha'),
  plugins: ['mocha'],
  globals: {
    server: true,
    sinon: true,
    expect: true,
    request: true,
    testRequire: true,
    clearModule: true,
    importFresh: true,
    refreshPage: true,
    startMockRequire: true,
    stopMockRequire: true,
  },
  overrides: [
    {
      files: ['*_spec.js', '*_spec.ts'],
      rules: {
        'no-unused-expressions': 'off',
        'mocha/no-mocha-arrows': 'error',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-skipped-tests': 'warn',
        'func-names': 'off', // describe and if use unnamed functions
        'prefer-arrow-callback': 'off', // Arrow callback breaks describe and if, OK elsewhere
        'quote-props': 'off', // proxyquire uses quoted string literals to replace modules
        'global-require': 'off', // Best practice is to limit scope of to test suites
      },
    },
    {
      files: ['*_spec.ts', 'spec/helpers/**/*.ts'],

      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint',
      ],

      rules: {
        'brace-style': 'off',
        indent: 'off',
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        semi: 'off',

        camelcase: ['error', { properties: 'never' }],

        'import/extensions': ['error', 'never'],

        '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: false }],
        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/semi': ['error', 'always', { omitLastInOneLineBlock: false }],
      },

      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      },
    },
  ],
};
