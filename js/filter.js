'use strict';

(function () {
  var getSameTypeAdvert = function (advertList, evt) {
    var sameTypeAdverts = advertList.filter(function (it) {
      if (evt.target.value === 'any') {
        return it.advert.offer.type;
      }
      return it.advert.offer.type === evt.target.value;
    });
    sameTypeAdverts = sameTypeAdverts.slice(0, window.util.DEFAULT_PINS_NUMBER);
    return sameTypeAdverts;
  };

  window.filter = {
    getMapFilters: function (advertList) {
      var mapFilterContainer = window.map.mapOfAdvert.querySelector('.map__filters-container');
      var typeFilter = mapFilterContainer.querySelector('#housing-type');
      var currentPins = window.map.mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      var currentCards = window.map.mapOfAdvert.querySelectorAll('.map__card');

      typeFilter.addEventListener('change', function (evt) {
        currentPins = window.map.mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
        currentCards = window.map.mapOfAdvert.querySelectorAll('.map__card');

        if (currentCards.length > 0) {
          window.card.removeCards(currentCards);
        }
        if (currentPins.length > 0) {
          window.pin.removePins(currentPins);
        }
        window.pin.showPins(getSameTypeAdvert(advertList, evt));
        window.card.showCards(getSameTypeAdvert(advertList, evt));
      });
    },
  };
})();
