'use strict';

(function () {
  var filterObject = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: ['', '', '', '', '', ''],
    rank: {
      typeRank: 0,
      priceRank: 0,
      roomsRank: 0,
      guestsRank: 0,
      featuresRank: 0,
    },
  };

  var getRank = function (it) {
    var rank = {
      typeRank: 0,
      priceRank: 0,
      roomsRank: 0,
      guestsRank: 0,
      featuresRank: 0,
    };
    var compareObj;

    if (it !== filterObject) {
      compareObj = it.advert.offer;
    } else {
      compareObj = filterObject;
    }

    if (filterObject.type === 'any') {
      rank.typeRank += 200;
    } else {
      if (compareObj.type === filterObject.type) {
        rank.typeRank += 200;
      }
    }

    if (filterObject.price === 'any') {
      rank.priceRank += 0;
    } else {
      switch (filterObject.price) {
        case 'low':
          if (typeof (compareObj.price) === 'string') {
            rank.priceRank += 100;
          }
          if (compareObj.price > window.util.LOW_PRICE_MIN
            && compareObj.price < window.util.LOW_PRICE_MAX) {
            rank.priceRank += 100;
          }
          break;
        case 'middle':
          if (typeof (compareObj.price) === 'string') {
            rank.priceRank += 100;
          }
          if (compareObj.price >= window.util.MEDIUM_PRICE_MIN
            && compareObj.price <= window.util.MEDIUM_PRICE_MAX) {
            rank.priceRank += 100;
          }
          break;
        case 'high':
          if (typeof (compareObj.price) === 'string') {
            rank.priceRank += 100;
          }
          if (compareObj.price > window.util.HIGH_PRICE_MIN
            && compareObj.price < window.util.HIGHT_PRICE_MAX) {
            rank.priceRank += 100;
          }
          break;
      }
    }

    if (filterObject.rooms === 'any') {
      rank.roomsRank += 0;
    } else {
      if (compareObj.rooms === filterObject.rooms) {
        rank.roomsRank += 30;
      }
    }

    if (filterObject.guests === 'any') {
      rank.guestsRank += 0;
    } else {
      if (compareObj.guests === filterObject.guests) {
        rank.guestsRank += 20;
      }
    }

    for (var i = 0; i < compareObj.features.length; i++) {
      if (compareObj.features.indexOf(filterObject.features[i])) {
        if (filterObject.features[i] === '') {
          rank.featuresRank += 0;
        } else {
          if (compareObj.features[i] === '') {
            rank.featuresRank += 0;
          } else {
            rank.featuresRank += 10;
          }
        }
      }
    }

    it.rank = rank;
    return rank;
  };

  var getSimilarAdverts = function (advertList) {
    getRank(filterObject);
    var similarAdverts = advertList.slice();
    for (var i = 0; i < similarAdverts.length; i++) {
      getRank(similarAdverts[i]);
    }

    similarAdverts = similarAdverts.filter(function (it) {
      return it.rank.typeRank >= filterObject.rank.typeRank;
    });

    similarAdverts = similarAdverts.filter(function (it) {
      return it.rank.priceRank >= filterObject.rank.priceRank;
    });
    similarAdverts = similarAdverts.filter(function (it) {
      return it.rank.roomsRank >= filterObject.rank.roomsRank;
    });
    similarAdverts = similarAdverts.filter(function (it) {
      return it.rank.guestsRank >= filterObject.rank.guestsRank;
    });
    similarAdverts = similarAdverts.filter(function (it) {
      return it.rank.featuresRank >= filterObject.rank.featuresRank;
    });

    similarAdverts = similarAdverts.slice(0, window.util.DEFAULT_PINS_NUMBER);
    return similarAdverts;
  };

  var updatePins = function () {
    window.card.removeCurrent();
    window.pin.removeCurrent();
    window.pin.show(getSimilarAdverts(window.data.advertList));
  };

  var onTypeFilterChange = function () {
    filterObject.type = event.currentTarget.value;
    window.debounce.debounce(updatePins);
  };

  var onPriceFilterChange = function () {
    filterObject.price = event.currentTarget.value;
    window.debounce.debounce(updatePins);
  };

  var onRoomsFilterChange = function () {
    if (event.currentTarget.value === 'any') {
      filterObject.rooms = event.currentTarget.value;
    } else {
      filterObject.rooms = parseInt(event.currentTarget.value, window.util.DECIMAL_RADIX);
    }
    window.debounce.debounce(updatePins);
  };

  var onGuestsFilterChange = function () {
    if (event.currentTarget.value === 'any') {
      filterObject.guests = event.currentTarget.value;
    } else {
      filterObject.guests = parseInt(event.currentTarget.value, window.util.DECIMAL_RADIX);
    }
    window.debounce.debounce(updatePins);
  };

  var updateFeatureChange = function (number) {
    if (!event.target.checked) {
      filterObject.features[number] = '';
    } else {
      filterObject.features[number] = event.target.value;
    }
  };

  var onFeaturesChange = function () {
    switch (event.target.value) {
      case 'wifi':
        updateFeatureChange(0);
        break;
      case 'dishwasher':
        updateFeatureChange(1);
        break;
      case 'parking':
        updateFeatureChange(2);
        break;
      case 'washer':
        updateFeatureChange(3);
        break;
      case 'elevator':
        updateFeatureChange(4);
        break;
      case 'conditioner':
        updateFeatureChange(5);
        break;
    }
    window.debounce.debounce(updatePins);
  };

  window.filter = {
    setMapFilters: function () {
      window.map.typeFilter.addEventListener('change', onTypeFilterChange);
      window.map.priceFilter.addEventListener('change', onPriceFilterChange);
      window.map.roomsFilter.addEventListener('change', onRoomsFilterChange);
      window.map.guestsFilter.addEventListener('change', onGuestsFilterChange);
      window.map.featuresFilter.addEventListener('change', onFeaturesChange);
    },
    removeMapFilter: function () {
      window.map.typeFilter.removeEventListener('change', onTypeFilterChange);
    }
  };
})();
