import { UserSession } from '../objects/user-session';
import { AuthenticationDetails } from '../objects/authentication-details';

/**
 * Standard method for authentication management within the application.
 */
export default abstract class StandardAuthenticationManager {
  /**
   * At some point, a user will attempt to authenticate themselves to this site.
   * This is the implementation of that functionality.
   *
   * @param {AuthenticationDetails} authenticationDetails - The authentication details
   * that will be used to authenticate this person.
   * @returns {Promise<UserSession>} - The user session associated with a successful
   * login.
   */
  abstract login(authenticationDetails: AuthenticationDetails): Promise<UserSession>;

  /**
   * At some point, someone may wish to browse the site anonymously, and we may wish to
   * provide that user with their own session.
   *
   * @returns {Promise<UserSession>} - The user session associated with an anonymous
   * login.
   */
  abstract anonymousLogin(): Promise<UserSession>;
}
