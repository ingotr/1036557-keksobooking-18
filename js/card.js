'use strict';

(function () {
  var ADVERT_FEATURE_CLASS = 1;
  var ADVERT_FEATURE_PREFIX_LENGTH = 16;

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var generateCardFeatureList = function (advert, cardFeatures, cardFeature) {
    for (var i = 0; i < cardFeature.length; i++) {
      if ((advert.offer.features.indexOf((cardFeature[i].classList[ADVERT_FEATURE_CLASS]).substr(ADVERT_FEATURE_PREFIX_LENGTH))) === -1) {
        cardFeatures.removeChild(cardFeature[i]);
      }
    }
  };

  var renderCardPhotoList = function (advert, cardPhotos, cardPhoto, cardPhotosFragment) {
    cardPhotos.removeChild(cardPhoto);
    for (var i = 0; i < advert.offer.photos.length; i++) {
      var clonedPhoto = cardPhoto.cloneNode(true);
      clonedPhoto.src = advert.offer.photos[i];
      cardPhotosFragment.appendChild(clonedPhoto);
    }
    cardPhotos.appendChild(cardPhotosFragment);
  };

  var generateCard = function (advert) {
    var card = cardTemplate.cloneNode(true);
    var cardTitle = card.querySelector('.popup__title');
    var cardAdress = card.querySelector('.popup__text--address');
    var cardPrice = card.querySelector('.popup__text--price');
    var cardType = card.querySelector('.popup__type');
    var cardCapacity = card.querySelector('.popup__text--capacity');
    var cardCheckinCheckout = card.querySelector('.popup__text--time');
    var cardFeatures = card.querySelector('.popup__features');
    var cardFeature = cardFeatures.querySelectorAll('.popup__feature');
    var cardDescription = card.querySelector('.popup__description ');
    var cardPhotos = card.querySelector('.popup__photos ');
    var cardPhoto = cardPhotos.querySelector('.popup__photo');
    var cardAuthorAvatar = card.querySelector('.popup__avatar');

    var cardPhotosFragment = document.createDocumentFragment();

    cardAuthorAvatar.src = advert.author.avatar;
    cardTitle.innerText = advert.offer.title;
    cardAdress.innerText = advert.offer.address;
    cardPrice.innerText = advert.offer.price + '₽/ночь';
    cardType.innerText = advert.offer.type;
    cardCapacity.innerText = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
    cardCheckinCheckout.innerText = 'Заезд после ' + advert.offer.checkin + ', выезд после ' + advert.offer.checkin + '.';

    generateCardFeatureList(advert, cardFeatures, cardFeature);

    cardDescription.innerText = advert.offer.description;

    renderCardPhotoList(advert, cardPhotos, cardPhoto, cardPhotosFragment);

    cardAuthorAvatar.src = advert.author.avatar;

    return card;
  };

  var onCardEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC) {
      window.card.removeCurrent();
      document.removeEventListener('keydown', onCardEscPress);
    }
  };

  var onCardClose = function () {
    window.card.removeCurrent();
  };

  window.card = {
    render: function (adverts) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < adverts.length; i++) {
        fragment.appendChild(generateCard(adverts[i]));
        fragment.children[i].classList.add('hidden');
      }
      return fragment;
    },
    removeCurrent: function () {
      var currentCards = window.map.mapOfAdvert.querySelectorAll('.map__card');
      if (currentCards.length > 0) {
        window.card.hideCurrent(currentCards);
        window.card.remove(currentCards);
        document.removeEventListener('keydown', onCardEscPress);
      }
    },
    open: function (obj) {
      var onCardClick = function () {
        window.card.removeCurrent();
        window.map.mapOfAdvert.insertBefore(obj.card, window.map.mapFiltersContainer);
        obj.card.classList.remove('hidden');
        document.addEventListener('keydown', onCardEscPress);
      };

      obj.pin.removeEventListener('click', onCardClick);
      obj.pin.addEventListener('click', onCardClick);
    },
    close: function (obj) {
      obj.closeButton = obj.card.querySelector('.popup__close');
      obj.closeButton.removeEventListener('click', onCardClose);
      obj.closeButton.addEventListener('click', onCardClose);
    },
    hide: function (advertList) {
      for (var i = 0; i < advertList.length; i++) {
        advertList[i].card.classList.add('hidden');
      }
    },
    hideCurrent: function (currentCards) {
      for (var i = 0; i < currentCards.length; i++) {
        currentCards[i].classList.add('hidden');
      }
    },
    show: function (sameTypeAdverts) {
      for (var i = 0; i < sameTypeAdverts.length; i++) {
        window.map.mapOfAdvert.insertBefore(sameTypeAdverts[i].card, window.map.mapFiltersContainer);
      }
    },
    remove: function (currentCards) {
      for (var i = 0; i < currentCards.length; i++) {
        window.map.mapOfAdvert.removeChild(currentCards[i]);
      }
    },
  };

})();
