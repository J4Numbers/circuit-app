import { v4 as uuidV4 } from 'uuid';
import StandardSessionManager from './standard-session-manager';
import { SessionOptions } from '../objects/session-options';

/**
 * An implementation of session management using memory as a store. This means
 * that a session will exist in local memory and will not survive a restart of
 * the application.
 */
export default class MemorySessionManager extends StandardSessionManager {
  /**
   * The local session map that we will use to store and look up sessions.
   */
  private sessionMap: { [x: string]: SessionOptions };

  /**
   * Create a new memory session manager with an empty session map.
   */
  constructor() {
    super();
    this.sessionMap = {};
  }

  /**
   * Generate a new session marker to be associated with a user.
   *
   * @param {SessionOptions} sessionOptions - Initial session options.
   * @returns {Promise<string>} The identifier that can be associated with
   * the user.
   */
  async generateSession(sessionOptions?: SessionOptions): Promise<string> {
    let sessionId;
    do {
      sessionId = uuidV4();
    } while (Object.prototype.hasOwnProperty.call(this.sessionMap, sessionId));
    let newSession: SessionOptions = {
      toasts: [],
    };
    if (sessionOptions !== undefined) {
      newSession = {
        ...newSession,
        ...sessionOptions,
      };
    }
    this.sessionMap[sessionId] = newSession;
    return sessionId;
  }

  /**
   * Return an existing session associated with a token.
   *
   * @param {string} sessionToken - The session token to look up.
   * @returns {Promise<SessionOptions>} The session options that were found
   * with the session token.
   * @throws {Error} Thrown when a session could not be found for the provided
   * token.
   */
  async getSession(sessionToken: string): Promise<SessionOptions> {
    if (Object.prototype.hasOwnProperty.call(this.sessionMap, sessionToken)) {
      return this.sessionMap[sessionToken];
    }
    throw new Error('Unable to find session associated with token');
  }

  /**
   * Overwrite an existing session with some new options.
   *
   * @param {string} sessionToken - The session token that we want to update.
   * @param {SessionOptions} sessionOptions - The session options that we
   * want to use from now on with the provided session token.
   * @returns {Promise<string>} The session token is returned on completion.
   * @throws {Error} Thrown when a session could not be found for the provided
   * token.
   */
  async overwriteSession(sessionToken: string, sessionOptions: SessionOptions): Promise<string> {
    if (Object.prototype.hasOwnProperty.call(this.sessionMap, sessionToken)) {
      this.sessionMap[sessionToken] = sessionOptions;
      return sessionToken;
    }
    throw new Error('Unable to find session associated with token');
  }
}
