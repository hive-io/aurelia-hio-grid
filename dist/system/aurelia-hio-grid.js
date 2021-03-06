'use strict';

System.register(['./hio-grid', './hio-grid-column'], function (_export, _context) {
  "use strict";

  var HioGrid, HioGridColumn;
  function configure(aurelia) {
    aurelia.globalResources('./hio-grid', './hio-grid-column');
  }

  _export('configure', configure);

  return {
    setters: [function (_hioGrid) {
      HioGrid = _hioGrid.HioGrid;
    }, function (_hioGridColumn) {
      HioGridColumn = _hioGridColumn.HioGridColumn;
    }],
    execute: function () {
      _export('HioGrid', HioGrid);

      _export('HioGridColumn', HioGridColumn);
    }
  };
});