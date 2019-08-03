'use strict';
(function () {
  var uploadForm = document.querySelector('.img-upload__overlay');
  var formEscape = document.querySelector('#upload-cancel');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var effectChanges = document.querySelectorAll('.effects__radio');
  var currentEffect = '';
  var currentEffectClass = '';
  var effectLevel = document.querySelector('.effect-level__value');
  var effectPin = document.querySelector('.effect-level__pin');
  var sliderWidth;
  var effectDepth = document.querySelector('.effect-level__depth');
  var form = document.querySelector('.img-upload__form');
  var previewImage = document.querySelector('.img-upload__preview');
  var publicationButton = document.querySelector('.img-upload__submit');
  var fileInput = document.querySelector('#upload-file');
  var imageInContainer = document.querySelector('.img-upload__preview img');
  function closePopup() {
    uploadForm.classList.add('hidden');
  }
  function showPopup() {
    uploadForm.classList.remove('hidden');
    publicationButton.removeAttribute('disabled');
    sliderWidth = document.querySelector('.effect-level__line').offsetWidth;
    for (var i = 0; i < effectChanges.length; i++) {
      if (effectChanges[i].checked) {
        currentEffect = effectChanges[i].id;
      }
    }
    changeFilterSaturation(effectLevel.value);
  }
  function formRestoreDefault() {
    document.querySelector('.text__description').value = '';
    hashtagsInput.value = '';
    fileInput.value = '';
    scaleControlValue.value = '100%';
    previewImage.style.transform = 'scale(1)';
  }

  function formUploadSuccessHandler() {
    var uploadImg = document.querySelector('.img-upload__preview').firstElementChild;
    window.gallery.addPhoto(uploadImg.src, uploadImg.style.scale, uploadImg.style.filter);
    uploadImg.style = '';
    uploadImg.classList = '';
    closePopup();
    window.utility.createMessage('success', 'Загрузка успешна', function () {
      formRestoreDefault();
    });
  }
  function formUploadErrorHandler() {
    closePopup();
    window.utility.createMessage('error', 'Ошибка загрузки', function (evt) {
      if (!(evt.type === 'click' && evt.target.classList.contains('error__button-again'))) {
        formRestoreDefault();
      }
    });
    document.querySelector('.error__button-again').onclick = function () {
      showPopup();
    };
  }

  // Отображение загружаемой в форму фотографии
  fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    var fReader = new FileReader();
    fReader.addEventListener('load', function () {
      imageInContainer.src = fReader.result;
    });
    fReader.readAsDataURL(file);
    scaleControlValue.value = '100%';
  });
  /**
   * отображаем форму при загрузке фото
   */
  document.querySelector('#upload-file').onchange = function () {
    showPopup();
  };

  form.addEventListener('submit', function (evt) {
    publicationButton.setAttribute('disabled', 'disabled');
    evt.preventDefault();
    window.ajax.upload(new FormData(form), formUploadSuccessHandler, formUploadErrorHandler);
  });

  /**
   * при нажатии на esc скрывается форма
   * @param {Event} evt
   */
  document.querySelector('body').addEventListener('keyup', function (evt) {
    if (evt.key === 'Escape') {
      uploadForm.classList.add('hidden');
      formRestoreDefault();
    }
  });

  formEscape.onclick = function () {
    uploadForm.classList.add('hidden');
    formRestoreDefault();
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
    if (percent <= 100) {
      scaleControlValue.value = percent + '%';
      scaleControlValue.onchange();
    }
  };

  scaleControlValue.onchange = function () {
    previewImage.style.transform = 'scale(' + parseInt(scaleControlValue.value, 10) / 100 + ')';
  };

  /**
   * Добавление обработчиков при нажатии кнопки мышки
   */
  for (var i = 0; i < effectChanges.length; i++) {
    effectChanges[i].onclick = function () {
      currentEffect = this.id;
      if (currentEffectClass > '') {
        previewImage.classList.remove(currentEffectClass);
      }
      switch (this.id) {
        case 'effect-none':
          currentEffectClass = 'effects__preview--none';
          document.querySelector('.img-upload__effect-level').classList.add('hidden');
          break;
        case 'effect-chrome':
          currentEffectClass = 'effects__preview--chrome';
          document.querySelector('.img-upload__effect-level').classList.remove('hidden');
          break;
        case 'effect-sepia':
          currentEffectClass = 'effects__preview--sepia';
          document.querySelector('.img-upload__effect-level').classList.remove('hidden');
          break;
        case 'effect-marvin':
          currentEffectClass = 'effects__preview--marvin';
          document.querySelector('.img-upload__effect-level').classList.remove('hidden');
          break;
        case 'effect-phobos':
          currentEffectClass = 'effects__preview--phobos';
          document.querySelector('.img-upload__effect-level').classList.remove('hidden');
          break;
        case 'effect-heat':
          currentEffectClass = 'effects__preview--heat';
          document.querySelector('.img-upload__effect-level').classList.remove('hidden');
          break;
      }
      previewImage.classList.add(currentEffectClass);
      effectPin.style.left = '100%';
      effectDepth.style.width = '100%';
      changeFilterSaturation(100);
    };
  }
  /**
   * оброботка изменений позиции слайдера
   */
  effectPin.onmousedown = function () {
    function mousemoveHandler(evt) {
      evt.preventDefault();
      var pinMovement = effectPin.offsetLeft + evt.movementX;
      if (pinMovement < 0 || pinMovement > sliderWidth) {
        return;
      }
      effectPin.style.left = pinMovement + 'px';
      effectDepth.style.width = pinMovement + 'px';
      effectLevel.value = Math.round(parseInt(effectPin.style.left, 10) / sliderWidth * 100);
      changeFilterSaturation(effectLevel.value);
    }
    function mouseupHandler(evt) {
      evt.preventDefault();
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    }
    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  };

  /**
   * измненения насыщенности фильтра
   * @param {number} effectPercent
   */
  function changeFilterSaturation(effectPercent) {
    effectPercent = effectPercent / 100;
    switch (currentEffect) {
      case 'effect-none':
        previewImage.style.filter = '';
        break;
      case 'effect-chrome':
        previewImage.style.filter = 'grayscale(' + (effectPercent) + ')';
        break;
      case 'effect-sepia':
        previewImage.style.filter = 'sepia(' + (effectPercent) + ')';
        break;
      case 'effect-marvin':
        previewImage.style.filter = 'invert(' + (effectPercent * 100) + '%)';
        break;
      case 'effect-phobos':
        previewImage.style.filter = 'blur(' + (effectPercent * 3) + 'px)';
        break;
      case 'effect-heat':
        previewImage.style.filter = 'brightness(' + (effectPercent * 2) + 1 + ')';
        break;
    }
  }
  document.forms[1].elements['description'].onkeyup = function (evt) {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  };
  // Валидация хештегов формы потравки фото
  var hashtagsInput = document.querySelector('.text__hashtags');
  function hashTagsInputHandler(evt) {
    var hashArr = hashtagsInput.value.trim().replace(/\s+/g, ' ').split(' ');
    var target = evt.target;
    if (makeHashtagValidation(hashArr, target)) {
      target.setCustomValidity(makeHashtagValidation(hashArr, target));
    } else {
      target.setCustomValidity('');
      target.removeAttribute('style');
    }
  }
  hashtagsInput.addEventListener('input', hashTagsInputHandler);
  function makeHashtagValidation(arr, target) {
    function outlineColorChanger(color) {
      target.style.outline = '1px solid' + color;
    }
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
  }

})();

