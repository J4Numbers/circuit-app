/**
 * A standardised error used throughout the application to represent a missing
 * object that we were explicitly looking for. The standard way to initialise
 * this error is to provide a {string} message containing the details of what
 * was not found.
 *
 * @augments {Error}
 */
export default class NotFoundError extends Error {
}
