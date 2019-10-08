'use strict';

(function () {
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var generatePin = function (advert) {
    var pinElement = mapPinTemplate.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');

    pinElement.style = 'left: ' + advert.location.x + 'px; top: ' + advert.location.y + 'px;';
    pinElementImg.src = advert.author.avatar;
    pinElementImg.alt = advert.offer.title;

    return pinElement;
  };

  var renderPins = function () {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.data.adverts.length; i++) {
      fragment.appendChild(generatePin(window.data.adverts[i]));
    }

    return fragment;
  };

  window.pin = {
    renderPins: renderPins,
  };

})();
