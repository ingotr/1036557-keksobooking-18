'use strict';

(function () {
  var REQUEST_STATUS_OK = 200;
  var XHR_TIMEOUT = 10000;

  var commonRequest = function (onLoad, onError, requestType, URL, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    var test;

    xhr.addEventListener('load', function () {
      if (xhr.status === REQUEST_STATUS_OK) {
        test = onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = XHR_TIMEOUT;
    xhr.open(requestType, URL);

    if (requestType === 'POST') {
      xhr.send(data);
    } else {
      xhr.send();
    }
    return test;
  };

  window.backend = {
    load: function (onLoad, onError, URL) {
      var test = commonRequest(onLoad, onError, 'GET', URL);
      return test;
    },
    save: function (onLoad, onError, URL, data) {
      commonRequest(onLoad, onError, 'POST', URL, data);
    },
  };
})();
