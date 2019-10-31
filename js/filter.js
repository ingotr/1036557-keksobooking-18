'use strict';

(function () {
  var getSameTypeAdvert = function (advertList) {
    var sameTypeAdverts = advertList.filter(function (it) {
      if (event.target.value === 'any') {
        return it.advert.offer.type;
      }
      return it.advert.offer.type === event.target.value;
    });
    sameTypeAdverts = sameTypeAdverts.slice(0, window.util.DEFAULT_PINS_NUMBER);
    return sameTypeAdverts;
  };

  var onTypeFilterChange = function () {
    window.card.removeCurrent();
    window.pin.removeCurrent();
    window.pin.show(getSameTypeAdvert(window.data.advertList));
  };

  window.filter = {
    setMapFilters: function () {
      window.map.typeFilter.addEventListener('change', onTypeFilterChange);
    },
    removeMapFilter: function () {
      window.map.typeFilter.removeEventListener('change', onTypeFilterChange);
    }
  };
})();
