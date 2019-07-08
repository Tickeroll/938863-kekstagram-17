'use strict';

(function () {
  var escKey = 27;
  var isEscEvent = function (evt) {
    return evt.keyCode === escKey;
  };
  var getRandomArrayElem = function (arr) {
    return arr[getRandomInt(0, arr.length - 1)];
  };
  /**
   * Функция возвращает случайное целое число
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  var createMessage = function (status, text) {
    var template = document.querySelector('#' + status);
    var messageContainer = template.content.querySelector('.' + status).cloneNode(true);
    var messageTitle = messageContainer.querySelector('.' + status + '__title');
    messageTitle.textContent = text;
    document.querySelector('main').appendChild(messageContainer);

    var hideMessage = function (evt) {
      if (evt.type === 'click'
        || isEscEvent(evt)) {
        messageContainer.removeEventListener('click', hideMessage);
        document.removeEventListener('keyup', hideMessage);
        document.removeEventListener('click', hideMessage);
        if (messageContainer.parentElement !== null) {
          messageContainer.parentElement.removeChild(messageContainer);
        }
      }
    };

    messageContainer.addEventListener('click', hideMessage);
    document.addEventListener('keyup', hideMessage);
    document.addEventListener('click', hideMessage);
  };
  window.utility = {
    getRandomInt: getRandomInt,
    isEscEvent: isEscEvent,
    createMessage: createMessage,
    getRandomArrayElem: getRandomArrayElem
  };
})();
