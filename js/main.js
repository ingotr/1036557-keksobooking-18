'use strict';

var DEFAULT_ADVERT_COUNT = 8;
var ADVERT_ADRESS = '600, 350';
var ADVERT_CHECKIN = ['12:00', '13:00', '14:00'];
var ADVERT_CHECKOUT = ['12:00', '13:00', '14:00'];
var ADVERT_DESCRIPTION = ['Just random description', 'Have a nice day! Just stay in our apartments', 'Funky city flat',
  'Cozy home for you to stay'];
var ADVERT_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ADVERT_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ADVERT_TITLES = ['Hello', 'Welcome back', 'Good to stay', 'Have a nice day'];
var ADVERT_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ADVERT_PRICES = [5000, 6400, 7500, 8900, 10000, 12300, 15000];
var ADVERT_ROOMS_NUMBER = [1, 2, 3, 100];
var ADVERT_GUESTS_NUMBER = [0, 1, 2, 3];
var ADVERT_FEATURE_CLASS = 1;
var ADVERT_FEATURE_PREFIX_LENGTH = 16;

var ROOMS_GUESTS_CONFIG = {
  '1': {
    val: ['1'],
    errMsg: '1 комната только для 1 гостя',
  },
  '2': {
    val: ['1', '2'],
    errMsg: '2 комнаты для 1 или 2 гостей',
  },
  '3': {
    val: ['1', '2', '3'],
    errMsg: '3 комнаты для 1, 2 или 3 гостей',
  },
  '100': {
    val: ['0'],
    errMsg: '100 комнат не для гостей',
  },
};

var LOCATION_X_MIN = 105;
var LOCATION_X_MAX = 990;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var ENTER_KEYCODE = 13;
var MAP_PIN_MAIN_HALFWIDTH = 33;
var MAP_PIN_MAIN_HEIGHT = 65;
var MAP_PIN_MAIN_HALFHEIGHT = 33;
var MAP_PIN_MAIN_TIP_HEIGHT = 20;
var DECIMAL_RADIX = 10;

var adverts = [];
var avatarStack = [];
var mapOfAdvert = document.querySelector('.map');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var mapPinsHeight = mapPins.scrollHeight;
var mapPinsWidth = mapPins.scrollWidth;
var mapFiltersContainer = document.querySelector('.map__filters-container');

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAdress = adForm.querySelector('#address');
var mapFilters = document.querySelector('.map__filters');
var mapPinMain = document.querySelector('.map__pin--main');
var selectRoomsElement = adForm.querySelector('#room_number');
var selectGuestsElement = adForm.querySelector('#capacity');

var isReceivedData = false;

var getUserAvatarNumber = function () {
  return avatarStack.pop();
};

var getRandomNumber = function (arr) {
  return Math.round((Math.random() * (arr.length - 1)));
};

var getRandomNumberInRange = function (min, max) {
  return min + Math.random() * (max - min);
};

var createRandomAvatarNumbers = function (numberOfAvatars) {
  while (avatarStack.length < numberOfAvatars) {
    var randomNumber = '0' + Math.round(getRandomNumberInRange(1, numberOfAvatars));
    if (avatarStack.indexOf(randomNumber) === -1) {
      avatarStack.push(randomNumber);
    }
  }
  return avatarStack;
};

var getRandomElement = function (arr) {
  return arr[Math.round((Math.random() * (arr.length - 1)))];
};

var getRandomList = function (arr) {
  var numberOfFeatures = getRandomNumber(arr);
  var randomFeaturesList = [];
  var randomFeatureIndex = 0;
  for (var i = 0; i < numberOfFeatures; i++) {
    randomFeatureIndex = getRandomNumber(arr);
    if (randomFeaturesList.indexOf(arr[randomFeatureIndex]) === -1) {
      randomFeaturesList.push(arr[randomFeatureIndex]);
    }
  }
  return randomFeaturesList;
};

var createSimilarAdverts = function (numberOfAdverts) {
  for (var i = 0; i < numberOfAdverts; i++) {
    adverts[i] = {
      author: {
        avatar: 'img/avatars/user' + getUserAvatarNumber() + '.png',
      },
      offer: {
        title: getRandomElement(ADVERT_TITLES),
        address: ADVERT_ADRESS,
        price: getRandomElement(ADVERT_PRICES),
        type: getRandomElement(ADVERT_TYPES),
        rooms: getRandomElement(ADVERT_ROOMS_NUMBER),
        guests: getRandomElement(ADVERT_GUESTS_NUMBER),
        checkin: getRandomElement(ADVERT_CHECKIN),
        checkout: getRandomElement(ADVERT_CHECKOUT),
        features: getRandomList(ADVERT_FEATURES),
        description: getRandomElement(ADVERT_DESCRIPTION),
        photos: getRandomList(ADVERT_PHOTOS),
      },
      location: {
        x: getRandomNumberInRange(LOCATION_X_MIN, LOCATION_X_MAX),
        y: getRandomNumberInRange(LOCATION_Y_MIN, LOCATION_Y_MAX),
      },
    };
  }
  return adverts;
};

