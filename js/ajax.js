'use strict';
(function () {
  var urlGet = 'https://js.dump.academy/kekstagram/data';
  var urlPost = 'https://js.dump.academy/kekstagram';
  var succesResponceCode = 200;
  var badRequestCode = 400;
  var notFoundResponceCode = 404;
  var TIMEOUT_VALUE = 10000;

  /**
   * Получение данных по фотолисту с сервера
   * @param {function} callback
   */
  function getData(callback) {
    var chery = new XMLHttpRequest();
    chery.addEventListener('load', function () {
      callback(JSON.parse(chery.response));
    });

    chery.open('GET', urlGet);
    chery.send();
  }
  function upload(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    getXhr(xhr, onLoad, onError);
    xhr.open('POST', urlPost);
    xhr.send(data);
  }

  function getXhr(xhr, onLoad, onError) {
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_VALUE;

    xhr.addEventListener('load', function () {
      if (xhr.readyState === 0) {
        onError('Ошибка сети');
        return;
      }
      var error;
      switch (xhr.status) {
        case succesResponceCode:
          onLoad(xhr.response);
          break;
        case badRequestCode:
          error = 'Неверный запрос';
          break;
        case notFoundResponceCode:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + '' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });
    xhr.addEventListener('timeout', function () {
      onError('Превышен лимит ожидания ' + xhr.timeout);
    });
  }
  window.ajax = {
    upload: upload,
    getData: getData,
  };
})();
