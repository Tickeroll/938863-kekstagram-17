'use strict';
(function () {
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

  /**
   * Функция отрисовки списка фотографий
   * @param {array} photos
   */
  function renderPhotolist(photos) {
    var template = document.querySelector('#picture');
    var photoBlockElement = document.querySelector('.pictures');
    var pictures = photoBlockElement.querySelectorAll('.picture');
    for (var i = 0; i < pictures.length; i++) {
      pictures[i].parentNode.removeChild(pictures[i]);
    }
    for (var i = 0; i < photos.length; i++) {
      var node = document.importNode(template.content, true);
      node.querySelector('img').src = photos[i].url;
      node.querySelector('.picture__likes').textContent = photos[i].likes;
      node.querySelector('.picture__comments').textContent = photos[i].comments.length;
      photoBlockElement.appendChild(node);
    }
  }
  var lastTimeout;
  window.getData(function (photos) {
    /**
     *Добавляем в разметку блоки с фтографиями и описанием
     */
    renderPhotolist(photos);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    /**
     * обработчик кнопки фильтра - "популярные"
     */
    document.querySelector('#filter-popular').addEventListener('click', function (event) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        renderPhotolist(photos);
      }, 500);
      document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
      event.target.classList.add('img-filters__button--active');
    });
    /**
     * обработчик кнопки фильтра - "новые"
     */
    document.querySelector('#filter-new').addEventListener('click', function (event) {
      var randomPhotos = [];
      var index = [];
      for (var i = 0; i < 10; i++) {
        var indexPhoto = getRandomInt(0, photos.length);
        while (index.indexOf(indexPhoto) >= 0) {
          indexPhoto = getRandomInt(0, photos.length);
        }
        index.push(indexPhoto);
        randomPhotos.push(photos[indexPhoto]);
      }
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        renderPhotolist(randomPhotos);
      }, 500);
      document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
      event.target.classList.add('img-filters__button--active');
    });
    /**
     * обработчик кнопки фильтра - "обсуждаемые"
     */
    document.querySelector('#filter-discussed').addEventListener('click', function (event) {
      var newPhotos = photos.slice(0, photos.length);
      newPhotos.sort(function (a, b) {
        if (a.comments.length > b.comments.length) {
          return -1;
        }
        if (a.comments.length <= b.comments.length) {
          return 1;
        }
        return 0;
      });
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        renderPhotolist(newPhotos);
      }, 500);
      document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
      event.target.classList.add('img-filters__button--active');
    });
  });
})();
