'use strict';

(function () {
  var DEFAULT_ADVERT_COUNT = 10;

  var adverts = [];
  var advertList = [];

  function AdvertElement(pin, card, advertData, advertDataList) {
    this.pin = pin;
    this.card = card;
    this.advert = advertData;
    this.advertList = advertDataList;
    this.rank = {
      typeRank: 0,
      priceRank: 0,
      roomsRank: 0,
      guestsRank: 0,
      featuresRank: 0,
    };

    window.card.open(this);
    window.card.close(this);
  }

  var getFirstFiveAdverts = function (pinList) {
    for (var i = 0; i < window.util.DEFAULT_PINS_NUMBER; i++) {
      window.map.mapPins.appendChild(pinList[i].pin);
      pinList[i].pin.classList.remove('hidden');
    }
  };

  var addListenersToPinsCards = function (advertData) {
    var pinsList = window.pin.render(advertData);
    var cardList = window.card.render(advertData);

    for (var i = 0; i < adverts.length; i++) {
      advertList[i] = new AdvertElement(pinsList.children[i], cardList.children[i], adverts[i], advertList);
    }
    getFirstFiveAdverts(advertList);
    return advertList;
  };

  window.data = {
    DEFAULT_ADVERT_COUNT: DEFAULT_ADVERT_COUNT,
    URL: 'https://js.dump.academy/keksobooking/data',
    loadHandler: function (data) {
      adverts = data.slice(0, DEFAULT_ADVERT_COUNT);
      window.data.adverts = adverts;
      advertList = addListenersToPinsCards(adverts);
      // window.filter.setMapFilters(advertList);
      window.data.advertList = advertList;
    },
    errorHandler: function () {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplate.cloneNode(true);
      var errorButton = errorElement.querySelector('.error__button');
      var fragment = document.createDocumentFragment();

      var onErrorButtonClick = function () {
        errorElement.classList.add('hidden');
        errorButton.removeEventListener('click', onErrorButtonClick);
      };

      var onErrorElementKeydown = function (evt) {
        if (evt.keyCode === window.util.ESC) {
          errorElement.classList.add('hidden');
          document.removeEventListener('keydown', onErrorElementKeydown);
        }
      };

      var onErrorElementClick = function () {
        errorElement.classList.add('hidden');
        document.removeEventListener('keydown', onErrorElementClick);
      };

      fragment.appendChild(errorElement);
      window.map.main.appendChild(fragment);

      errorButton.addEventListener('click', onErrorButtonClick);
      document.addEventListener('keydown', onErrorElementKeydown);
      document.addEventListener('click', onErrorElementClick);
    },
  };

})();
