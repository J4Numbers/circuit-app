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

## Testing

This project contains several dimensions of testing for the application.

* Plain JS tests can be found under `test/spec/app`
* Typescript tests can be found under `test/spec/ts`
* Browser tests can be found under `test/spec/browser`

There is also a companion project to this which can be found [here][1]. Said
project hosts a Selenium suite for more in-depth UI testing and experimentation.

Whenever this project gets built on `develop`, the acceptance test project will
be started and will run against whichever image has just been built.

[1]: https://github.com/j4numbers/circuit-application-testing
