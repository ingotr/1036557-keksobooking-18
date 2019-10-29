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

      var onTypeFilterChange = function (evt) {
        window.card.removeCurrent();
        window.pin.removeCurrent();
        window.pin.show(getSameTypeAdvert(advertList, evt));
      };

      typeFilter.addEventListener('change', onTypeFilterChange);
      typeFilter.removeEventListener('change', onTypeFilterChange);
    },
  };
})();
