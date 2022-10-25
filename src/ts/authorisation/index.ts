import config from 'config';
import StandardAuthorisationChecker from './standard-authorisation-checker';
import RbacAuthorisationChecker from './rbac-authorisation-checker';

let authorisationChecker: StandardAuthorisationChecker;

/**
 * Return the current authorisation handler for the installation of this
 * application.
 *
 * @returns {StandardAuthorisationChecker} The instance of the authorisation
 * checker to use.
 */
const resolveAuthorisationChecker = (): StandardAuthorisationChecker => new RbacAuthorisationChecker(config.get('authorisation'));

/**
 * Generate and return a singleton instance of the authorisation checker to
 * use during the lifetime of this application.
 *
 * @returns {StandardAuthorisationChecker} The singleton instance of the
 * authorisation checker to use.
 */
export default (): StandardAuthorisationChecker => {
  if (authorisationChecker === undefined) {
    authorisationChecker = resolveAuthorisationChecker();
  }
  return authorisationChecker;
};
