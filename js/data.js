'use strict';
window.generatePhotoList = (function () {
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
   * Генерирует массив лданных содержащих фотографии с данными пользователей
   * @return {Array}
   */
  return function () {
    var resultout = [];
    var userNames = [
      'Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'
    ];
    var userComments = [
      'Всё отлично!',
      'В целом всё неплохо. Но не всё.',
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
    ];
    var PHOTO_NUMBER = 26;
    var MIN_COMMENT_NUMBER = 1;
    var MAX_COMMENT_NUMBER = 3;
    var MAX_AVATAR_NUMBER = 6;
    var MIN_AVATAR_NUMBER = 1;
    var MAX_LIKE_NUMBER = 200;
    var MIN_LIKE_NUMBER = 15;
    for (var i = 1; i < PHOTO_NUMBER; i++) {
      var photoComments = [];
      for (var j = 0; j <= getRandomInt(MIN_COMMENT_NUMBER, MAX_COMMENT_NUMBER); j++) {
        photoComments.push({
          avatar: 'img/avatar-{{avatarID}}.svg'.replace('{{avatarID}}', getRandomInt(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER)),
          message: userComments[getRandomInt(0, userComments.length)],
          name: userNames[getRandomInt(0, userNames.length)]
        });
      }
      resultout.push({
        url: 'photos/{{i}}.jpg'.replace('{{i}}', i),
        likes: getRandomInt(MIN_LIKE_NUMBER, MAX_LIKE_NUMBER),
        comments: photoComments,
      });
    }
    return resultout;
  };
})();
