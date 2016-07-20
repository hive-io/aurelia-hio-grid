'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HioGrid = exports.HioGridColumn = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class4, _desc2, _value2, _class5, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;

exports.updateOverrideContexts = updateOverrideContexts;
exports.createFullOverrideContext = createFullOverrideContext;
exports.updateOverrideContext = updateOverrideContext;
exports.getItemsSourceExpression = getItemsSourceExpression;
exports.unwrapExpression = unwrapExpression;
exports.isOneTime = isOneTime;
exports.updateOneTimeBinding = updateOneTimeBinding;
exports.overwriteArrayContents = overwriteArrayContents;

var _aureliaFramework = require('aurelia-framework');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');

var _aureliaTemplatingResources = require('aurelia-templating-resources');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var oneTime = _aureliaFramework.bindingMode.oneTime;

function updateOverrideContexts(views, startIndex) {
  var length = views.length;

  if (startIndex > 0) {
    startIndex = startIndex - 1;
  }

  for (; startIndex < length; ++startIndex) {
    updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
  }
}

function createFullOverrideContext(repeat, data, index, length, key) {
  var bindingContext = {};
  var overrideContext = (0, _aureliaFramework.createOverrideContext)(bindingContext, repeat.scope.overrideContext);

  if (typeof key !== 'undefined') {
    bindingContext[repeat.key] = key;
    bindingContext[repeat.value] = data;
  } else {
    bindingContext[repeat.local] = data;
  }
  updateOverrideContext(overrideContext, index, length);
  return overrideContext;
}

function updateOverrideContext(overrideContext, index, length) {
  var first = index === 0;
  var last = index === length - 1;
  var even = index % 2 === 0;

  overrideContext.$index = index;
  overrideContext.$first = first;
  overrideContext.$last = last;
  overrideContext.$middle = !(first || last);
  overrideContext.$odd = !even;
  overrideContext.$even = even;
}

function getItemsSourceExpression(instruction, attrName) {
  return instruction.behaviorInstructions.filter(function (bi) {
    return bi.originalAttrName === attrName;
  })[0].attributes.items.sourceExpression;
}

function unwrapExpression(expression) {
  var unwrapped = false;
  while (expression instanceof _aureliaFramework.BindingBehavior) {
    expression = expression.expression;
  }
  while (expression instanceof _aureliaFramework.ValueConverter) {
    expression = expression.expression;
    unwrapped = true;
  }
  return unwrapped ? expression : null;
}

function isOneTime(expression) {
  while (expression instanceof _aureliaFramework.BindingBehavior) {
    if (expression.name === 'oneTime') {
      return true;
    }
    expression = expression.expression;
  }
  return false;
}

function updateOneTimeBinding(binding) {
  if (binding.call && binding.mode === oneTime) {
    binding.call(_aureliaFramework.sourceContext);
  } else if (binding.updateOneTimeBindings) {
    binding.updateOneTimeBindings();
  }
}

function overwriteArrayContents(dst, src) {
  var i = void 0;
  for (i = 0; i < Math.min(src.length, dst.length); i++) {
    Object.assign(dst[i], src[i]);
  }

  for (; i < src.length; i++) {
    dst.push(src[i]);
  }while (i < dst.length) {
    dst.pop();
  }
}

