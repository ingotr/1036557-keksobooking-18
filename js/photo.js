'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var onFileChange = function (evt) {
    var file = evt.target.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (event.target.id === 'avatar') {
      evt = window.map.avatarPreview;
    } else {
      evt = window.map.housePreview;
    }

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        evt.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  window.map.avatarFileChooser.addEventListener('change', onFileChange);
  window.map.houseFileChooser.addEventListener('change', onFileChange);
})();
