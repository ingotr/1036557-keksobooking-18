'use strict';

(function () {
  // var filterObject = {
  //   type: 'type',
  //   price: 'price',
  //   rooms: 'rooms',
  //   guests: 'guests',
  //   features: {
  //     wifi: 'wifi',
  //     dishwasher: 'dishwasher',
  //     parking: 'parking',
  //     washer: 'washer',
  //     elevator: 'elevator',
  //     conditioner: 'conditioner',
  //   },
  // };

  // var getCurrentFiltersValues = function () {

  // };

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
      window.map.priceFilter.addEventListener('change', onTypeFilterChange);
      window.map.roomsFilter.addEventListener('change', onTypeFilterChange);
      window.map.guestsFilter.addEventListener('change', onTypeFilterChange);
      window.map.featuresWiFiFilter.addEventListener('change', onTypeFilterChange);
      window.map.featuresDishwasherFilter.addEventListener('change', onTypeFilterChange);
      window.map.featuresParkingFilter.addEventListener('change', onTypeFilterChange);
      window.map.featuresWasherFilter.addEventListener('change', onTypeFilterChange);
      window.map.featuresElevatorFilter.addEventListener('change', onTypeFilterChange);
      window.map.featuresConditionerFilter.addEventListener('change', onTypeFilterChange);
    },
    removeMapFilter: function () {
      window.map.typeFilter.removeEventListener('change', onTypeFilterChange);
    }
  };
})();
