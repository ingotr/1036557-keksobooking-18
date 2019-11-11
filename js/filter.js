'use strict';

(function () {
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var typeFilter = mapFiltersContainer.querySelector('#housing-type');
  var priceFilter = mapFiltersContainer.querySelector('#housing-price');
  var roomsFilter = mapFiltersContainer.querySelector('#housing-rooms');
  var guestsFilter = mapFiltersContainer.querySelector('#housing-guests');
  var featuresFilter = mapFiltersContainer.querySelector('#housing-features');

  var arrayOfFeatures = Array.from(featuresFilter.querySelectorAll('input[type="checkbox"]'));

  var filterByType = function (place) {
    return typeFilter.value === 'any' ? true : place.advert.offer.type === typeFilter.value;
  };

  var filterByPriceRange = function (price, place) {
    switch (price) {
      case 'low':
        if (place.advert.offer.price > window.util.LOW_PRICE_MIN
          && place.advert.offer.price < window.util.LOW_PRICE_MAX) {
          return place.advert.offer.price;
        }
        break;
      case 'middle':
        if (place.advert.offer.price >= window.util.MEDIUM_PRICE_MIN
          && place.advert.offer.price < window.util.MEDIUM_PRICE_MAX) {
          return place.advert.offer.price;
        }
        break;
      case 'high':
        if (place.advert.offer.price > window.util.HIGH_PRICE_MIN
          && place.advert.offer.price < window.util.HIGHT_PRICE_MAX) {
          return place.advert.offer.price;
        }
        break;
    }
    return false;
  };

  var filterByPrice = function (place) {
    return priceFilter.value === 'any' ? true : filterByPriceRange(priceFilter.value, place);
  };

  var filterByRooms = function (place) {
    return roomsFilter.value === 'any' ? true : place.advert.offer.rooms === +roomsFilter.value;
  };

  var filterByGuests = function (place) {
    return guestsFilter.value === 'any' ? true : place.advert.offer.guests === +guestsFilter.value;
  };

  var filterByFeatures = function (place) {
    return !arrayOfFeatures.some(function (checkbox) {
      return checkbox.checked && place.advert.offer.features.indexOf(checkbox.value) === -1;
    });
  };

  var getSimilarAdverts = function (data) {
    var similarAdverts = data.slice();

    return similarAdverts.filter(function (place) {
      return filterByType(place) && filterByPrice(place) && filterByRooms(place) && filterByGuests(place) && filterByFeatures(place);
    }).slice(0, window.util.DEFAULT_PINS_NUMBER);
  };

  var onFilterChange = function () {
    window.debounce.debounce(updatePins);
  };

  var updatePins = function () {
    window.card.removeCurrent();
    window.pin.removeCurrent();
    window.pin.show(getSimilarAdverts(window.data.advertList));
  };

  window.filter = {
    setMapFilters: function () {
      mapFiltersContainer.addEventListener('change', onFilterChange);
    },
    removeMapFilter: function () {
      mapFiltersContainer.removeEventListener('change', onFilterChange);
    }
  };
})();
