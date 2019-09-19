'use strict';

var DEFAULT_ADVERT_COUNT = 8;
var ADVERT_CHECKIN = ['12:00', '13:00', '14:00'];
var ADVERT_CHECKOUT = ['12:00', '13:00', '14:00'];
var ADVERT_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ADVERT_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ADVERT_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ADVERT_ROOMS_NUMBER = [1, 2, 3];
var ADVERT_GUESTS_NUMBER = [0, 1, 2, 3];
var LOCATION_X_MIN = 105;
var LOCATION_X_MAX = 990;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;

var adverts = [];
var author = {};
var offer = {};
var mapOfAdvert = document.querySelector('.map');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');

var userAvatarNumber = function (numberOfAvatars) {
  return '0' + Math.round(Math.random() * numberOfAvatars - 1);
};

var getRandomNumber = function (arr) {
  return Math.round((Math.random() * (arr.length - 1)));
};

var getRandomNumberInRange = function (min, max) {
  return min + Math.random() * (max - min);
};

var getRandomElement = function (arr) {
  return arr[Math.round((Math.random() * (arr.length - 1)))];
};

var getRandomFeaturesList = function (arr) {
  var numberOfFeatures = getRandomNumber(arr);
  var randomFeaturesList = [];
  for (var i = 0; i < numberOfFeatures; i++) {
    randomFeaturesList.push(arr[getRandomNumber(arr)]);
  }
  return randomFeaturesList;
};

var createSimilarAdvert = function () {
  for (var i = 0; i < DEFAULT_ADVERT_COUNT; i++) {
    adverts[i] = {
      author: {
        avatar: 'img/avatars/user' + userAvatarNumber(DEFAULT_ADVERT_COUNT) + '.png',
      },
      offer: {
        title: 'title',
        address: '600, 350',
        price: 'price',
        type: getRandomElement(ADVERT_TYPES),
        rooms: getRandomElement(ADVERT_ROOMS_NUMBER),
        guests: getRandomElement(ADVERT_GUESTS_NUMBER),
        checkin: getRandomElement(ADVERT_CHECKIN),
        checkout: getRandomElement(ADVERT_CHECKOUT),
        features: getRandomFeaturesList(ADVERT_FEATURES),
        description: 'description',
        photos: getRandomElement(ADVERT_PHOTOS),
      },
      location: {
        x: getRandomNumberInRange(LOCATION_X_MIN, LOCATION_X_MAX),
        y: getRandomNumberInRange(LOCATION_Y_MIN, LOCATION_Y_MAX),
      },
    };
  }
  return adverts;
};

var showDomElements = function () {
  mapOfAdvert.classList.remove('map--faded');
};

var renderPins = function () {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style = 'left: ' + location.x + 'px; top: ' + location.y + 'px;';
  pinElement.src = author.avatar;
  pinElement.alt = offer.title;

  return pinElement;
};

var renderFragment = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(renderPins(adverts[i]));
  }
  mapPins.appendChild(fragment);
};

var renderMockData = function () {
  createSimilarAdvert();
  renderFragment();
};

renderMockData();
showDomElements();
