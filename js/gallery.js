'use strict';

(function () {
  var COMMENT_NUMBER = 5;
  var RANDOM_PHOTO_AMOUNT = 10;

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
   * отрисовывает загружаемую фотогарфию
   * @param {string} photoPath
   * @param {string} scale
   * @param {string} filter
   */
  function addPhoto(photoPath, scale, filter) {
    var template = document.querySelector('#picture');
    var photoBlockElement = document.querySelector('.pictures');
    var node = document.importNode(template.content, true);
    node.querySelector('img').src = photoPath;
    node.querySelector('img').style.scale = scale;
    node.querySelector('img').style.filter = filter;
    photoBlockElement.appendChild(node);
    photoBlockElement.lastElementChild.photo = {
      url: photoPath,
      likes: 0,
      comments: [],
    };
    photoBlockElement.lastElementChild.onclick = function () {
      renderBigImages(this.photo);
    };
  }

  function closePopup() {
    document.querySelector('.big-picture').classList.add('hidden');
    document.querySelector('.likes-count').classList.remove('likes-count--active');
  }

  function renderComments(comments, offset, amount) {
    var newComment = document.querySelector('.social__comments');
    var templateComment = document.querySelector('#comment');
    for (var i = offset; i < comments.length && i < offset + amount; i++) {
      var oneComment = document.importNode(templateComment.content, true);
      oneComment.querySelector('img').src = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
      oneComment.querySelector('.social__text').textContent = comments[i].message;
      newComment.appendChild(oneComment);
    }
    return Math.min(amount, comments.length - offset);
  }

  /**
   * Функция рендера больших картинок
   * @param {object} photo
   */
  function renderBigImages(photo) {
    var commentsLoader = document.querySelector('.social__comments-loader');
    var commentTextElement = document.querySelector('.social__footer-text');
    document.querySelector('.big-picture').classList.remove('hidden');
    document.querySelector('.big-picture__img img').src = photo.url;
    document.querySelector('.likes-count').textContent = photo.likes;
    document.querySelector('.social__caption').textContent = photo.description;
    if (photo.comments.length === 0) {
      commentsLoader.classList.add('visually-hidden');
    } else {
      commentsLoader.classList.remove('visually-hidden');
    }

    // Удаление предыдущих комментариев
    var oldComments = document.querySelectorAll('.social__comments .social__comment');
    for (var i = 0; i < oldComments.length; i++) {
      oldComments[i].parentNode.removeChild(oldComments[i]);
    }

    // отрисовка комментариев
    var visibleCommentsNumber = renderComments(photo.comments, 0, COMMENT_NUMBER);
    document.querySelector('.social__comment-count').textContent = visibleCommentsNumber + ' из ' + photo.comments.length;
    var clickCounter = 1;
    commentsLoader.onclick = function () {
      visibleCommentsNumber += renderComments(photo.comments, clickCounter * COMMENT_NUMBER, COMMENT_NUMBER);
      document.querySelector('.social__comment-count').textContent = visibleCommentsNumber + ' из ' + photo.comments.length;
      clickCounter++;
      if (visibleCommentsNumber === photo.comments.length) {
        commentsLoader.classList.add('visually-hidden');
      }
    };

    document.querySelector('.social__footer-btn').onclick = commentTextElement.onkeyup = function (evt) {
      if (window.utility.isClickEvent(evt) || window.utility.isEnterKeyEvent(evt)) {
        photo.comments.push({
          message: commentTextElement.value
        });
        commentTextElement.value = '';
        if (visibleCommentsNumber % COMMENT_NUMBER !== 0 || visibleCommentsNumber === 0 || commentsLoader.classList.contains('visually-hidden')) {
          visibleCommentsNumber += renderComments(photo.comments, photo.comments.length - 1, 1);
        }
        document.querySelector('.social__comment-count').textContent = visibleCommentsNumber + ' из ' + photo.comments.length;
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
    for (var j = 0; j < photos.length; j++) {
      var node = document.importNode(template.content, true);
      node.querySelector('img').src = photos[j].url;
      node.querySelector('.picture__likes').textContent = photos[j].likes;
      node.querySelector('.picture__comments').textContent = photos[j].comments.length;
      photoBlockElement.appendChild(node);
      photoBlockElement.lastElementChild.photo = photos[j];
      photoBlockElement.lastElementChild.onclick = function () {
        renderBigImages(this.photo);
      };
    }
  }

  // Обработчик навжатия на кнопку закрыть
  document.querySelector('.big-picture__cancel').onclick = function () {
    closePopup();
  };
  document.querySelector('body').addEventListener('keyup', function (evt) {
    if (window.utility.isEscEvent(evt)) {
      closePopup();
    }
  });

  // Добавление лайка к фото
  document.querySelector('.likes-count').onclick = function () {
    if (!this.classList.contains('likes-count--active')) {
      document.querySelector('.likes-count').classList.add('likes-count--active');
      document.querySelector('.likes-count--active').textContent = parseInt(document.querySelector('.likes-count--active').textContent, 10) + 1;
    }
  };

  var lastTimeout;
  window.ajax.getData(function (photos) {
    /**
     *Добавляем в разметку блоки с фтографиями и описанием
     */
    renderPhotolist(photos);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');


    /** обработчик кнопки фильтра - "популярные"
     */
    document.querySelector('#filter-popular').addEventListener('click', function (evt) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        renderPhotolist(photos);
      }, 500);
      document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
      evt.target.classList.add('img-filters__button--active');
    });

    /**
     * обработчик кнопки фильтра - "новые"
     */
    document.querySelector('#filter-new').addEventListener('click', function (evt) {
      var randomPhotos = [];
      var index = [];
      for (var i = 0; i < RANDOM_PHOTO_AMOUNT; i++) {
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
      evt.target.classList.add('img-filters__button--active');
    });
    /**
     * обработчик кнопки фильтра - "обсуждаемые"
     */
    document.querySelector('#filter-discussed').addEventListener('click', function (evt) {
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
      evt.target.classList.add('img-filters__button--active');
    });
  });
  window.gallery = {
    addPhoto: addPhoto
  };
})();
