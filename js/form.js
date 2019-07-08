'use strict';
(function () {
  var uploadForm = document.querySelector('.img-upload__overlay');
  var formEscape = document.querySelector('#upload-cancel');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var effectChanges = document.querySelectorAll('.effects__radio');
  var currentEffect = '';
  var effectLevel = document.querySelector('.effect-level__value');
  var effectPin = document.querySelector('.effect-level__pin');
  var sliderWidth;
  var effectDepth = document.querySelector('.effect-level__depth');
  var form = document.querySelector('.img-upload__form');
  var closePopup = function () {
    uploadForm.classList.add('hidden');
    formRestoreDefault();
  };

  var formRestoreDefault = function () {
    var file = document.querySelector('#upload-file');
    file.value = '';
    document.querySelector('.text__description').value = '';
    hashtagsInput.value = '';
  };


  var formUploadSuccessHandler = function () {
    var uploadImg = document.querySelector('.img-upload__preview').firstElementChild;
    uploadImg.style = '';
    uploadImg.classList = '';
    closePopup();
    formRestoreDefault();
    window.utility.createMessage('success', 'Загрузка успешна');
  };

  var formUploadErrorHandler = function () {
    closePopup();
    window.utility.createMessage('error', 'Ошибка загрузки');
  };

  // Отображение загружаемой в форму фотографии
  var fileInput = document.querySelector('#upload-file');
  fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    var fReader = new FileReader();
    fReader.addEventListener('load', function () {
      document.querySelector('.img-upload__preview').firstElementChild.src = fReader.result;
    });
    fReader.readAsDataURL(file);
  });
  /**
   * отображаем форму при загрузке фото
   */
  document.querySelector('#upload-file').onchange = function () {
    uploadForm.classList.remove('hidden');
    sliderWidth = document.querySelector('.effect-level__line').offsetWidth;
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.upload(new FormData(form), formUploadSuccessHandler, formUploadErrorHandler);
  });

  /**
   * при нжатии ан ескапе скрывается форма
   * @param {Event} event
   */
  document.querySelector('body').addEventListener('keyup', function (event) {
    if (event.key === 'Escape') {
      uploadForm.classList.add('hidden');
    }
  });

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

  effectPin.onmouseup = function () {
    effectPin.onmousemove = null;
    effectLevel.value = parseInt(this.style.left, 10) / sliderWidth;
    effectLevel.onchange();
  };

  /**
   * Добавление обработчиков при нажатии кнопки мышки
   */
  for (var i = 0; i < effectChanges.length; i++) {
    effectChanges[i].onclick = function () {
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
      effectDepth.style.width = '100%';
      effectPin.onmouseup();
    };
  }
  /**
   * оброботка изменений позиции слайдера
   */

  effectPin.onmousedown = function () {
    effectPin.onmousemove = function (event) {
      var pinMovement = effectPin.offsetLeft + event.movementX;
      if (pinMovement < 0 || pinMovement > sliderWidth) {
        return;
      }
      effectPin.style.left = pinMovement + 'px';
      effectDepth.style.width = pinMovement + 'px';

    };
  };
  document.querySelector('body').addEventListener('mouseup', function () {
    effectPin.onmousemove = null;
    effectLevel.value = parseInt(effectPin.style.left, 10) / sliderWidth;
  });
  /**
   * измнеения насыщенности фильтра
   */
  effectLevel.onchange = function () {
    switch (currentEffect) {
      case 'effect-none':
        document.querySelector('.img-upload__preview img').style.filter = '';
        break;
      case 'effect-chrome':
        document.querySelector('.img-upload__preview img').style.filter = 'grayscale(' + (this.value) + ')';
        break;
      case 'effect-sepia':
        document.querySelector('.img-upload__preview img').style.filter = 'sepia(' + (this.value) + ')';
        break;
      case 'effect-marvin':
        document.querySelector('.img-upload__preview img').style.filter = 'invert(' + (this.value) + '%)';
        break;
      case 'effect-phobos':
        document.querySelector('.img-upload__preview img').style.filter = 'blur(' + (this.value * 3) + 'px)';
        break;
      case 'effect-heat':
        document.querySelector('.img-upload__preview img').style.filter = 'brightness(' + (this.value * 3) + ')';
        break;
    }
  };
  document.forms[1].elements['description'].onkeyup = function (event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
    }
  };
  // Валидация хештегов формы потравки фото
  var hashtagsInput = document.querySelector('.text__hashtags');
  var hashTagsInputHandler = function (evt) {
    var hashArr = hashtagsInput.value.trim().replace(/\s+/g, ' ').split(' ');
    var target = evt.target;
    if (makeHashtagValidation(hashArr, target)) {
      target.setCustomValidity(makeHashtagValidation(hashArr, target));
    } else {
      target.setCustomValidity('');
      target.removeAttribute('style');
    }
  };
  hashtagsInput.addEventListener('input', hashTagsInputHandler);
  var makeHashtagValidation = function (arr, target) {
    var outlineColorChanger = function (color) {
      target.style.outline = '1px solid' + color;
    };
    var hashtagMaxLength = 20;
    var hashtagMaxCount = 5;
    var hashtagColor = '#f45f42';
    var validityMessage;
    arr.forEach(function (elem, k) {
      if (elem[0] !== '#' && elem !== '') {
        outlineColorChanger(hashtagColor);
        validityMessage = 'Хеш тег должен начинаться символом #';
      } else if (elem.length > hashtagMaxLength) {
        outlineColorChanger(hashtagColor);
        validityMessage = 'Длина хеш тега не должна превышать ' + hashtagMaxLength + ' ';
      } else if (arr.length > hashtagMaxCount) {
        outlineColorChanger(hashtagColor);
        validityMessage = 'Хеш тегов не может быть больше ' + hashtagMaxCount;
      } else if (elem === '#' && elem.length < 2) {
        outlineColorChanger(hashtagColor);
        validityMessage = 'Хеш тег не может состоять из одной решётки';
      }
      for (var j = k + 1; j < arr.length; j++) {
        if (elem.toUpperCase() === arr[j].toUpperCase()) {
          outlineColorChanger(hashtagColor);
          validityMessage = 'Один и тот же хеш-тег не может быть использован дважды';
        }
      }
    });
    return validityMessage;
  };

})();

