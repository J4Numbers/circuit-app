// eslint-disable-next-line import/no-extraneous-dependencies
const eslintBase = require('@dwp/eslint-config-base');

module.exports = {
  ...eslintBase,

  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jsdoc',
  ],

  extends: [...eslintBase.extends, 'plugin:jsdoc/recommended'],

  ignorePatterns: [
      '*.eslintrc*',
  ],

  rules: {
    ...eslintBase.rules,

    'brace-style': 'off',
    indent: 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    semi: 'off',

    camelcase: ['error', { properties: 'never' }],

    'import/extensions': [ 'error', 'always', { js: 'never', ts: 'never' } ],

    'jsdoc/newline-after-description': ['error'],
    'jsdoc/require-description': ['error'],
    'jsdoc/require-description-complete-sentence': ['error'],
    'jsdoc/require-hyphen-before-param-description': ['error'],
    'jsdoc/require-param': ['error'],
    'jsdoc/require-param-description': ['error'],
    'jsdoc/require-param-name': ['error'],
    'jsdoc/require-param-type': ['error'],
    'jsdoc/require-property': ['error'],
    'jsdoc/require-property-description': ['error'],
    'jsdoc/require-returns': ['error', { forceReturnsWithAsync: true }],
    'jsdoc/require-returns-check': ['error'],
    'jsdoc/require-returns-description': ['error'],
    'jsdoc/require-returns-type': ['error'],
    'jsdoc/require-throws': ['error'],
    'jsdoc/require-jsdoc': ['error', {
      require: {
        ArrowFunctionExpression: true,
        ClassDeclaration: true,
        ClassExpression: true,
        FunctionDeclaration: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
      contexts: ['ClassProperty'],
    }],

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
};
