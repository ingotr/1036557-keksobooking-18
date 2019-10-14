'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
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
  var LOCATION_X_MIN = 105;
  var LOCATION_X_MAX = 990;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var adverts = [];

  var avatarStack = [];

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

  var renderMockData = function () {
    createRandomAvatarNumbers(DEFAULT_ADVERT_COUNT);
    createSimilarAdverts(DEFAULT_ADVERT_COUNT);
  };

  var loadHandler = function (data) {
    adverts = data.slice(0, DEFAULT_ADVERT_COUNT);

    // adverts === window.data.adverts ? console.log("true") : console.log("false");
    console.log(adverts);
  };

  var errorHandler = function () {
    var errorTemplate = document.querySelector('#error').content.querySelector('error');
    var errorElement = errorTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(errorElement);

    document.body.insertAdjacentElement('map__pins', fragment);
  };

  window.backend.load(loadHandler, errorHandler, URL_LOAD);
  console.log(adverts);

  window.data = {
    adverts: adverts,
  };

})();
