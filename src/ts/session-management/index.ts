import StandardSessionManager from './standard-session-manager';
import MemorySessionManager from './memory-session-manager';

let sessionManager: StandardSessionManager;

/**
 * Resolve the session manager that we want to use for the installation of
 * this application.
 *
 * @returns {StandardSessionManager} The session manager that we're going to
 * use for the installation of the app.
 */
const resolveSessionManager = (): StandardSessionManager => new MemorySessionManager();

/**
 * Return the singleton session manager that will be used throughout the
 * lifetime of the application.
 *
 * @returns {StandardSessionManager} The singleton session manager to use
 * throughout the app.
 */
export default () => {
  if (sessionManager === undefined) {
    sessionManager = resolveSessionManager();
  }
  return sessionManager;
};
