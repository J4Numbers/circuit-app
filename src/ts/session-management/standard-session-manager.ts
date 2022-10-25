import { SessionOptions } from '../objects/session-options';

/**
 * A standardised method of dealing with sessions within the application which
 * should be associated with a single user.
 */
export default abstract class StandardSessionManager {
  /**
   * Generate a new session marker to be associated with a user.
   *
   * @param {SessionOptions} sessionOptions - Initial session options.
   * @returns {Promise<string>} The identifier that can be associated with
   * the user.
   */
  abstract generateSession(sessionOptions?: SessionOptions): Promise<string>;

  /**
   * Overwrite an existing session with some new options.
   *
   * @param {string} sessionToken - The session token that we want to update.
   * @param {SessionOptions} sessionOptions - The session options that we
   * want to use from now on with the provided session token.
   * @returns {Promise<string>} The session token is returned on completion.
   */
  abstract overwriteSession(sessionToken: string, sessionOptions: SessionOptions): Promise<string>;

  /**
   * Return an existing session associated with a token.
   *
   * @param {string} sessionToken - The session token to look up.
   * @returns {Promise<SessionOptions>} The session options that were found
   * with the session token.
   */
  abstract getSession(sessionToken: string): Promise<SessionOptions>;
}
