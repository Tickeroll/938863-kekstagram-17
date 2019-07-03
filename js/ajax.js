'use strict';
(function () {
  /**
   * Получение данных по фотолисту с сервера
   * @param {function} callback
   */
  window.getData = function (callback) {
    var chery = new XMLHttpRequest();
    chery.addEventListener('load', function () {
      callback(JSON.parse(chery.response));
    });

    chery.open('GET', 'https://js.dump.academy/kekstagram/data');
    chery.send();
  };
})();
