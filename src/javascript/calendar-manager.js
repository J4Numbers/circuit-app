/**
 * Remove a single day from a user's holiday calendar. This JavaScript
 * function acts as a soft layer between the screen where all the holidays
 * are displayed, and the API which effects the change.
 *
 * @param {string} dayToRemove - The day should be in 'YYYY-MM-DD' format,
 * and will be removed if it exists from the user's calendar.
 */
// eslint-disable-next-line no-unused-vars
const removeDayFromCalendar = (dayToRemove) => {
  const formElement = document.createElement('form');
  formElement.setAttribute('action', `/manager/remove/${dayToRemove}`);
  formElement.setAttribute('method', 'post');
  document.body.appendChild(formElement);
  formElement.submit();
};
