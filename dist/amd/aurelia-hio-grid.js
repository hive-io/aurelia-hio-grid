define(['exports', './hio-grid', './hio-grid-column'], function (exports, _hioGrid, _hioGridColumn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HioGridColumn = exports.HioGrid = undefined;
  exports.configure = configure;
  function configure(aurelia) {
    aurelia.globalResources('./hio-grid', './hio-grid-column');
  }

  exports.HioGrid = _hioGrid.HioGrid;
  exports.HioGridColumn = _hioGridColumn.HioGridColumn;
});