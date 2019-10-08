'use strict';

(function () {

  var DECIMAL_RADIX = 10;
  var MAP_PIN_MAIN_HALFWIDTH = 33;
  var MAP_PIN_MAIN_HEIGHT = 65;
  var MAP_PIN_MAIN_HALFHEIGHT = 33;
  var MAP_PIN_MAIN_TIP_HEIGHT = 20;

  var advertList = [];
  var mapOfAdvert = document.querySelector('.map');
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapPins = document.querySelector('.map__pins');
  var mapPinsHeight = mapPins.scrollHeight;
  var mapPinsWidth = mapPins.scrollWidth;
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

  var getMaxMinAxisCoordinate = function (pinElementCoordinate, pinElementNumber) {
    switch (pinElementCoordinate) {
      case 'mapPinMain.style.left': {
        if (pinElementNumber <= 0) {
          pinElementNumber = 0;
        }
        if (pinElementNumber > mapPinsWidth) {
          pinElementNumber = mapPinsWidth;
        }
        break;
      }
      case 'mapPinMain.style.top': {
        if (pinElementNumber <= 0) {
          pinElementNumber = 0;
        }
        if (pinElementNumber > mapPinsHeight) {
          pinElementNumber = mapPinsHeight;
        }
        break;
      }
    }
    return pinElementNumber;
  };

  var getPinAxisCoordinate = function (pinElementCoordinate, distanceToPinTip) {
    var pinElement = pinElementCoordinate;
    var pxIndex = pinElement.indexOf('px');
    var pinElementNumber = pinElement.slice(0, pxIndex);
    var pinElementNumberInRange = getMaxMinAxisCoordinate(pinElementCoordinate, pinElementNumber);
    var pinAxisCoordinate = parseInt(pinElementNumberInRange, DECIMAL_RADIX) + distanceToPinTip;
    return pinAxisCoordinate;
  };

  var getPinMainAdress = function () {
    window.form.adFormAdress.value = getPinAxisCoordinate(mapPinMain.style.left, MAP_PIN_MAIN_HALFWIDTH)
      + ', ' + getPinAxisCoordinate(mapPinMain.style.top, MAP_PIN_MAIN_HEIGHT + MAP_PIN_MAIN_TIP_HEIGHT);
    return window.form.dFormAdress.value;
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

  mapPinMain.addEventListener('mousedown', function () {
    runActiveState();
    getPinMainAdress();
  });

})();
