/**
 * Given a list of all elements which match the given selector. Ensure that the list
 * is in alphabetical order by comparing their innerHtml.
 *
 * @param {Browser} browser - The zombie test browser.
 * @param {string} selector - Selector to find elements.
 */
const assertAlphabeticalOrder = (browser, selector) => {
  const elements = browser.queryAll(selector);
  let previousName = elements[0].innerHTML;
  for (let i = 1; i < elements.length; i++) {
    const currentName = elements[i].innerHTML;
    expect(previousName.localeCompare(currentName)).to.be.below(0, `element (${i}) ${previousName} is before ${currentName}`);
    previousName = currentName;
  }
};

module.exports = { assertAlphabeticalOrder };
