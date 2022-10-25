import { AuthenticationDetails } from '../objects/authentication-details';
import { Identity } from '../objects/identity';
import { Group } from '../objects/group';
import { User } from '../objects/user';

/**
 * A standardised interface for interacting with various identity managers that
 * we might choose to use throughout the development of this application.
 */
export default abstract class StandardIdentityManager {
  /**
   * Lookup the identity of someone who has provided some authentication
   * details.
   *
   * @param {AuthenticationDetails} authenticationDetails - Authentication
   * details that have been provided by a user attempting to associate
   * themselves with an identity.
   * @returns {Promise<Identity>} The identity that the authentication details
   * provided link to.
   */
  abstract lookupIdentity(authenticationDetails: AuthenticationDetails): Promise<Identity>;

  /**
   * Return an anonymous identity for use throughout the site.
   *
   * @returns {Promise<Identity>} The identity of an anonymous user of the site.
   */
  abstract getAnonymousIdentity(): Promise<Identity>;

  /**
   * Get the full details of a User from the IdP based on
   * the supplied Identity.
   *
   * @param {Identity} identity - The identity to describe which User is required.
   * @returns {Promise<User>} - The User details.
   */
  abstract getUserForIdentity(identity: Identity): Promise<User>;

  /**
   * Get the full details of a User from the IdP based on
   * the supplied username.
   *
   * @param {string} username - The username of the required User.
   * @returns {Promise<User>} - The User details.
   */
  abstract getUser(username: string): Promise<User>;

  /**
   * Get the assigned Groups for a User.
   *
   * @param {User} user - The related User.
   * @returns {Promise<Array<Group>>} - The User groups.
   */
  abstract getUserGroups(user: User): Promise<Array<Group>>;

  /**
   * Create a new User in the IdP.
   *
   * @param {User} user - The details of the User to create.
   * @returns {Promise<User>} - The created User.
   */
  abstract createUser(user: User): Promise<User>;

  /**
   * Confirm a newly created user, using the admin flow.
   *
   * @param {User} user - The user to confirm.
   * @returns {User} - The updated User.
   */
  abstract confirmUser(user: User): Promise<User>;

  /**
   * Get a list of all Users registered in the IdP.
   *
   * @returns {Promise<Array<User>>} - List of Users in the IdP.
   */
  abstract listUsers(): Promise<Array<User>>;

  /**
   * Get a list of Users who are in the specified Group.
   *
   * @param {Group} group - The Group to return Users for.
   * @returns {Promise<Array<User>>} - List of Users in the specified Group.
   */
  abstract getUsersInGroup(group: Group): Promise<Array<User>>;

  /**
   * Get a list of Groups in the IdP.
   *
   * @returns {Promise<Array<Group>>} - The list of Groups.
   */
  abstract getGroups(): Promise<Array<Group>>;

  /**
   * Create a Group in the IdP.
   *
   * @param {Group} group - The details of the group to create.
   * @returns {Promise<Group>} - The newly created Group.
   */
  abstract createGroup(group: Group): Promise<Group>;

  /**
   * Add a user to the specified group in the IdP.
   *
   * @param {User} user - The user.
   * @param {Group} groupName - The associated group name.
   * @returns {User} - The updated User.
   */
  abstract addUserToGroup(user: User, groupName: string): Promise<User>;

  /**
   * Change password for the logged-in user.
   *
   * @param { Identity } identity - The object containing the identity details
   * of the logged-in user.
   * @param { string } currentPassword - The user's current password.
   * @param { string } newPassword - The new password for the user.
   * @returns Promise<void> When successful.
   */
  abstract changePassword(identity: Identity, currentPassword: string,
    newPassword: string): Promise<void>;
}
