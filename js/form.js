'use strict';

(function () {
  var ROOMS_GUESTS_CONFIG = {
    '1': {
      val: ['1'],
      errMsg: '1 комната только для 1 гостя',
    },
    '2': {
      val: ['1', '2'],
      errMsg: '2 комнаты для 1 или 2 гостей',
    },
    '3': {
      val: ['1', '2', '3'],
      errMsg: '3 комнаты для 1, 2 или 3 гостей',
    },
    '100': {
      val: ['0'],
      errMsg: '100 комнат не для гостей',
    },
  };

  var PRICE_TYPE_CONFING = {
    'bungalo': {
      price: '0',
    },
    'flat': {
      price: '1000',
    },
    'house': {
      price: '5000',
    },
    'palace': {
      price: '10000',
    },
  };

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAdress = adForm.querySelector('#address');
  var selectRoomsElement = adForm.querySelector('#room_number');
  var selectGuestsElement = adForm.querySelector('#capacity');
  var selectTimein = adForm.querySelector('#timein');
  var selectTimeout = adForm.querySelector('#timeout');
  var selectType = adForm.querySelector('#type');
  var numberPrice = adForm.querySelector('#price');

  var disableAdFormElements = function () {
    adForm.classList.add('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].setAttribute('disabled', 'disabled');
    }
  };

  var getPriceByType = function () {
    var optionSelectType = selectType.value;

    if (PRICE_TYPE_CONFING.hasOwnProperty(optionSelectType)) {
      numberPrice.min = PRICE_TYPE_CONFING[optionSelectType].price;
      numberPrice.placeholder = PRICE_TYPE_CONFING[optionSelectType].price;
    }
  };

  var validateRoomsGuestsNumber = function () {
    var rooms = selectRoomsElement.value;
    var guests = selectGuestsElement.value;

    if ((ROOMS_GUESTS_CONFIG[rooms].val.indexOf(guests)) === -1) {
      selectRoomsElement.setCustomValidity(ROOMS_GUESTS_CONFIG[rooms].errMsg);
    } else {
      selectRoomsElement.setCustomValidity('');
    }
  };

  var synchronizeTimein = function () {
    var timein = selectTimein.value;

    selectTimeout.value = timein;
  };

  var synchronizeTimeout = function () {
    var timeout = selectTimeout.value;

    selectTimein.value = timeout;
  };

  selectType.addEventListener('change', getPriceByType);
  selectTimein.addEventListener('change', synchronizeTimein);
  selectTimeout.addEventListener('change', synchronizeTimeout);
  selectRoomsElement.addEventListener('change', validateRoomsGuestsNumber);
  selectGuestsElement.addEventListener('change', validateRoomsGuestsNumber);

  window.form = {
    adForm: adForm,
    adFormFieldsets: adFormFieldsets,
    adFormAdress: adFormAdress,
    disableAdFormElements: disableAdFormElements,
    getPriceByType: getPriceByType,
    validateRoomsGuestsNumber: validateRoomsGuestsNumber,
  };

})();
