import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';
import UsernamePasswordAuthenticationManager from '../../../../src/ts/authentication-management/username-password-authentication-manager';
import MemoryIdentityManager, * as memoryIdentityModule from '../../../../src/ts/identity-management/memory-identity-manager';

describe('The username and password implementation of the identity manager', function () {
  describe('Attempting to log in', function () {
    afterEach(function () {
      ImportMock.restore();
    });

    it('Should reject the login if a different credential provider was used', function () {
      const identManager = ImportMock.mockClass<MemoryIdentityManager>(memoryIdentityModule, 'default');
      const authManager = new UsernamePasswordAuthenticationManager(identManager.getMockInstance());
      const authDetails = { saml: 'some-saml-token-here' };
      return expect(authManager.login(authDetails)).to.eventually.be.rejected;
    });

    it('Should reject the login if the expected credential provider was used with an invalid login', function () {
      const identManager = ImportMock.mockClass<MemoryIdentityManager>(memoryIdentityModule, 'default');
      identManager.mock('lookupIdentity').rejects(new Error('Expected error was thrown'));
      const authManager = new UsernamePasswordAuthenticationManager(identManager.getMockInstance());
      const authDetails = { username: '', password: '' };
      return expect(authManager.login(authDetails)).to.eventually.be.rejected;
    });

    it('Should return a successful ident if the expected credential provider was used with a valid login', function () {
      const identManager = ImportMock.mockClass<MemoryIdentityManager>(memoryIdentityModule, 'default');
      identManager.mock('lookupIdentity')
        .withArgs({ username: 'user-abc-123', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' })
        .resolves({ username: 'user-abc-123', name: 'test-user', roles: [] });
      const authManager = new UsernamePasswordAuthenticationManager(identManager.getMockInstance());
      const authDetails = { username: 'user-abc-123', password: 'password' };
      return authManager.login(authDetails).then((identityFound) => {
        expect(identityFound.name).to.equal('test-user');
        expect(identityFound.roles).to.have.lengthOf(0);
        expect(identityFound.expiry.getTime()).to.be.greaterThan(identityFound.created.getTime());
      });
    });
  });
});
