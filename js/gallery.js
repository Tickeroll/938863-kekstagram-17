'use strict';
(function () {
  var template = document.querySelector('#picture');
  var photoBlockElement = document.querySelector('.pictures');
  window.getData(function (photos) {
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
  });


})();
