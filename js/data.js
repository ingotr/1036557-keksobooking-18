'use strict';

(function () {
  var DEFAULT_ADVERT_COUNT = 8;

  var adverts = [];
  var advertList = [];

  function AdvertElement(pin, card) {
    this.pin = pin;
    this.card = card;

    window.card.openCard(this);
    window.card.closeCard(this);
  }

  // eslint-disable-next-line no-shadow
  var addListenersToPinsCards = function (adverts) {
    var pinsList = window.pin.renderPins(adverts);
    var cardList = window.card.renderCards(adverts);

    for (var i = 0; i < adverts.length; i++) {
      advertList[i] = new AdvertElement(pinsList.children[i], cardList.children[i]);
    }
    window.map.mapPins.appendChild(pinsList);
    window.map.mapOfAdvert.insertBefore(cardList, window.map.mapFiltersContainer);
  };

  window.data = {
    URL: 'https://js.dump.academy/keksobooking/data',
    adverts: [],
    loadHandler: function (data) {
      adverts = data.slice(0, DEFAULT_ADVERT_COUNT);

      addListenersToPinsCards(adverts);
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
