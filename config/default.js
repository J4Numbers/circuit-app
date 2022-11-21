module.exports = {
  app: {
    http2: {
      enabled: false,
      ca: undefined,
      key: '/path/to/key/file',
      cert: '/path/to/cert/file',
    },
    name: 'circuit-app',
    hostname: 'localhost',
    session_hostname: 'localhost',
    port: 8000,
  },
  banner: {
    phrase: 'Internal',
    feedback_link: 'https://github.com/j4numbers/circuit-app/issues',
  },
  holiday: {
    source: 'govuk',
  },
  identity: {
    source: 'internal',
    internal: {
      users: [
        {
          id: '1',
          username: 'administrator',
          password: '4194d1706ed1f408d5e02d672777019f4d5385c766a8c6ca8acba3167d36a7b9',
          name: 'Administrator',
          email: 'admin@example.com',
          groups: [{
            name: 'administrator',
          }],
        },
      ],
      groups: [
        {
          name: 'default',
          description: 'Default actions that an anonymous user is able to do.',
        },
        {
          name: 'administrator',
          description: 'Actions that an administrative user is able to do.',
        },
      ],
    },
  },
  authorisation: {
    default: {
      allow: [
        'CAN_LOGIN',
        'VIEW_HOMEPAGE',
        'VIEW_CALENDAR',
      ],
    },
    administrator: {
      allow: [
        'VIEW_HOMEPAGE',
        'VIEW_CALENDAR',
        'VIEW_MANAGER',
        'UPDATE_MANAGER',
      ],
    },
  },
  nunjucks: {
    options: {},
  },
  logger: {
    level: 'debug',
    file: false,
    file_location: 'circuit-app.log',
  },
};
