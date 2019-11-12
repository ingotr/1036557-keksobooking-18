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
  var adFormTitle = adForm.querySelector('#title');
  var selectRooms = adForm.querySelector('#room_number');
  var selectGuests = adForm.querySelector('#capacity');
  var selectTimein = adForm.querySelector('#timein');
  var selectTimeout = adForm.querySelector('#timeout');
  var selectType = adForm.querySelector('#type');
  var numberPrice = adForm.querySelector('#price');
  var adFormDescription = adForm.querySelector('#description');
  var features = adForm.querySelector('.features');
  var adFormFeatures = features.querySelectorAll('.feature__checkbox');

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successWindow = successTemplate.cloneNode(true);

  var returnDefaultFormSettings = function () {
    adFormTitle.value = FORM_DEFAULT_VALUES.title;
    selectGuests.value = FORM_DEFAULT_VALUES.guestNumbers;
    selectTimein.value = FORM_DEFAULT_VALUES.timein;
    selectTimeout.value = FORM_DEFAULT_VALUES.timeout;
    numberPrice.value = FORM_DEFAULT_VALUES.price;
    selectType.value = FORM_DEFAULT_VALUES.type;
    adFormDescription.value = FORM_DEFAULT_VALUES.description;

    for (var i = 0; i < adFormFeatures.length; i++) {
      adFormFeatures[i].checked = false;
    }
    getPriceByType();

    selectType.removeEventListener('change', getPriceByType);
    selectTimein.removeEventListener('change', synchronizeTimein);
    selectTimeout.removeEventListener('change', synchronizeTimeout);
    selectRooms.removeEventListener('change', validateRoomsGuestsNumber);
    selectGuests.removeEventListener('change', validateRoomsGuestsNumber);
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onSuccessWindowClick);
    adForm.removeEventListener('submit', onFormSubmit);
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
    var rooms = selectRooms.value;
    var guests = selectGuests.value;

    if ((ROOMS_GUESTS_CONFIG[rooms].val.indexOf(guests)) === -1) {
      selectRooms.setCustomValidity(ROOMS_GUESTS_CONFIG[rooms].errMsg);
    } else {
      selectRooms.setCustomValidity('');
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
  selectRooms.addEventListener('change', validateRoomsGuestsNumber);
  selectGuests.addEventListener('change', validateRoomsGuestsNumber);


  var URL_SAVE = 'https://js.dump.academy/keksobooking';

  var onEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC) {
      successWindow.classList.add('hidden');
    }
  };

  var onSuccessWindowClick = function () {
    successWindow.classList.add('hidden');
  };

  var getSuccessMessage = function () {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(successWindow);

    window.map.main.appendChild(fragment);

    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onSuccessWindowClick);
  };

  var onFormSubmit = function (evt) {
    window.backend.save(function () {
      window.map.runInactiveState();
      window.map.removeCardPinElements();
      returnDefaultFormSettings();

      getSuccessMessage();
    }, window.data.errorHandler, URL_SAVE, new FormData(adForm));
    evt.preventDefault();
  };

  adForm.addEventListener('submit', onFormSubmit);

  window.form = {
    adForm: adForm,
    adFormFieldsets: adFormFieldsets,
    adFormAdress: adFormAdress,
    disableAdFormElements: disableAdFormElements,
    getPriceByType: getPriceByType,
    validateRoomsGuestsNumber: validateRoomsGuestsNumber,
  };

})();
