'use strict';

(function () {

  var DECIMAL_RADIX = 10;
  var LIMIT_TOP = 130;
  var LIMIT_BOTTOM = 630;
  var MAP_PIN_MAIN_HALFWIDTH = 33;
  var MAP_PIN_MAIN_HEIGHT = 65;
  var MAP_PIN_MAIN_HALFHEIGHT = 33;
  var MAP_PIN_MAIN_TIP_HEIGHT = 20;
  var SHIFT_LIMIT_RIGHT_PROPORTION = 2;
  var SHIFT_LIMIT_LEFT_PROPORTION = 1.5;

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
    window.form.adFormAdress.value = getPinAxisCoordinate(mapPinMain.style.left, MAP_PIN_MAIN_HALFWIDTH)
      + ', ' + getPinAxisCoordinate(mapPinMain.style.top, MAP_PIN_MAIN_HALFHEIGHT);

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
    window.form.adFormAdress.value = getPinAxisCoordinate(mapPinMain.style.left, MAP_PIN_MAIN_HALFWIDTH)
      + ', ' + getPinAxisCoordinate(mapPinMain.style.top, MAP_PIN_MAIN_HEIGHT + MAP_PIN_MAIN_TIP_HEIGHT);
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

    var limits = {
      top: LIMIT_TOP,
      right: mapPins.offsetWidth + mapPins.offsetLeft + (mapPinMain.offsetWidth / SHIFT_LIMIT_RIGHT_PROPORTION),
      bottom: LIMIT_BOTTOM,
      left: mapPins.offsetLeft + (SHIFT_LIMIT_LEFT_PROPORTION * mapPinMain.offsetWidth),
    };

    var shiftX = event.clientX - mapPinMain.getBoundingClientRect().left + mapPinMain.offsetWidth;
    var shiftY = event.clientY - mapPinMain.getBoundingClientRect().top;

    var newLocation = {
      x: limits.left,
      y: limits.top,
    };

    var dragged = false;

    var move = function (X, Y) {
      mapPinMain.style.top = Y - shiftY + 'px';
      mapPinMain.style.left = X - shiftX + 'px';
    };

    var onMouseMove = function (moveEvt) {
      dragged = true;

      if (moveEvt.pageX > limits.right) {
        newLocation.x = limits.right;
      } else if (moveEvt.pageX > limits.left) {
        newLocation.x = moveEvt.pageX;
      }

      if (moveEvt.pageY > limits.bottom) {
        newLocation.y = limits.bottom;
      } else if (moveEvt.pageY > limits.top) {
        newLocation.y = moveEvt.pageY;
      }

      if (dragged) {
        move(newLocation.x, newLocation.y);
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      dragged = false;

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
