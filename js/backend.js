'use strict';

(function () {
  var REQUEST_STATUS_OK = 200;
  var XHR_TIMEOUT = 10000;

  var commonRequest = function (onLoad, onError, requestType, URL, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    var onXhrLoad = function () {
      if (xhr.status === REQUEST_STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
      xhr.removeEventListener('load', onXhrLoad);
    };

    var onXhrError = function () {
      onError('Произошла ошибка соединения');
      xhr.removeEventListener('error', onXhrError);
    };

    var onXhrTimeout = function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      xhr.removeEventListener('timeout', onXhrTimeout);
    };

    xhr.addEventListener('load', onXhrLoad);
    xhr.addEventListener('error', onXhrError);
    xhr.addEventListener('timeout', onXhrTimeout);

    xhr.timeout = XHR_TIMEOUT;
    xhr.open(requestType, URL);

    if (requestType === 'POST') {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  window.backend = {
    load: function (onLoad, onError, URL) {
      commonRequest(onLoad, onError, 'GET', URL);
    },
    save: function (onLoad, onError, URL, data) {
      commonRequest(onLoad, onError, 'POST', URL, data);
    },
  };
})();
