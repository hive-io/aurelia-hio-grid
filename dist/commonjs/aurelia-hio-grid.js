'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HioGridColumn = exports.HioGrid = undefined;
exports.configure = configure;

var _hioGrid = require('./hio-grid');

var _hioGridColumn = require('./hio-grid-column');

function configure(aurelia) {
  aurelia.globalResources('./hio-grid', './hio-grid-column');
}

exports.HioGrid = _hioGrid.HioGrid;
exports.HioGridColumn = _hioGridColumn.HioGridColumn;