define(['exports', './aurelia-hio-grid'], function (exports, _aureliaHioGrid) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaHioGrid).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaHioGrid[key];
      }
    });
  });
});