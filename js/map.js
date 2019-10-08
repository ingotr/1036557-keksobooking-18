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
  var mapPinsHeight = 630;
  // var mapPinsHeight = mapPins.scrollHeight;
  var mapPinsWidth = 1170;
  // var mapPinsWidth = mapPins.scrollWidth;
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

  var getMaxMinAxisCoordinate = function (pinCoordinateName, pinElementNumber) {
    switch (pinCoordinateName) {
      case 'left': {
        if (pinElementNumber < 30) {
          pinElementNumber = 30;
        }
        if (pinElementNumber > 1130) {
          pinElementNumber = 1130;
        }
        break;
      }
      case 'top': {
        if (pinElementNumber < 130) {
          pinElementNumber = 130;
        }
        if (pinElementNumber > 630) {
          pinElementNumber = 630;
        }
        break;
      }
    }
    return pinElementNumber;
  };

  var getPinAxisCoordinate = function (pinElementCoordinate, distanceToPinTip, pinCoordinateName) {
    var pinElement = pinElementCoordinate;
    var pxIndex = pinElement.indexOf('px');
    var pinElementNumber = parseInt(pinElement.slice(0, pxIndex), DECIMAL_RADIX);
    var pinElementNumberInRange = getMaxMinAxisCoordinate(pinCoordinateName, pinElementNumber);
    var pinAxisCoordinate = parseInt(pinElementNumberInRange, DECIMAL_RADIX) + distanceToPinTip;
    return pinAxisCoordinate;
  };

  var getPinMainAdress = function () {
    window.form.adFormAdress.value = getPinAxisCoordinate(mapPinMain.style.left, MAP_PIN_MAIN_HALFWIDTH, 'left')
      + ', ' + getPinAxisCoordinate(mapPinMain.style.top, MAP_PIN_MAIN_HEIGHT + MAP_PIN_MAIN_TIP_HEIGHT, 'top');
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

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
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
