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
  var closePopup = function () {
    document.querySelector('.big-picture').classList.add('hidden');
  };
  function renderComments(comments, offset) {
    const COMMENT_NUMBER = 5;
    var newComment = document.querySelector('.social__comments');
    var templateComment = document.querySelector('#comment');
    for (var i = 0; (i + COMMENT_NUMBER * offset) < comments.length && i < COMMENT_NUMBER; i++) {
      var oneComment = document.importNode(templateComment.content, true);
      oneComment.querySelector('img').src = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
      oneComment.querySelector('.social__text').textContent = comments[i + COMMENT_NUMBER * offset].message;
      newComment.appendChild(oneComment);
    }
    document.querySelector('.social__comment-count').textContent = Math.min(COMMENT_NUMBER + COMMENT_NUMBER * offset, comments.length) + ' из ' + comments.length;
    return  Math.min(COMMENT_NUMBER + COMMENT_NUMBER * offset, comments.length);
  }


  /**
   * Функция рендера больших картинок
   * @param {object} photo
   */
  function renderBigImages(photo) {
    var commentsLoader = document.querySelector('.social__comments-loader');
    document.querySelector('.big-picture').classList.remove('hidden');
    document.querySelector('.big-picture__img img').src = photo.url;
    document.querySelector('.likes-count').textContent = photo.likes;
    document.querySelector('.social__caption').textContent = photo.description;
    commentsLoader.classList.remove('visually-hidden');

    // Удаление предыдущих комментариев
    var oldComments = document.querySelectorAll('.social__comments .social__comment');
    for (var i = 0; i < oldComments.length; i++) {
      oldComments[i].parentNode.removeChild(oldComments[i]);
    }
    // отрисовка комментариев
    renderComments(photo.comments, 0);

    var clickCounter = 1;
    commentsLoader.onclick = function() {
      var visibleCommentsNumber = renderComments(photo.comments, clickCounter);
      clickCounter++;
      if (visibleCommentsNumber === photo.comments.length) {
        commentsLoader.classList.add('visually-hidden');
      }
    };
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
      photoBlockElement.lastElementChild.photo = photos[i];
      photoBlockElement.lastElementChild.onclick = function () {
        renderBigImages(this.photo);
      };
    }
  }
  // Обработчик навжатия на кнопку закрыть
  document.querySelector('.big-picture__cancel').onclick = function () {
    closePopup();
  };
  document.querySelector('body').addEventListener('keyup', function (event) {
    if (window.utility.isEscEvent(event)) {
      closePopup();
    }
  });
  var lastTimeout;
  window.getData(function (photos) {
    /**
     *Добавляем в разметку блоки с фтографиями и описанием
     */
    renderPhotolist(photos);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');


    /** обработчик кнопки фильтра - "популярные"
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