var HioGridColumn = exports.HioGridColumn = (_dec = (0, _aureliaTemplating.processContent)(false), _dec2 = (0, _aureliaTemplating.customElement)('hio-grid-column'), _dec3 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaTemplating.ViewCompiler), (0, _aureliaTemplating.noView)(_class = _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function HioGridColumn(element, viewCompiler) {
  _classCallCheck(this, HioGridColumn);

  _initDefineProp(this, 'header', _descriptor, this);

  _initDefineProp(this, 'field', _descriptor2, this);

  _initDefineProp(this, 'compact', _descriptor3, this);

  _initDefineProp(this, 'sortable', _descriptor4, this);

  var field = element.attributes.hasOwnProperty('field') ? element.attributes.field.nodeValue : null;
  this.viewFactory = null;
  if (element.innerHTML.trim() !== '') {
    var template = '<template>' + element.innerHTML + '</template>';
    this.viewFactory = viewCompiler.compile(template);
    element.innerHTML = '';
  } else if (!!field) {
    var _template = '<template>${row.' + field + '}</template>';
    this.viewFactory = viewCompiler.compile(_template);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'header', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'field', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'compact', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'sortable', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class) || _class);
var HioGrid = exports.HioGrid = (_dec4 = (0, _aureliaTemplating.customElement)('hio-grid'), _dec5 = (0, _aureliaDependencyInjection.inject)(_aureliaDependencyInjection.Container, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewCompiler, _aureliaBinding.ObserverLocator, _aureliaTemplatingResources.RepeatStrategyLocator), _dec6 = (0, _aureliaTemplating.children)('hio-grid-column'), _dec7 = (0, _aureliaBinding.computedFrom)('pageOffset', 'pageSize', 'pageTotal'), _dec8 = (0, _aureliaBinding.computedFrom)('pageOffset', 'pageSize', 'pageTotal'), _dec9 = (0, _aureliaBinding.computedFrom)('pageOffset', 'pageSize', 'pageTotal'), _dec4(_class4 = _dec5(_class4 = (_class5 = function (_AbstractRepeater) {
  _inherits(HioGrid, _AbstractRepeater);

  function HioGrid(container, viewSlot, viewCompiler, observerLocator, strategyLocator) {
    _classCallCheck(this, HioGrid);

    var _this = _possibleConstructorReturn(this, _AbstractRepeater.call(this, {
      local: 'row',
      viewsRequireLifecycle: false
    }));

    _initDefineProp(_this, 'columns', _descriptor5, _this);

    _initDefineProp(_this, 'rows', _descriptor6, _this);

    _initDefineProp(_this, 'class', _descriptor7, _this);

    _initDefineProp(_this, 'options', _descriptor8, _this);

    _initDefineProp(_this, 'searchQuery', _descriptor9, _this);

    _this.sortColumn = null;
    _this.sortClass = null;
    _this.pageOffset = 0;
    _this.pageLimit = 0;
    _this.pageTotal = 0;

    _initDefineProp(_this, 'pageSize', _descriptor10, _this);

    _this.criteria = { offset: 0, limit: 10, order: null };
    _this.columnViewFactories = [];


    _this.container = container;
    _this.viewSlot = viewSlot;
    _this.observerLocator = observerLocator;
    _this.strategyLocator = strategyLocator;
    _this.scope = null;
    _this.strategy = null;
    _this.rowViewFactory = viewCompiler.compile('<template><slot></slot></template>');

    _this.rowViewSlots = [];
    return _this;
  }

  HioGrid.prototype.attached = function attached() {
    this.scrapeColumnViewFactories();

    $('.dropdown', this._element).dropdown();
    if (!!this.options.criteria) Object.assign(this.criteria, this.options.criteria);

    var hiveSettings = JSON.parse(localStorage.getItem('hive:settings'));
    hiveSettings = hiveSettings || {};
    if (!!hiveSettings.pageSize) {
      $('.dropdown', this._element).dropdown('set selected', hiveSettings.pageSize);
      this.pageSize = hiveSettings.pageSize;
      this.criteria.limit = hiveSettings.pageSize;
    }

    this.updateData();
  };

  HioGrid.prototype.parseContentRange = function parseContentRange(contentRange) {
    var tokens = contentRange.split(' ')[1].split('/');
    this.pageOffset = parseInt(tokens[0].split('-')[0], 10);
    this.pageLimit = parseInt(tokens[0].split('-')[1], 10);
    this.pageTotal = parseInt(tokens[1], 10);
  };

  HioGrid.prototype.updateData = function updateData() {
    var _this2 = this;

    return this.options.service.list(this.criteria).then(function (response) {
      overwriteArrayContents(_this2.rows, response.body);
      _this2.parseContentRange(response.headers.get('Content-Range'));
    }).catch(function (err) {
      _this2.rows = [];
      console.log(err);
    });
  };

  HioGrid.prototype.bind = function bind(bindingContext, overrideContext) {
    this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };

    this.rowsChanged();
  };

  HioGrid.prototype.unbind = function unbind() {
    this.scope = null;
    this.rows = null;
    this.viewSlot.removeAll(true);
    this._stopObservation();
  };

  HioGrid.prototype.call = function call(context, changes) {
    this[context](this.rows, changes);
  };

  HioGrid.prototype.scrapeColumnViewFactories = function scrapeColumnViewFactories() {
    this.columnViewFactories = [];
    for (var i = 0, ii = this.columns.length; i < ii; ++i) {
      this.columnViewFactories.push(this.columns[i].viewFactory);
    }
  };

  HioGrid.prototype.rowsChanged = function rowsChanged() {
    this._stopObservation();
    if (!this.scope) return;

    var rows = this.rows;
    this.strategy = this.strategyLocator.getStrategy(rows);
    this._observeCollection();
    this.strategy.instanceChanged(this, rows);
  };

  HioGrid.prototype._stopObservation = function _stopObservation() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  };

  HioGrid.prototype._observeCollection = function _observeCollection() {
    var rows = this.rows;
    this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, rows);

    if (this.collectionObserver) {
      this.callContext = 'handleCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  };

  HioGrid.prototype.handleCollectionMutated = function handleCollectionMutated(collection, changes) {
    this.strategy.instanceMutated(this, collection, changes);
  };

  HioGrid.prototype.views = function views() {
    return this.rowViewSlots;
  };

  HioGrid.prototype.view = function view(index) {
    return this.rowViewSlots[index];
  };

  HioGrid.prototype.viewCount = function viewCount() {
    return this.rowViewSlots.length;
  };

  HioGrid.prototype.addView = function addView(bindingContext, overrideContext) {
    var rowElement = document.createElement('tr');
    this.tbody.appendChild(rowElement);
    var rowView = this.rowViewFactory.create(this.container);
    this.viewSlot.add(rowView);
    var rowViewSlot = new _aureliaTemplating.ViewSlot(rowElement, true);
    for (var x = 0, xx = this.columnViewFactories.length; x < xx; x++) {
      var cellViewFactory = this.columnViewFactories[x];
      var cellView = cellViewFactory.create(this.container);
      rowViewSlot.add(cellView);

      var cellElement = document.createElement('td');
      if (this.columns[x].compact === true) cellElement.classList.add('collapsing');
      rowElement.appendChild(cellElement);

      cellView.removeNodes();
      cellView.appendNodesTo(cellElement);
    }

    rowViewSlot.bind(bindingContext, overrideContext);
    this.rowViewSlots.push(rowViewSlot);
    rowViewSlot.attached();
  };

  HioGrid.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
    var rowElement = document.createElement('tr');
    var existingElement = !!this.rowViewSlots[index] && !!this.rowViewSlots[index].anchor ? this.rowViewSlots[index].anchor : null;
    this.tbody.insertBefore(rowElement, existingElement);
    var rowView = this.rowViewFactory.create(this.container);
    this.viewSlot.insert(index, rowView);
    var rowViewSlot = new _aureliaTemplating.ViewSlot(rowElement, true);
    for (var x = 0, xx = this.columnViewFactories.length; x < xx; x++) {
      var cellViewFactory = this.columnViewFactories[x];
      var cellView = cellViewFactory.create(this.container);
      rowViewSlot.add(cellView);

      var cellElement = document.createElement('td');
      rowElement.appendChild(cellElement);

      cellView.removeNodes();
      cellView.appendNodesTo(cellElement);
    }

    rowViewSlot.bind(bindingContext, overrideContext);
    this.rowViewSlots.splice(index, 0, rowViewSlot);
    rowViewSlot.attached();
  };

  HioGrid.prototype.removeAllViews = function removeAllViews() {
    var length = this.rowViewSlots.length;
    while (length--) {
      var rowViewSlot = this.rowViewSlots.pop();
      var anchor = rowViewSlot.anchor;
      var parentNode = anchor.parentNode;
      rowViewSlot.removeAll(true);
      parentNode.removeChild(anchor);
    }

    this.rowViewSlots = [];
    this.viewSlot.removeAll(true);
  };

  HioGrid.prototype.removeView = function removeView(index) {
    var rowViewSlots = this.rowViewSlots;
    var anchor = rowViewSlots[index].anchor;
    var parentNode = anchor.parentNode;
    rowViewSlots[index].removeAll(true);
    parentNode.removeChild(anchor);
    rowViewSlots.splice(index, 1);
    this.viewSlot.removeAt(index, true);
  };

  HioGrid.prototype.updateBindings = function updateBindings(view) {
    var i = view.children.length;
    while (i--) {
      var j = view.children[i].bindings.length;
      while (j--) {
        updateOneTimeBinding(view.children[i].bindings[j]);
      }j = view.children[i].controllers.length;
      while (j--) {
        var k = view.children[i].controllers[j].boundProperties.length;
        while (k--) {
          var binding = view.children[i].controllers[j].boundProperties[k].binding;
          updateOneTimeBinding(binding);
        }
      }
    }
  };

  HioGrid.prototype.sort = function sort(column) {
    this.sortColumn = column.header;
    switch (this.sortClass) {
      case 'descending':
        this.sortClass = 'ascending';
        this.criteria.order = '-' + column.field;
        break;

      default:
        this.sortClass = 'descending';
        this.criteria.order = column.field;
        break;
    }

    return this.updateData();
  };

  HioGrid.prototype.searchQueryChanged = function searchQueryChanged(value) {
    if (!!value) this.criteria.q = value;else delete this.criteria.q;
    this.criteria.offset = 0;
    return this.updateData();
  };

  HioGrid.prototype.nextPage = function nextPage() {
    if (!this.hasNextPage) return;
    this.criteria.offset = Math.min(this.criteria.offset + this.pageSize, this.pageTotal);
    return this.updateData();
  };

  HioGrid.prototype.previousPage = function previousPage() {
    if (!this.hasPreviousPage) return;
    this.criteria.offset = Math.max(0, this.criteria.offset - this.pageSize);
    return this.updateData();
  };

  HioGrid.prototype.pageSizeChanged = function pageSizeChanged(size) {
    this.pageSize = size;
    this.criteria.offset = 0;
    this.criteria.limit = this.pageSize;

    localStorage.setItem('hive:settings', JSON.stringify({ pageSize: this.pageSize }));

    return this.updateData();
  };

  _createClass(HioGrid, [{
    key: 'hasNextPage',
    get: function get() {
      return this.pageOffset + this.pageSize < this.pageTotal;
    }
  }, {
    key: 'hasPreviousPage',
    get: function get() {
      return this.pageOffset - this.pageSize >= 0;
    }
  }, {
    key: 'pageInfo',
    get: function get() {
      return {
        start: this.pageOffset + 1,
        end: Math.min(this.pageOffset + this.pageLimit, this.pageTotal) + 1,
        total: this.pageTotal
      };
    }
  }]);

  return HioGrid;
}(_aureliaTemplatingResources.AbstractRepeater), (_descriptor5 = _applyDecoratedDescriptor(_class5.prototype, 'columns', [_dec6], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, 'rows', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, 'class', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, 'options', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, 'searchQuery', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, 'pageSize', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 10;
  }
}), _applyDecoratedDescriptor(_class5.prototype, 'hasNextPage', [_dec7], Object.getOwnPropertyDescriptor(_class5.prototype, 'hasNextPage'), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, 'hasPreviousPage', [_dec8], Object.getOwnPropertyDescriptor(_class5.prototype, 'hasPreviousPage'), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, 'pageInfo', [_dec9], Object.getOwnPropertyDescriptor(_class5.prototype, 'pageInfo'), _class5.prototype)), _class5)) || _class4) || _class4);