// eslint-disable-next-line no-unused-vars
const removeDayFromCalendar = (dayToRemove) => {
  const formElement = document.createElement('form');
  formElement.setAttribute('action', `/manager/remove/${dayToRemove}`);
  formElement.setAttribute('method', 'post');
  document.body.appendChild(formElement);
  formElement.submit();
};
