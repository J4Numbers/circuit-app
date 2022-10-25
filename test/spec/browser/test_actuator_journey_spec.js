const Browser = require('zombie');

const baseLink = 'http://localhost:8199/health';

describe('The actuator journeys', function () {
  const browser = new Browser();

  it('should render the page immediately for the health endpoint', function () {
    return refreshPage(browser, baseLink).then(() => browser.assert.success());
  });
});
