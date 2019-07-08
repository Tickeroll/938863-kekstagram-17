'use strict';

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
var uploadForm = document.querySelector('.img-upload__overlay');
var formEscape = document.querySelector('#upload-cancel');
var scaleControlValue = document.querySelector('.scale__control--value');

/**
 * отображаем форму при загрузке фото
 */
document.querySelector('#upload-file').onchange = function () {
  uploadForm.classList.remove('hidden');
};

/**
 * при нжатии на ескапе скрывается форма
 * @param {Event} event
 */
document.getElementsByTagName('body')[0].onkeyup = function (event) {
  if (event.key === 'Escape') {
    uploadForm.classList.add('hidden');
  }
};

formEscape.onclick = function () {
  uploadForm.classList.add('hidden');
};

/**
 * уменьшает картинку при нажатии кнопки
 */
document.querySelector('.scale__control--smaller').onclick = function () {
  var percent = parseInt(scaleControlValue.value, 10);
  percent -= 25;
  if (percent > 0) {
    scaleControlValue.value = percent + '%';
    scaleControlValue.onchange();
  }
};

/**
 * Увеличивает картинку при нажатии кнопки
 */
document.querySelector('.scale__control--bigger').onclick = function () {
  var percent = parseInt(scaleControlValue.value, 10);
  percent += 25;
  if (percent < 100) {
    scaleControlValue.value = percent + '%';
    scaleControlValue.onchange();
  }
};

scaleControlValue.onchange = function () {
  document.querySelector('.img-upload__preview').style.transform = 'scale(0.' + parseInt(scaleControlValue.value, 10) + ')';
};

var effectChanges = document.querySelectorAll('.effects__radio');
var currentEffect = '';
var effectLevel = document.querySelector('.effect-level__value');
var effectPin = document.querySelector('.effect-level__pin');

/**
 * Добавление обработчиков при нажатии кнопки мышки
 */
for (var r = 0; r < effectChanges.length; r++) {
  effectChanges[r].onclick = function () {
    currentEffect = this.id;
    document.querySelector('.img-upload__preview img');
    switch (this.id) {
      case 'effect-none':
        document.querySelector('.img-upload__preview img').className = 'effects__preview--none';
        document.getElementsByClassName('img-upload__effect-level')[0].classList.add('hidden');
        break;
      case 'effect-chrome':
        document.querySelector('.img-upload__preview img').className = 'effects__preview--chrome';
        document.getElementsByClassName('img-upload__effect-level')[0].classList.remove('hidden');
        break;
      case 'effect-sepia':
        document.querySelector('.img-upload__preview img').className = 'effects__preview--sepia';
        document.getElementsByClassName('img-upload__effect-level')[0].classList.remove('hidden');
        break;
      case 'effect-marvin':
        document.querySelector('.img-upload__preview img').className = 'effects__preview--marvin';
        document.getElementsByClassName('img-upload__effect-level')[0].classList.remove('hidden');
        break;
      case 'effect-phobos':
        document.querySelector('.img-upload__preview img').className = 'effects__preview--phobos';
        document.getElementsByClassName('img-upload__effect-level')[0].classList.remove('hidden');
        break;
      case 'effect-heat':
        document.querySelector('.img-upload__preview img').className = 'effects__preview--heat';
        document.getElementsByClassName('img-upload__effect-level')[0].classList.remove('hidden');
        break;
    }
    effectPin.style.left = '100%';
    effectPin.onmouseup();
  };
}

var effectDepth = document.querySelector('.effect-level__depth');

/**
 * оброботка изменений позиции слайдера
 */

effectPin.onmousedown = function () {
  var sliderWidth = document.querySelector('.effect-level__line').offsetWidth;
  effectPin.onmousemove = function (event) {
    var pinMovement = effectPin.offsetLeft + event.movementX;
    if (pinMovement < 0 || pinMovement > sliderWidth) {
      return;
    }
    effectPin.style.left = pinMovement + 'px';
    effectDepth.style.width = pinMovement + 'px';

  };
  effectPin.onmouseup = function () {
    effectPin.onmousemove = null;
    effectLevel.value = parseInt(this.style.left, 10) / sliderWidth + '%';
    effectLevel.onchange();
  };
};
document.querySelector('body').addEventListener('mouseup', function () {
  effectPin.onmousemove = null;
  var sliderWidth = document.querySelector('.effect-level__line').offsetWidth;
  effectLevel.value = parseInt(effectPin.style.left, 10) / sliderWidth + '%';
  effectLevel.onchange();
});
/**
 * измнеения насыщенности фильтра
 */
effectLevel.onchange = function () {
  switch (currentEffect) {
    case 'effect-none':
      document.querySelector('.img-upload__preview').style.filter = '';
      break;
    case 'effect-chrome':
      document.querySelector('.img-upload__preview').style.filter = 'grayscale(' + (this.value / 100) + ')';
      break;
    case 'effect-sepia':
      document.querySelector('.img-upload__preview').style.filter = 'sepia(' + (this.value / 100) + ')';
      break;
    case 'effect-marvin':
      document.querySelector('.img-upload__preview').style.filter = 'invert(' + (this.value) + '%)';
      break;
    case 'effect-phobos':
      document.querySelector('.img-upload__preview').style.filter = 'blur(' + (this.value / 100 * 3) + 'px)';
      break;
    case 'effect-heat':
      document.querySelector('.img-upload__preview').style.filter = 'brightness(' + (this.value / 100 * 3) + ')';
      break;
  }
};

document.forms[1].elements['description'].onkeyup = function (event) {
  if (event.key === 'Escape') {
    event.stopPropagation();
  }
};
