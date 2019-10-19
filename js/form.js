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

  var FORM_DEFAULT_VALUES = {
    title: '',
    guestNumbers: 3,
    timein: '12:00',
    timeout: '12:00',
    price: '',
    type: 'flat',
    description: '',
  };

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAdress = adForm.querySelector('#address');
  var adFormTitleElement = adForm.querySelector('#title');
  var selectRoomsElement = adForm.querySelector('#room_number');
  var selectGuestsElement = adForm.querySelector('#capacity');
  var selectTimein = adForm.querySelector('#timein');
  var selectTimeout = adForm.querySelector('#timeout');
  var selectType = adForm.querySelector('#type');
  var numberPrice = adForm.querySelector('#price');
  var adFormDescriptionElement = adForm.querySelector('#description');
  var features = adForm.querySelector('.features');
  var adFormFeaturesElement = features.querySelectorAll('.feature__checkbox');

  var returnDefaultFormSettings = function () {
    adFormTitleElement.value = FORM_DEFAULT_VALUES.title;
    selectGuestsElement.value = FORM_DEFAULT_VALUES.guestNumbers;
    selectTimein.value = FORM_DEFAULT_VALUES.timein;
    selectTimeout.value = FORM_DEFAULT_VALUES.timeout;
    numberPrice.value = FORM_DEFAULT_VALUES.price;
    selectType.value = FORM_DEFAULT_VALUES.type;
    adFormDescriptionElement.value = FORM_DEFAULT_VALUES.description;

    for (var i = 0; i < adFormFeaturesElement.length; i++) {
      adFormFeaturesElement[i].checked = false;
    }
    getPriceByType();
  };

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


  var URL_SAVE = 'https://js.dump.academy/keksobooking';

  var getSuccessMessage = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(successElement);

    window.map.main.appendChild(fragment);

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ESC) {
        successElement.classList.add('hidden');
      }
    });

    document.addEventListener('click', function () {
      successElement.classList.add('hidden');
    });
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.save(function () {
      window.map.runInactiveState();
      window.map.removeCardPinElements();
      returnDefaultFormSettings();

      getSuccessMessage();
    }, window.data.errorHandler, URL_SAVE, new FormData(adForm));
    evt.preventDefault();
  });

  window.form = {
    adForm: adForm,
    adFormFieldsets: adFormFieldsets,
    adFormAdress: adFormAdress,
    disableAdFormElements: disableAdFormElements,
    getPriceByType: getPriceByType,
    validateRoomsGuestsNumber: validateRoomsGuestsNumber,
  };

})();
