'use strict';

(function () {
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var generate = function (advert) {
    var pinElement = mapPinTemplate.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');

    pinElement.style = 'left: ' + advert.location.x + 'px; top: ' + advert.location.y + 'px;';
    pinElementImg.src = advert.author.avatar;
    pinElementImg.alt = advert.offer.title;

    return pinElement;
  };

  window.pin = {
    render: function (adverts) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < adverts.length; i++) {
        fragment.appendChild(generate(adverts[i]));
      }
      return fragment;
    },
    show: function (adverts) {
      for (var i = 0; i < adverts.length; i++) {
        window.map.mapPins.appendChild(adverts[i].pin);
        adverts[i].pin.classList.remove('hidden');
      }
    },
    remove: function (currentPins) {
      for (var i = 0; i < currentPins.length; i++) {
        window.map.mapPins.removeChild(currentPins[i]);
      }
    },
    removeCurrent: function () {
      var currentPins = window.map.mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      if (currentPins.length > 0) {
        window.pin.remove(currentPins);
      }
    },
  };

})();
