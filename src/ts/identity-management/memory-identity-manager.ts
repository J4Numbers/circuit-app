import { User } from '../objects/user';
import { Group } from '../objects/group';
import { AuthenticationDetails, UsernamePassword } from '../objects/authentication-details';
import { Identity } from '../objects/identity';
import StandardIdentityManager from './standard-identity-manager';
import Logger from '../logger/bunyan-logger';
import NotFoundError from '../exceptions/not-found-error';

const log = Logger();
/**
 * A memory-based implementation of the identity manager.
 *
 * @augments StandardIdentityManager
 */
export default class MemoryIdentityManager extends StandardIdentityManager {
  /**
   * The users.
   *
   * @private
   */
  private readonly users: User[];

  /**
   * The groups.
   *
   * @private
   */
  private readonly groups: Group[];

  /**
   * Create a new memory identity manager.
   *
   * @param {User[]} users - The test users.
   * @param {Group[]} groups - The test groups.
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(users: User[], groups: Group[]) {
    super();
    this.users = JSON.parse(JSON.stringify(users));
    this.groups = [...groups];
  }

  /**
   * Lookup the identity of someone who has provided some authentication
   * details.
   *
   * @param {AuthenticationDetails} authenticationDetails - Authentication
   * details that have been provided by a user attempting to associate
   * themselves with an identity.
   * @returns {Promise<Identity>} The identity that the authentication details
   * provided link to.
   * @throws {Error} - Thrown when no identity was found for the credentials
   * provided, or the authentication details that were provided were not
   * sufficient to identify the user.
   */
  async lookupIdentity(authenticationDetails: AuthenticationDetails): Promise<Identity> {
    if (Object.prototype.hasOwnProperty.call(authenticationDetails, 'username')) {
      const usernamePassword = authenticationDetails as UsernamePassword;
      const user = this.users.find(
        (i) => i.username === usernamePassword.username
          && i.password === usernamePassword.password,
      );
      if (user !== undefined) {
        return {
          id: user.id,
          accessToken: 'memory-access-token',
          username: user.username,
          name: user.name,
          roles: user.groups?.map((group) => group.name),
        };
      }
      throw new Error('Unable to find identity which matched credentials');
    }
    throw new Error('Unsupported credentials provided');
  }

  /**
   * Return an anonymous identity for use throughout the site.
   *
   * @returns {Promise<Identity>} The identity of an anonymous user of the site.
   */
  // eslint-disable-next-line class-methods-use-this
  async getAnonymousIdentity(): Promise<Identity> {
    return {
      id: '0',
      accessToken: 'memory-access-token',
      username: 'anonymous',
      name: 'Anonymous',
      roles: ['default'],
    };
  }

  /**
   * Get the full details of a User from the IdP based on
   * the supplied Identity.
   *
   * @param {Identity} identity - The identity to describe which User is required.
   * @returns {Promise<User>} - The User details.
   * @throws {Error} If the User is unknown.
   */
  getUserForIdentity = async (identity: Identity): Promise<User> => this.getUser(identity.username);

  /**
   * Get the full details of a User from the IdP based on
   * the supplied username.
   *
   * @param {string} username - The username of the required User.
   * @returns {Promise<User>} - The User details.
   * @throws {Error} If the User is unknown.
   */
  getUser = async (username: string): Promise<User> => {
    const user = this.users.find((u) => u.username === username);
    if (user === undefined) {
      throw new NotFoundError(`Unable to find User with username ${username}`);
    }
    return user;
  };

  /**
   * Get the assigned Groups for a User.
   *
   * @param {User} user - The related User.
   * @returns {Promise<Array<Group>>} - The User groups.
   */
  // eslint-disable-next-line class-methods-use-this
  getUserGroups = async (user: User): Promise<Group[]> => (
    user.groups !== undefined ? user.groups : []);

  /**
   * Add a user to the specified group in the IdP.
   *
   * @param {User} user - The user.
   * @param {string} groupName - The associated group name.
   * @returns {User} - The updated User.
   * @throws {Error} If no group is found with the supplied name.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addUserToGroup = async (user: User, groupName: string): Promise<User> => {
    const group = this.groups.find((i) => i.name === groupName);
    if (group === undefined) {
      throw new Error('Unknown group');
    }
    user.groups?.push(group);

    return user;
  };

  /**
   * Confirm a newly created user, using the admin flow.
   *
   * @param {User} user - The user to confirm.
   * @returns {User} - The updated User.
   */
  // eslint-disable-next-line class-methods-use-this
  confirmUser = async (user: User): Promise<User> => user;

  /**
   * Create a Group in the IdP.
   *
   * @param {Group} group - The details of the group to create.
   * @returns {Promise<void>} - Void.
   */
  createGroup = async (group: Group): Promise<Group> => {
    this.groups.push(group);
    return group;
  };

  /**
   * Create a new User in the IdP.
   *
   * @param {User} user - The details of the User to create.
   * @returns {Promise<void>} - Void.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createUser = async (user: User): Promise<User> => {
    this.users.push(user);
    return user;
  };

  /**
   * Change the password for the logged-in user.
   *
   * @param { Identity }identity - The identity details of the logged-in user.
   * @param { string } currentPassword - The user's current password.
   * @param { string } newPassword - The proposed new password
   * for the logged-in user.
   * @returns { Promise<void> } The updated identity for the logged-in user.
   * @throws { Error } If unable to change password.
   */
  changePassword = async (
    identity: Identity,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    const user = this.users.find(
      (i) => i.username === identity.username,
    );
    if (user === undefined) {
      throw new Error('Unknown user!');
    }
    if (currentPassword !== user.password) {
      throw new Error('Invalid PreviousPassword');
    }
    if (newPassword !== user.password) {
      user.password = newPassword;
      log.debug('Password should be changed in memory-identity-manager.');
    }
  };

  /**
   * Get a list of Users registered in the IdP.
   *
   * @returns {Promise<Array<User>>} - List of Users returned from IdP.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listUsers = async ():
  Promise<Array<User>> => [...this.users];

  /**
   * Get a list of Groups in the IdP.
   *
   * @returns {Promise<Array<Group>>} - The list of Groups.
   */
  getGroups = async ():
  Promise<Array<Group>> => [...this.groups];

  /**
   * Get a list of Users registered in the IdP.
   *
   * @param {Group} group - The Group to return Users for.
   * @returns {Promise<Array<User>>} - List of Users returned from IdP.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUsersInGroup = async (group: Group): Promise<Array<User>> => this.users.filter(
    (u) => u.groups?.find((g) => g.name === group.name) !== undefined,
  );
}
