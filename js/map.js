'use strict';

(function () {

  var DECIMAL_RADIX = 10;
  var MAIN_PIN_LIMIT_TOP = 130;
  var MAIN_PIN_LIMIT_BOTTOM = 630;
  var MAIN_PIN_TIP_HEIGHT = 20;

  var advertList = [];
  var mapOfAdvert = document.querySelector('.map');
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');

  var isReceivedData = false;

  function AdvertElement(pin, card) {
    this.pin = pin;
    this.card = card;

    window.card.openCard(this);
    window.card.closeCard(this);
  }

  var disableMapFilters = function () {
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
    var pinElementNumber = parseInt(pinElement.slice(0, pxIndex), DECIMAL_RADIX);
    var pinAxisCoordinate = parseInt(pinElementNumber, DECIMAL_RADIX) + distanceToPinTip;
    return pinAxisCoordinate;
  };

  var getPinMainAdress = function () {
    window.form.adFormAdress.value = Math.round(getPinAxisCoordinate(mapPinMain.style.left, mapPinMain.offsetWidth / 2))
      + ', ' + Math.round(getPinAxisCoordinate(mapPinMain.style.top, mapPinMain.offsetHeight + MAIN_PIN_TIP_HEIGHT));
    return window.form.adFormAdress.value;
  };

  var addListenersToPinsCards = function () {
    var pinsList = window.pin.renderPins();
    var cardList = window.card.renderCards();

    for (var i = 0; i < window.data.adverts.length; i++) {
      advertList[i] = new AdvertElement(pinsList.children[i], cardList.children[i]);
    }

    mapPins.appendChild(pinsList);
    mapOfAdvert.insertBefore(cardList, mapFiltersContainer);
  };

  var runInactiveState = function () {
    mapPinMain.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ENTER) {
        runActiveState();
        getPinMainAdress();
      }
    });
    window.form.disableAdFormElements();
    disableMapFilters();
    getPinMainAdressInactive();
    window.form.getPriceByType();
    window.form.validateRoomsGuestsNumber();
  };

  var runActiveState = function () {
    for (var i = 0; i < window.form.adFormFieldsets.length; i++) {
      window.form.adFormFieldsets[i].removeAttribute('disabled');
    }

    window.form.adForm.classList.remove('ad-form--disabled');
    mapFilters.removeAttribute('disabled');

    if (!isReceivedData) {
      window.data.renderMockData();

      addListenersToPinsCards();
      isReceivedData = true;
    }

    showMap();
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

})();
