'use strict';

(function () {
  var showPins = function (sameTypeAdverts) {
    for (var i = 0; i < sameTypeAdverts.length; i++) {
      sameTypeAdverts[i].pin.classList.remove('hidden');
    }
  };
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
    getFirstFiveAdverts: function (advertList) {
      for (var i = 0; i < window.util.DEFAULT_PINS_NUMBER; i++) {
        advertList[i].pin.classList.remove('hidden');
      }
    },
    getMapFilters: function (advertList) {
      var mapFilterContainer = window.map.mapOfAdvert.querySelector('.map__filters-container');
      var typeFilter = mapFilterContainer.querySelector('#housing-type');

      typeFilter.addEventListener('change', function (evt) {
        window.filter.hidePins(advertList);
        showPins(getSameTypeAdvert(advertList, evt));
      });
    },
    hidePins: function (advertList) {
      for (var i = 0; i < advertList.length; i++) {
        advertList[i].pin.classList.add('hidden');
      }
    },
  };
})();
