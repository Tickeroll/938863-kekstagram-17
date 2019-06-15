'use strict';
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function generatePhotoList() {
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
  for (var i = 1; i < 26; i++) {
    var photoComments = [];
    for (var j = 0; j <= getRandomInt(1, 3); j++) {
      photoComments.push({
        avatar: 'img/avatar-{{avatarID}}.svg'.replace('{{avatarID}}', getRandomInt(1, 6)),
        message: userComments[getRandomInt(0, userComments.length)],
        name: userNames[getRandomInt(0, userNames.length)]
      });
    }
    resultout.push({
      url: 'photos/{{i}}.jpg'.replace('{{i}}', i),
      likes: getRandomInt(15, 200),
      comments: photoComments,
    });
  }
  return resultout;
}
var template = document.querySelector('#picture');
var photos = generatePhotoList();
var photoBlockElement = document.querySelector('.pictures');
for (var i = 0; i < photos.length; i++) {
  var node = document.importNode(template.content, true);
  node.querySelector('img').src = photos[i].url;
  node.querySelector('.picture__likes').textContent = photos[i].likes;
  node.querySelector('.picture__comments').textContent = photos[i].comments.length;
  photoBlockElement.appendChild(node);
}
