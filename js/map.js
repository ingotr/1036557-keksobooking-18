'use strict';

(function () {
  var MAIN_PIN_DEFAULT_LEFT = 603;
  var MAIN_PIN_DEFAULT_TOP = 408;
  var MAIN_PIN_LIMIT_TOP = 130;
  var MAIN_PIN_LIMIT_BOTTOM = 630;
  var MAIN_PIN_TIP_HEIGHT = 20;

  var mapOfAdvert = document.querySelector('.map');
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var main = mapOfAdvert.parentNode;
  var typeFilter = mapFiltersContainer.querySelector('#housing-type');
  var priceFilter = mapFiltersContainer.querySelector('#housing-price');
  var roomsFilter = mapFiltersContainer.querySelector('#housing-rooms');
  var guestsFilter = mapFiltersContainer.querySelector('#housing-guests');
  var featuresFilter = mapFiltersContainer.querySelector('#housing-features');

  var isReceivedData = false;

  var disableMapFilters = function () {
    mapOfAdvert.classList.add('map--faded');
    mapFilters.setAttribute('disabled', 'disabled');
  };

  var showMap = function () {
    mapOfAdvert.classList.remove('map--faded');
  };

  var getPinMainAdressInactive = function () {
    window.form.adFormAdress.value = Math.round(getPinAxisCoordinate(mapPinMain.style.left, mapPinMain.offsetWidth / 2))
      + ', ' + Math.round(getPinAxisCoordinate(mapPinMain.style.top, mapPinMain.offsetHeight / 2));

    return window.form.adFormAdress.value;
  };

  var getPinAxisCoordinate = function (pinElementCoordinate, distanceToPinTip) {
    var pinElement = pinElementCoordinate;
    var pxIndex = pinElement.indexOf('px');
    var pinElementNumber = parseInt(pinElement.slice(0, pxIndex), window.util.DECIMAL_RADIX);
    var pinAxisCoordinate = parseInt(pinElementNumber, window.util.DECIMAL_RADIX) + distanceToPinTip;
    return pinAxisCoordinate;
  };

  var getPinMainAdress = function () {
    window.form.adFormAdress.value = Math.round(getPinAxisCoordinate(mapPinMain.style.left, mapPinMain.offsetWidth / 2))
      + ', ' + Math.round(getPinAxisCoordinate(mapPinMain.style.top, mapPinMain.offsetHeight + MAIN_PIN_TIP_HEIGHT));
    return window.form.adFormAdress.value;
  };

  var getPinMainDefaultAdress = function () {
    mapPinMain.style.top = MAIN_PIN_DEFAULT_TOP - (mapPinMain.offsetWidth / 2) + 'px';
    mapPinMain.style.left = MAIN_PIN_DEFAULT_LEFT - (mapPinMain.offsetWidth / 2) + 'px';
  };

  var onEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENTER) {
      runActiveState();
      getPinMainAdress();
    }
  };

  var runActiveState = function () {
    for (var i = 0; i < window.form.adFormFieldsets.length; i++) {
      window.form.adFormFieldsets[i].removeAttribute('disabled');
    }

    window.form.adForm.classList.remove('ad-form--disabled');
    mapFilters.removeAttribute('disabled');

    if (!isReceivedData) {
      window.backend.load(window.data.loadHandler, window.data.errorHandler, window.data.URL);
      isReceivedData = true;
      window.filter.setMapFilters(window.data.advertList);
    }
    showMap();
    mapPinMain.removeEventListener('keydown', onEnterPress);
  };

  var runInactiveState = function () {
    isReceivedData = false;
    mapPinMain.addEventListener('keydown', onEnterPress);

    window.form.disableAdFormElements();
    disableMapFilters();
    getPinMainDefaultAdress();
    getPinMainAdressInactive();
    window.form.getPriceByType();
    window.form.validateRoomsGuestsNumber();
  };

  runInactiveState();

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startPinCoords = {
      x: mapPinMain.offsetLeft,
      y: mapPinMain.offsetTop,
    };

    var startMouseCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var getPinXCoord = function (x) {
      var min = mapPins.offsetLeft - mapPinMain.offsetWidth / 2;
      var max = mapPins.offsetLeft + mapPins.offsetWidth - mapPinMain.offsetWidth / 2;

      if (x < min) {
        return min;
      }
      if (x > max) {
        return max;
      }
      return x;
    };

    var getPinYCoord = function (y) {
      var min = mapPins.offsetTop + MAIN_PIN_LIMIT_TOP - mapPinMain.offsetHeight - MAIN_PIN_TIP_HEIGHT;
      var max = mapPins.offsetTop + MAIN_PIN_LIMIT_BOTTOM - mapPinMain.offsetHeight - MAIN_PIN_TIP_HEIGHT;

      if (y < min) {
        return min;
      }
      if (y > max) {
        return max;
      }
      return y;
    };

    var onMouseMove = function (moveEvt) {
      var shift = {
        x: startMouseCoords.x - moveEvt.clientX,
        y: startMouseCoords.y - moveEvt.clientY,
      };

      startPinCoords = {
        x: startPinCoords.x - shift.x,
        y: startPinCoords.y - shift.y,
      };

      startMouseCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      mapPinMain.style.top = getPinYCoord(startPinCoords.y) + 'px';
      mapPinMain.style.left = getPinXCoord(startPinCoords.x) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      getPinMainAdress();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    runActiveState();
    getPinMainAdress();
  });

  window.map = {
    main: main,
    mapOfAdvert: mapOfAdvert,
    mapPins: mapPins,
    mapFiltersContainer: mapFiltersContainer,
    runInactiveState: runInactiveState,
    typeFilter: typeFilter,
    priceFilter: priceFilter,
    roomsFilter: roomsFilter,
    guestsFilter: guestsFilter,
    featuresFilter: featuresFilter,
    removeCardPinElements: function () {
      var cardElement = mapOfAdvert.querySelectorAll('.map__card');
      var pinElement = mapPins.querySelectorAll('button[type=button]');
      for (var i = 0; i < cardElement.length; i++) {
        mapOfAdvert.removeChild(cardElement[i]);
      }
      for (i = 0; i < pinElement.length; i++) {
        mapPins.removeChild(pinElement[i]);
      }
    },
  };

})();
