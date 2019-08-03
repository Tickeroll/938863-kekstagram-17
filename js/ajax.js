'use strict';
(function () {
  var SUCCESS_RESPONCE_CODE = 200;
  var BAD_REQUEST_CODE = 400;
  var NOT_FOUND_RESPONCE_CODE = 404;
  var TIMEOUT_VALUE = 10000;
  var BAD_READY_STATUS = 0;
  var urlGet = 'https://js.dump.academy/kekstagram/data';
  var urlPost = 'https://js.dump.academy/kekstagram';
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
      if (xhr.readyState === BAD_READY_STATUS) {
        onError('Ошибка сети');
        return;
      }
      var error;
      switch (xhr.status) {
        case SUCCESS_RESPONCE_CODE:
          onLoad(xhr.response);
          break;
        case BAD_REQUEST_CODE:
          error = 'Неверный запрос';
          break;
        case NOT_FOUND_RESPONCE_CODE:
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
    xhr.addEventListener('error', function () {
      onError('Ошибка сети');
    });
  }
  window.ajax = {
    upload: upload,
    getData: getData,
  };
})();
