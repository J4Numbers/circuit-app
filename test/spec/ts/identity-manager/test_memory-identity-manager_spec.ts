import { expect } from 'chai';
import MemoryIdentityManager from '../../../../src/ts/identity-management/memory-identity-manager';
import { User } from '../../../../src/ts/objects/user';
import { Group } from '../../../../src/ts/objects/group';
import { Identity } from '../../../../src/ts/objects/identity';
import UsernamePasswordAuthenticationManager
  from '../../../../src/ts/authentication-management/username-password-authentication-manager';

const config = require('config');

describe('The memory identity manager', function () {
  const identityManager = new MemoryIdentityManager(config.get('identity.internal.users'), config.get('identity.internal.groups'));
  describe('Creating Users and Groups', function () {
    const user: User = {
      id: '11111',
      username: 'test-username',
      name: 'test-user',
      family_name: 'test-family-name',
      given_name: 'test-given-name',
      middle_name: 'test-middle-name',
      email: 'test@test.com',
      password: 'password',
      groups: [],
    };

    const group: Group = {
      name: 'test-group',
      description: 'test-description',
    };

    it('Should create a user', function () {
      return expect(identityManager.createUser(user)).to.eventually.be.fulfilled;
    });

    it('Should confirm a user', function () {
      return expect(identityManager.confirmUser(user)).to.eventually.be.fulfilled;
    });

    it('Should create a group', function () {
      return expect(identityManager.createGroup(group)).to.eventually.be.fulfilled;
    });

    it('Should add user to group', function () {
      return expect(identityManager.addUserToGroup(user, group.name)).to.eventually.be.fulfilled;
    });

    it('Should get a user based on identity', function () {
      return expect(identityManager.getUserForIdentity({
        id: '11111',
        username: user.username,
        name: user.name,
        accessToken: '111111',
        roles: [],
      })).to.eventually.be.fulfilled;
    });

    it('Should get a user', function () {
      return expect(identityManager.getUser(user.username)).to.eventually.be.fulfilled;
    });
  });
  describe('User management', function () {
    const identity: Identity = {
      id: '11111',
      accessToken: 'access-token',
      username: 'administrator',
      name: 'Administrator',
      roles: ['default', 'administrator'],
    };
    it('should change the user password', function () {
      return UsernamePasswordAuthenticationManager.hashPassword('administrator')
        .then((hashedPass) => expect(
          identityManager.changePassword(identity, hashedPass, 'pw'),
        ).to.eventually.be.fulfilled);
    });
    it('should throw an error if attempting to change the same user password with the wrong current password', function () {
      return expect(identityManager.changePassword(identity, 'administrator', 'pw'))
        .to.eventually.be.rejectedWith('Invalid PreviousPassword');
    });
  });
});
