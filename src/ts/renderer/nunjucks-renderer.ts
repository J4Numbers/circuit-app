import { Environment, FileSystemLoader } from 'nunjucks';
import moment, { Moment } from 'moment';
import config from 'config';
import * as path from 'path';

/**
 * Convert a date or date string into a Moment JS object for further
 * formatting.
 *
 * @param {Date|string} date - The date we are transforming into a Moment.
 * @returns {Moment} The translated moment of the date.
 */
const momentify = (date: Date | string): Moment => moment(date);

/**
 * Format a given date to turn into a string to be shown within our views.
 *
 * @param {moment.Moment} date - The date we are transforming into a string.
 * @param {string} formatString - The format to output the date as.
 * @returns {string} The formatted date string.
 */
const formatDate = (date: Moment, formatString = 'YYYY-MM-DD'): string => date.format(formatString);

let renderer: Environment;

/**
 * Convert a list of mapped errors into the rows of an ErrorSummary document.
 *
 * @param {object} errorList - A list of the form fields that
 * have reported errors and the associated errors that they have reported.
 * @returns {Array<{ text: string, href: string }>} The ErrorSummary list of
 * errors that were reported.
 */
const errorfyList: (
  errorList: { [key: string]: string }
) => Array<{ text: string, href: string }> = (
  errorList,
) => Object.keys(errorList)
  .map((errorKey) => ({
    text: errorList[errorKey],
    href: `#${errorKey}`,
  }));

/**
 * Generate a Nunjucks environment to use with this installation of the
 * application.
 *
 * @returns {Environment} The Nunjucks environment associated with this
 * installation of the applicatoni.
 */
const generateRenderer: () => Environment = () => {
  const nunjucksEnv = new Environment([
    new FileSystemLoader(path.join(process.cwd(), '/src/views')),
    new FileSystemLoader(path.join(process.cwd(), 'node_modules/govuk-frontend/govuk')),
    new FileSystemLoader(path.join(process.cwd(), 'node_modules/govuk-frontend/govuk/components')),
  ], { ...config.get('nunjucks.options') });

  nunjucksEnv.addGlobal('banner', config.get('banner'));
  nunjucksEnv.addFilter('momentify', momentify);
  nunjucksEnv.addFilter('formatDate', formatDate);
  nunjucksEnv.addFilter('errorfyList', errorfyList);
  return nunjucksEnv;
};

/**
 * Return a singleton instance of the Nunjucks renderer for this service.
 *
 * @returns {Environment} The singleton Nunjucks renderer to be used for this
 * application's lifetime.
 */
export default (): Environment => {
  if (renderer === undefined) {
    renderer = generateRenderer();
  }
  return renderer;
};
