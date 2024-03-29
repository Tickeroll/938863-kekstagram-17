'use strict';

(function () {
  var ESCKEY = 27;
  var ENTER_KEY = 13;
  var CLICK_EVENT = 'click';

  function isEscEvent(evt) {
    return evt.keyCode === ESCKEY;
  }

  function isEnterKeyEvent(evt) {
    return evt.keyCode === ENTER_KEY;
  }

  function isClickEvent(evt) {
    return evt.type === CLICK_EVENT;
  }

  function getRandomArrayElem(arr) {
    return arr[getRandomInt(0, arr.length - 1)];
  }

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

  function createMessage(status, text, onHide) {
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
        if (onHide) {
          onHide(evt);
        }
      }
    };

    messageContainer.addEventListener('click', hideMessage);
    document.addEventListener('keyup', hideMessage);
    document.addEventListener('click', hideMessage);
  }

  window.utility = {
    isEscEvent: isEscEvent,
    isEnterKeyEvent: isEnterKeyEvent,
    isClickEvent: isClickEvent,
    createMessage: createMessage,
    getRandomArrayElem: getRandomArrayElem
  };
})();
