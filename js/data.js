'use strict';

(function () {
  var DEFAULT_ADVERT_COUNT = 8;

  var adverts = [];
  var advertList = [];

  function AdvertElement(pin, card, advertData, advertDataList) {
    this.pin = pin;
    this.card = card;
    this.advert = advertData;
    this.advertList = advertDataList;

    window.card.openCard(this);
    window.card.closeCard(this);
  }

  var getFirstFiveAdverts = function (pinList) {
    for (var i = 0; i < window.util.DEFAULT_PINS_NUMBER; i++) {
      window.map.mapPins.appendChild(pinList[i].pin);
      pinList[i].pin.classList.remove('hidden');
      window.map.mapOfAdvert.insertBefore(pinList[i].card, window.map.mapFiltersContainer);
    }
  };

  var addListenersToPinsCards = function (advertData) {
    var pinsList = window.pin.renderPins(advertData);
    var cardList = window.card.renderCards(advertData);

    for (var i = 0; i < adverts.length; i++) {
      advertList[i] = new AdvertElement(pinsList.children[i], cardList.children[i], adverts[i], advertList);
    }
    getFirstFiveAdverts(advertList);
    return advertList;
  };

  window.data = {
    DEFAULT_ADVERT_COUNT: DEFAULT_ADVERT_COUNT,
    URL: 'https://js.dump.academy/keksobooking/data',
    adverts: [],
    loadHandler: function (data) {
      adverts = data.slice(0, DEFAULT_ADVERT_COUNT);
      advertList = addListenersToPinsCards(adverts);
      window.filter.getMapFilters(advertList);
    },
    errorHandler: function () {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplate.cloneNode(true);
      var fragment = document.createDocumentFragment();

      fragment.appendChild(errorElement);

      window.map.main.appendChild(fragment);

      var errorButton = document.querySelector('.error__button');
      errorButton.addEventListener('click', function () {
        errorElement.classList.add('hidden');
      });

      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.util.ESC) {
          errorElement.classList.add('hidden');
        }
      });

      document.addEventListener('click', function () {
        errorElement.classList.add('hidden');
      });
    },
  };

})();
