'use strict';

(function () {
  var DEFAULT_ADVERT_COUNT = 8;

  var adverts = [];
  var advertList = [];

  // eslint-disable-next-line no-shadow
  function AdvertElement(pin, card, adverts) {
    this.pin = pin;
    this.card = card;
    this.advert = adverts;

    window.card.openCard(this);
    window.card.closeCard(this);
  }

  // eslint-disable-next-line no-shadow
  var addListenersToPinsCards = function (adverts) {
    var pinsList = window.pin.renderPins(adverts);
    var cardList = window.card.renderCards(adverts);

    for (var i = 0; i < adverts.length; i++) {
      advertList[i] = new AdvertElement(pinsList.children[i], cardList.children[i], adverts[i]);
    }
    window.filter.hidePins(advertList);
    window.filter.getFirstFiveAdverts(advertList);
    window.map.mapPins.appendChild(pinsList);
    window.map.mapOfAdvert.insertBefore(cardList, window.map.mapFiltersContainer);
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
