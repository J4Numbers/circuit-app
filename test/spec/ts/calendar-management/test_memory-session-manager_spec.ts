import { expect } from 'chai';
import { UserSession } from '../../../../src/ts/objects/user-session';
import MemorySessionManager from '../../../../src/ts/session-management/memory-session-manager';

const generateUserSession = (): UserSession => {
  const now = new Date();
  return {
    id: '11111',
    accessToken: '1234567890',
    username: 'reporter',
    name: 'Rep',
    created: now,
    expiry: new Date(now.getTime() + 60000),
    roles: [],
  };
};

describe('The memory session manager', function () {
  describe('Generating a new session token', function () {
    it('Should generate a new session token on request', function () {
      const sessionManager = new MemorySessionManager();
      return expect(sessionManager.generateSession()).to.eventually.be.a('string');
    });
  });

  describe('Getting a session', function () {
    it('Should throw an error if no session exists to get', function () {
      const sessionManager = new MemorySessionManager();
      return expect(sessionManager.getSession('abc123')).to.eventually.be.rejected;
    });

    it('Should return the session if the session has already been created', function () {
      const sessionManager = new MemorySessionManager();
      const ident = generateUserSession();
      return sessionManager.generateSession({ userIdent: ident })
        .then(
          (token) => expect(sessionManager.getSession(token))
            .to.eventually.deep.equal({ toasts: [], userIdent: ident }),
        );
    });
  });

  describe('Overwriting a session', function () {
    it('Should throw an error if no token exists to be overwritten', function () {
      const sessionManager = new MemorySessionManager();
      return expect(sessionManager.overwriteSession('abc123', {})).to.eventually.be.rejected;
    });

    it('Should overwrite an existing session when provided', function () {
      const sessionManager = new MemorySessionManager();
      const ident = generateUserSession();
      const updatedIdent = { ...ident };
      updatedIdent.name = 'Eve';
      return sessionManager.generateSession({ userIdent: ident })
        .then((token) => sessionManager.getSession(token)
          .then((session) => sessionManager
            .overwriteSession(token, { ...session, userIdent: updatedIdent })
            .then((updatedToken) => expect(sessionManager.getSession(updatedToken))
              .to.eventually.deep.equal({
                toasts: [],
                userIdent: updatedIdent,
              }))));
    });
  });
});