var showMap = function () {
  mapOfAdvert.classList.remove('map--faded');
};

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

  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(generatePin(adverts[i]));
  }
  mapPins.appendChild(fragment);
};

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

var renderCards = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(generateCard(adverts[i]));
  }
  mapOfAdvert.insertBefore(fragment, mapFiltersContainer);
};

var renderMockData = function () {
  createRandomAvatarNumbers(DEFAULT_ADVERT_COUNT);
  createSimilarAdverts(DEFAULT_ADVERT_COUNT);
  renderPins();
};

var disableAdFormElements = function () {
  adForm.classList.add('ad-form--disabled');
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].setAttribute('disabled', 'disabled');
  }
};

var disableMapFilters = function () {
  mapFilters.setAttribute('disabled', 'disabled');
};

var runInactiveState = function () {
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      runActiveState();
      getPinMainAdress();
    }
  });
  disableAdFormElements();
  disableMapFilters();
  getPinMainAdressInactive();
};

var runActiveState = function () {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].removeAttribute('disabled');
  }

  adForm.classList.remove('ad-form--disabled');
  mapFilters.removeAttribute('disabled');

  if (!isReceivedData) {
    renderMockData();
    renderCards();
    isReceivedData = true;
  }

  showMap();
};

var getMaxMinAxisCoordinate = function (pinElementCoordinate, pinElementNumber) {
  switch (pinElementCoordinate) {
    case 'mapPinMain.style.left': {
      if (pinElementNumber <= 0) {
        pinElementNumber = 0;
      }
      if (pinElementNumber > mapPinsWidth) {
        pinElementNumber = mapPinsWidth;
      }
      break;
    }
    case 'mapPinMain.style.top': {
      if (pinElementNumber <= 0) {
        pinElementNumber = 0;
      }
      if (pinElementNumber > mapPinsHeight) {
        pinElementNumber = mapPinsHeight;
      }
      break;
    }
  }
  return pinElementNumber;
};

var getPinAxisCoordinate = function (pinElementCoordinate, distanceToPinTip) {
  var pinElement = pinElementCoordinate;
  var pxIndex = pinElement.indexOf('px');
  var pinElementNumber = pinElement.slice(0, pxIndex);
  var pinElementNumberInRange = getMaxMinAxisCoordinate(pinElementCoordinate, pinElementNumber);
  var pinAxisCoordinate = parseInt(pinElementNumberInRange, DECIMAL_RADIX) + distanceToPinTip;
  return pinAxisCoordinate;
};

var getPinMainAdressInactive = function () {
  adFormAdress.value = getPinAxisCoordinate(mapPinMain.style.left, MAP_PIN_MAIN_HALFWIDTH)
    + ', ' + getPinAxisCoordinate(mapPinMain.style.top, MAP_PIN_MAIN_HALFHEIGHT);

  return adFormAdress.value;
};

var getPinMainAdress = function () {
  adFormAdress.value = getPinAxisCoordinate(mapPinMain.style.left, MAP_PIN_MAIN_HALFWIDTH)
    + ', ' + getPinAxisCoordinate(mapPinMain.style.top, MAP_PIN_MAIN_HEIGHT + MAP_PIN_MAIN_TIP_HEIGHT);
  return adFormAdress.value;
};

var validateRoomsGuestsNumber = function () {
  var rooms = selectRoomsElement.value;
  var guests = selectGuestsElement.value;

  if ((ROOMS_GUESTS_CONFIG[rooms].val.indexOf(guests)) === -1) {
    selectRoomsElement.setCustomValidity(ROOMS_GUESTS_CONFIG[rooms].errMsg);
  } else {
    selectRoomsElement.setCustomValidity('');
  }
};

selectRoomsElement.addEventListener('change', validateRoomsGuestsNumber);
selectGuestsElement.addEventListener('change', validateRoomsGuestsNumber);


mapPinMain.addEventListener('mousedown', function () {
  runActiveState();
  getPinMainAdress();
});

runInactiveState();
