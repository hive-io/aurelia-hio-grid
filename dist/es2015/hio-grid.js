var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

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

import { inject, Container } from 'aurelia-dependency-injection';
import { bindable, customElement, ViewCompiler, ViewSlot } from 'aurelia-templating';
import { computedFrom, ObserverLocator } from 'aurelia-binding';
import { AbstractRepeater, RepeatStrategyLocator } from 'aurelia-templating-resources';
import { updateOneTimeBinding, overwriteArrayContents, getChildViewModels } from './grid-utilities';

export let HioGrid = (_dec = customElement('hio-grid'), _dec2 = inject(Element, Container, ViewSlot, ViewCompiler, ObserverLocator, RepeatStrategyLocator), _dec3 = computedFrom('pageOffset', 'pageSize', 'pageTotal'), _dec4 = computedFrom('pageOffset', 'pageSize', 'pageTotal'), _dec5 = computedFrom('pageOffset', 'pageSize', 'pageTotal'), _dec(_class = _dec2(_class = (_class2 = class HioGrid extends AbstractRepeater {

  constructor(element, container, viewSlot, viewCompiler, observerLocator, strategyLocator) {
    super({
      local: 'row',
      viewsRequireLifecycle: false
    });

    _initDefineProp(this, 'rows', _descriptor, this);

    _initDefineProp(this, 'class', _descriptor2, this);

    _initDefineProp(this, 'options', _descriptor3, this);

    _initDefineProp(this, 'searchQuery', _descriptor4, this);

    this.sortColumn = null;
    this.sortClass = null;
    this.pageOffset = 0;
    this.pageLimit = 0;
    this.pageTotal = 0;

    _initDefineProp(this, 'pageSize', _descriptor5, this);

    this.criteria = { offset: 0, limit: 10, order: null };
    this.columns = [];
    this.columnViewFactories = [];
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.observerLocator = observerLocator;
    this.strategyLocator = strategyLocator;
    this.scope = null;
    this.strategy = null;
    this.rowViewFactory = viewCompiler.compile('<template><slot></slot></template>');

    this.rowViewSlots = [];
  }

  attached() {
    this.columns = getChildViewModels(this.element, 'hio-grid-column');
    this.scrapeColumnViewFactories();

    $('.dropdown', this._element).dropdown();
    if (!!this.options.criteria) Object.assign(this.criteria, this.options.criteria);

    let hiveSettings = JSON.parse(localStorage.getItem('hive:settings'));
    hiveSettings = hiveSettings || {};
    if (!!hiveSettings.pageSize) {
      $('.dropdown', this._element).dropdown('set selected', hiveSettings.pageSize);
      this.pageSize = hiveSettings.pageSize;
      this.criteria.limit = hiveSettings.pageSize;
    }

    this.updateData();
  }

  parseContentRange(contentRange) {
    let tokens = contentRange.split(' ')[1].split('/');
    this.pageOffset = parseInt(tokens[0].split('-')[0], 10);
    this.pageLimit = parseInt(tokens[0].split('-')[1], 10);
    this.pageTotal = parseInt(tokens[1], 10);
  }

  updateData() {
    return this.options.service.list(this.criteria).then(response => {
      overwriteArrayContents(this.rows, response.body);
      this.parseContentRange(response.headers.get('Content-Range'));
    }).catch(err => {
      this.rows = [];
      console.log(err);
    });
  }

  bind(bindingContext, overrideContext) {
    this.scope = { bindingContext, overrideContext };

    this.rowsChanged();
  }

  unbind() {
    this.scope = null;
    this.rows = null;
    this.viewSlot.removeAll(true);
    this._stopObservation();
  }

  call(context, changes) {
    this[context](this.rows, changes);
  }

  scrapeColumnViewFactories() {
    this.columnViewFactories = [];
    for (let i = 0, ii = this.columns.length; i < ii; ++i) {
      this.columnViewFactories.push(this.columns[i].viewFactory);
    }
  }

  rowsChanged() {
    this._stopObservation();
    if (!this.scope) return;

    let rows = this.rows;
    this.strategy = this.strategyLocator.getStrategy(rows);
    this._observeCollection();
    this.strategy.instanceChanged(this, rows);
  }

  _stopObservation() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  }

  _observeCollection() {
    let rows = this.rows;
    this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, rows);

    if (this.collectionObserver) {
      this.callContext = 'handleCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  }

  handleCollectionMutated(collection, changes) {
    this.strategy.instanceMutated(this, collection, changes);
  }

  views() {
    return this.rowViewSlots;
  }
  view(index) {
    return this.rowViewSlots[index];
  }
  viewCount() {
    return this.rowViewSlots.length;
  }

  addView(bindingContext, overrideContext) {
    let rowElement = document.createElement('tr');
    this.tbody.appendChild(rowElement);
    let rowView = this.rowViewFactory.create(this.container);
    this.viewSlot.add(rowView);
    let rowViewSlot = new ViewSlot(rowElement, true);
    for (let x = 0, xx = this.columnViewFactories.length; x < xx; x++) {
      let cellViewFactory = this.columnViewFactories[x];
      let cellView = cellViewFactory.create(this.container);
      rowViewSlot.add(cellView);

      let cellElement = document.createElement('td');
      if (this.columns[x].compact === true) cellElement.classList.add('collapsing');
      rowElement.appendChild(cellElement);

      cellView.removeNodes();
      cellView.appendNodesTo(cellElement);
    }

    rowViewSlot.bind(bindingContext, overrideContext);
    this.rowViewSlots.push(rowViewSlot);
    rowViewSlot.attached();
  }

  insertView(index, bindingContext, overrideContext) {
    let rowElement = document.createElement('tr');
    let existingElement = !!this.rowViewSlots[index] && !!this.rowViewSlots[index].anchor ? this.rowViewSlots[index].anchor : null;
    this.tbody.insertBefore(rowElement, existingElement);
    let rowView = this.rowViewFactory.create(this.container);
    this.viewSlot.insert(index, rowView);
    let rowViewSlot = new ViewSlot(rowElement, true);
    for (let x = 0, xx = this.columnViewFactories.length; x < xx; x++) {
      let cellViewFactory = this.columnViewFactories[x];
      let cellView = cellViewFactory.create(this.container);
      rowViewSlot.add(cellView);

      let cellElement = document.createElement('td');
      rowElement.appendChild(cellElement);

      cellView.removeNodes();
      cellView.appendNodesTo(cellElement);
    }

    rowViewSlot.bind(bindingContext, overrideContext);
    this.rowViewSlots.splice(index, 0, rowViewSlot);
    rowViewSlot.attached();
  }

  removeAllViews() {
    let length = this.rowViewSlots.length;
    while (length--) {
      let rowViewSlot = this.rowViewSlots.pop();
      let anchor = rowViewSlot.anchor;
      let parentNode = anchor.parentNode;
      rowViewSlot.removeAll(true);
      parentNode.removeChild(anchor);
    }

    this.rowViewSlots = [];
    this.viewSlot.removeAll(true);
  }

  removeView(index) {
    let rowViewSlots = this.rowViewSlots;
    let anchor = rowViewSlots[index].anchor;
    let parentNode = anchor.parentNode;
    rowViewSlots[index].removeAll(true);
    parentNode.removeChild(anchor);
    rowViewSlots.splice(index, 1);
    this.viewSlot.removeAt(index, true);
  }

  updateBindings(view) {
    let i = view.children.length;
    while (i--) {
      let j = view.children[i].bindings.length;
      while (j--) updateOneTimeBinding(view.children[i].bindings[j]);

      j = view.children[i].controllers.length;
      while (j--) {
        let k = view.children[i].controllers[j].boundProperties.length;
        while (k--) {
          let binding = view.children[i].controllers[j].boundProperties[k].binding;
          updateOneTimeBinding(binding);
        }
      }
    }
  }

  sort(column) {
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
  }

  searchQueryChanged(value) {
    if (!!value) this.criteria.q = value;else delete this.criteria.q;
    this.criteria.offset = 0;
    return this.updateData();
  }

  get hasNextPage() {
    return this.pageOffset + this.pageSize < this.pageTotal;
  }
  nextPage() {
    if (!this.hasNextPage) return;
    this.criteria.offset = Math.min(this.criteria.offset + this.pageSize, this.pageTotal);
    return this.updateData();
  }

  get hasPreviousPage() {
    return this.pageOffset - this.pageSize >= 0;
  }
  previousPage() {
    if (!this.hasPreviousPage) return;
    this.criteria.offset = Math.max(0, this.criteria.offset - this.pageSize);
    return this.updateData();
  }

  get pageInfo() {
    return {
      start: this.pageOffset + 1,
      end: Math.min(this.pageOffset + this.pageLimit, this.pageTotal) + 1,
      total: this.pageTotal
    };
  }

  pageSizeChanged(size) {
    this.pageSize = size;
    this.criteria.offset = 0;
    this.criteria.limit = this.pageSize;

    localStorage.setItem('hive:settings', JSON.stringify({ pageSize: this.pageSize }));

    return this.updateData();
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'rows', [bindable], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'class', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'options', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'searchQuery', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'pageSize', [bindable], {
  enumerable: true,
  initializer: function () {
    return 10;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'hasNextPage', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'hasNextPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'hasPreviousPage', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'hasPreviousPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'pageInfo', [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, 'pageInfo'), _class2.prototype)), _class2)) || _class) || _class);