'use strict';
(function () {
  var template = document.querySelector('#picture');
  var photos = window.generatePhotoList();
  var photoBlockElement = document.querySelector('.pictures');

  /**
   *Добавляем в разметку блоки с фтографиями и описанием
   */
  for (var i = 0; i < photos.length; i++) {
    var node = document.importNode(template.content, true);
    node.querySelector('img').src = photos[i].url;
    node.querySelector('.picture__likes').textContent = photos[i].likes;
    node.querySelector('.picture__comments').textContent = photos[i].comments.length;
    photoBlockElement.appendChild(node);
  }
})();
