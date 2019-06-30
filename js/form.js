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

  /**
   * отображаем форму при загрузке фото
   */
  document.querySelector('#upload-file').onchange = function () {
    uploadForm.classList.remove('hidden');
    sliderWidth = document.querySelector('.effect-level__line').offsetWidth;
  };

  /**
   * при нжатии ан ескапе скрывается форма
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
})();

