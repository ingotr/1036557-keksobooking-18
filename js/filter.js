'use strict';

(function () {
  function AdvertElement(pin, card) {
    this.pin = pin;
    this.card = card;

    window.card.openCard(this);
    window.card.closeCard(this);
  }

  var adverts = [];
  var advertList = [];

  window.filter = {
    getMapFilters: function () {
      var mapFilterContainer = window.map.mapOfAdvert.querySelector('.map__filters-container');
      var typeFilter = mapFilterContainer.querySelector('#housing-type');
      typeFilter.addEventListener('change', function (evt) {
        window.filter.getAdvertElements();
        console.log(evt.target.value);
        window.backend.load(window.data.loadHandler, window.data.errorHandler, window.data.URL);
        if (evt.target.value === adverts[0].offer.type) {
          console.log('Совпадает с фильтром');
        }
      });
    },
    getAdvertElements: function () {
      var pinsList = window.map.mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      var cardsList = window.map.mapOfAdvert.querySelectorAll('.map__card');
      for (var i = 0; i < pinsList.length; i++) {
        advertList[i] = new AdvertElement(pinsList[i], cardsList[i]);
      }
      console.log(advertList);
      return advertList;
    },
  };
})();
