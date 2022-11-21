module.exports = {
  app: {
    http2: {
      enabled: 'APP_HTTP2_ENABLED',
      ca: 'APP_HTTP2_CA',
      key: 'APP_HTTP2_KEY',
      cert: 'APP_HTTP2_CERT',
    },
    name: 'APP_NAME',
    hostname: 'APP_HOSTNAME',
    session_hostname: 'APP_SESSION_HOSTNAME',
    port: 'APP_PORT',
  },
  banner: {
    phrase: 'BANNER_PHRASE',
    feedback_link: 'BANNER_FEEDBACK_LINK',
  },
  holiday: {
    source: 'HOLIDAY_SOURCE',
  },
  identity: {
    source: 'IDENTITY_SOURCE',
    internal: {
      users: {
        __name: 'IDENTITY_INTERNAL_USERS',
        __format: 'json',
      },
      groups: {
        __name: 'IDENTITY_INTERNAL_GROUPS',
        __format: 'json',
      },
    },
  },
  logger: {
    level: 'LOGGER_LEVEL',
    file: 'LOGGER_FILE_MODE',
    file_location: 'LOGGER_FILE_LOCATION',
  },
};
