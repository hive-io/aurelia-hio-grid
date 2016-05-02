'use strict';

System.register(['./hio-grid', './hio-grid-column'], function (_export, _context) {
  var HioGrid, HioGridColumn;
  return {
    setters: [function (_hioGrid) {
      HioGrid = _hioGrid.HioGrid;
    }, function (_hioGridColumn) {
      HioGridColumn = _hioGridColumn.HioGridColumn;
    }],
    execute: function () {
      function configure(aurelia) {
        aurelia.globalResources('./hio-grid', './hio-grid-column');
      }

      _export('configure', configure);

      _export('HioGrid', HioGrid);

      _export('HioGridColumn', HioGridColumn);
    }
  };
});