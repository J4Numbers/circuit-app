import * as crypto from 'crypto';
import StandardAuthenticationManager from './standard-authentication-manager';
import StandardIdentityManager from '../identity-management/standard-identity-manager';
import { AuthenticationDetails, UsernamePassword } from '../objects/authentication-details';
import { UserSession } from '../objects/user-session';

/**
 * An implementation of the StandardAuthenticationManager which uses a username and password
 * combination to authenticate a given user.
 *
 * @implements {StandardAuthenticationManager}
 */
export default class UsernamePasswordAuthenticationManager extends StandardAuthenticationManager {
  /**
   * The identity store to authenticate users against.
   */
  private identityManager: StandardIdentityManager;

  /**
   * Create a new username and password authenticaation manager which is backed with
   * an identity store of some sort.
   *
   * @param {StandardIdentityManager} identityManager - The identity manager that manages
   * what users are available to log in as.
   */
  constructor(identityManager: StandardIdentityManager) {
    super();
    this.identityManager = identityManager;
  }

  /**
   * Hash a given plaintext password using the SHA256 hashing algorithm.
   *
   * @param {string} passwordToHash - The plaintext password that needs to be hashed.
   * @returns {string} - Return a lower-case hex representation of the generated hash.
   */
  static async hashPassword(passwordToHash: string): Promise<string> {
    return crypto.createHash('sha256')
      .update(passwordToHash)
      .digest()
      .toString('hex')
      .toLowerCase();
  }

  /**
   * At some point, a user will attempt to authenticate themselves to this site.
   * This is the implementation of that functionality.
   *
   * @param {AuthenticationDetails} authenticationDetails - The authentication details
   * that will be used to authenticate this person.
   * @returns {Promise<UserSession>} The user session associated with a successful
   * login.
   */
  async login(authenticationDetails: AuthenticationDetails): Promise<UserSession> {
    if (Object.prototype.hasOwnProperty.call(authenticationDetails, 'username')) {
      const loginDetails = authenticationDetails as UsernamePassword;
      loginDetails.password = await UsernamePasswordAuthenticationManager
        .hashPassword(loginDetails.password);
      const discoveredIdent = await this.identityManager.lookupIdentity(loginDetails);
      return {
        ...discoveredIdent,
        created: new Date(),
        expiry: new Date(new Date().getTime() + 3600_000),
      };
    }
    throw new Error('Unsupported login credentials provided');
  }

  /**
   * At some point, someone may wish to browse the site anonymously, and we may wish to
   * provide that user with their own session.
   *
   * @returns {Promise<UserSession>} - The user session associated with an anonymous
   * login.
   */
  async anonymousLogin(): Promise<UserSession> {
    const ident = await this.identityManager.getAnonymousIdentity();
    return {
      ...ident,
      created: new Date(),
      expiry: new Date(new Date().getTime() + 3600_000),
    };
  }
}
