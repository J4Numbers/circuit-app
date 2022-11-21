import StandardAuthenticationManager from './standard-authentication-manager';
import UsernamePasswordAuthenticationManager from './username-password-authentication-manager';
import resolveIdentityManager from '../identity-management';

let authenticationManager: StandardAuthenticationManager;

/**
 * Resolve the authentication manager that this application will be using for this
 * installation.
 *
 * @returns {StandardAuthenticationManager} The authentication manager for this installation.
 */
// eslint-disable-next-line max-len
const resolveAuthenticationManager = (): StandardAuthenticationManager => new UsernamePasswordAuthenticationManager(
  resolveIdentityManager(),
);

/**
 * Return a singleton instance of the authentication manager.
 *
 * @returns {StandardAuthenticationManager} The authentication manager instance.
 */
export default (): StandardAuthenticationManager => {
  if (authenticationManager === undefined) {
    authenticationManager = resolveAuthenticationManager();
  }
  return authenticationManager;
};
