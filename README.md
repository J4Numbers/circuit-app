# circuit-app

The webapp that is part of an exemplar circuit for developers who are new to NodeJS
and JavaScript development.

The app itself is a simple NodeJS application built upon Restify and a few other
items in a webstack for server-side website development.

Notably:
* Restify - The central webserver framework
* TypeScript - Any higher logic operations are developed in TypeScript
* Nunjucks - HTML templating engine
* SASS/SCSS - HTML CSS engine

## Installation

To install and this service, please run the following commands:

```bash
npm i && npm run build
```

These will install all the required packages for this project and create all the
build assets that this project uses to run effectively as a UI application.

## Run the service

To start the service, follow the steps for installation, then run the following command:

```bash
npm run start
```

This will start the service using `http` on port `8000` by default. These values can be
overridden by providing your own configuration file inside the `config/` folder. Copying
the `config/default.js` to `config/local.js` would allow you to make changes to your
local environment without impacting the global repository settings.

Once the server is running, you should be able to log in with the default username and
password of `administrator/administrator`.

## Testing

This project contains several dimensions of testing for the application.

* Plain JS tests can be found under `test/spec/app`
* Typescript tests can be found under `test/spec/ts`
* Browser tests can be found under `test/spec/browser`

All of these tests can be run (after following the installation instructions), by running
the following instruction:

```bash
npm t
```

The individual test suites can be run with `npm run [test:js|test:ts|test:browser]`, but
the prior command will run all three in sequence.

There is also a companion project to this which can be found [here][1]. Said
project hosts a Selenium suite for more in-depth UI testing and experimentation.

Whenever this project gets built on `develop`, the acceptance test project will
be started and will run against whichever image has just been built.

[1]: https://github.com/j4numbers/circuit-application-testing
