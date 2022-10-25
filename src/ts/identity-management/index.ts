import config from 'config';
import StandardIdentityManager from './standard-identity-manager';
import MemoryIdentityManager from './memory-identity-manager';

let identityManager: StandardIdentityManager;

/**
 * Resolve the identity manager that we want to use for the installation of
 * this application.
 *
 * @returns {StandardIdentityManager} The identity manager that we're going to
 * use for the installation of the app.
 * @throws {Error} - If the application is not configured correctly.
 */
const resolveIdentityManager = (): StandardIdentityManager => {
  const identitySource = config.get('identity.source');
  let identityInst: StandardIdentityManager;

  switch (identitySource) {
    case 'internal':
    case 'test':
      identityInst = new MemoryIdentityManager(
        config.get(`identity.${identitySource}.users`),
        config.get(`identity.${identitySource}.groups`),
      );
      break;
    default:
      throw new Error(`Invalid config: unknown identity source ${identitySource}`);
  }

  return identityInst;
};

/**
 * Return the singleton identity manager that will be used throughout the
 * lifetime of the application.
 *
 * @returns {StandardIdentityManager} The singleton identity manager to use
 * throughout the app.
 */
export default (): StandardIdentityManager => {
  if (identityManager === undefined) {
    identityManager = resolveIdentityManager();
  }
  return identityManager;
};
