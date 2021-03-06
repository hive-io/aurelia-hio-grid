import {createOverrideContext,BindingBehavior,ValueConverter,sourceContext,bindingMode} from 'aurelia-framework';
import {inject,Container} from 'aurelia-dependency-injection';
import {bindable,customElement,noView,processContent,ViewCompiler,ViewSlot} from 'aurelia-templating';
import {computedFrom,ObserverLocator} from 'aurelia-binding';
import {AbstractRepeater,RepeatStrategyLocator} from 'aurelia-templating-resources';

const oneTime = bindingMode.oneTime;

/**
* Update the override context.
* @param startIndex index in collection where to start updating.
*/
export function updateOverrideContexts(views, startIndex) {
  let length = views.length;

  if (startIndex > 0) {
    startIndex = startIndex - 1;
  }

  for (; startIndex < length; ++startIndex) {
    updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
  }
}

/**
  * Creates a complete override context.
  * @param data The item's value.
  * @param index The item's index.
  * @param length The collections total length.
  * @param key The key in a key/value pair.
  */
export function createFullOverrideContext(repeat, data, index, length, key) {
  let bindingContext = {};
  let overrideContext = createOverrideContext(bindingContext, repeat.scope.overrideContext);
  // is key/value pair (Map)
  if (typeof key !== 'undefined') {
    bindingContext[repeat.key] = key;
    bindingContext[repeat.value] = data;
  } else {
    bindingContext[repeat.local] = data;
  }
  updateOverrideContext(overrideContext, index, length);
  return overrideContext;
}

/**
* Updates the override context.
* @param context The context to be updated.
* @param index The context's index.
* @param length The collection's length.
*/
export function updateOverrideContext(overrideContext, index, length) {
  let first = (index === 0);
  let last = (index === length - 1);
  let even = index % 2 === 0;

  overrideContext.$index = index;
  overrideContext.$first = first;
  overrideContext.$last = last;
  overrideContext.$middle = !(first || last);
  overrideContext.$odd = !even;
  overrideContext.$even = even;
}

/**
* Gets a repeat instruction's source expression.
*/
export function getItemsSourceExpression(instruction, attrName) {
  return instruction.behaviorInstructions
    .filter(bi => bi.originalAttrName === attrName)[0]
    .attributes
    .items
    .sourceExpression;
}

/**
* Unwraps an expression to expose the inner, pre-converted / behavior-free expression.
*/
export function unwrapExpression(expression) {
  let unwrapped = false;
  while (expression instanceof BindingBehavior) {
    expression = expression.expression;
  }
  while (expression instanceof ValueConverter) {
    expression = expression.expression;
    unwrapped = true;
  }
  return unwrapped ? expression : null;
}

/**
* Returns whether an expression has the OneTimeBindingBehavior applied.
*/
export function isOneTime(expression) {
  while (expression instanceof BindingBehavior) {
    if (expression.name === 'oneTime') {
      return true;
    }
    expression = expression.expression;
  }
  return false;
}

/**
* Forces a binding instance to reevaluate.
*/
export function updateOneTimeBinding(binding) {
  if (binding.call && binding.mode === oneTime) {
    binding.call(sourceContext);
  } else if (binding.updateOneTimeBindings) {
    binding.updateOneTimeBindings();
  }
}

/**
 * Overwrites array `dst` contents with `src`
 */
export function overwriteArrayContents(dst, src) {
  let i;
  for (i = 0; i < Math.min(src.length, dst.length); i++) {
    Object.assign(dst[i], src[i]);
  }

  for (; i < src.length; i++) dst.push(src[i]);
  while (i < dst.length) dst.pop();
}

/**
 * A replacement for @children, since there are timing issues there
 */
export function getChildViewModels(element, cssSelector) {
  let elements = $(element).children(cssSelector);
  let viewModels = [];
  elements.each((index, elem) => {
    if (elem.au && elem.au.controller) {
      viewModels.push(elem.au.controller.viewModel);
    } else {
      throw new Error(`au property not found on element ${elem.tagName}. Did you load this custom element via <require> or via main.js?`);
    }
  });

  return viewModels;
}

@noView
@processContent(false)
@customElement('hio-grid-column')
@inject(Element, ViewCompiler)
export class HioGridColumn {
  @bindable header
  @bindable field
  @bindable compact
  @bindable sortable

  constructor(element, viewCompiler) {
    let field = (element.attributes.hasOwnProperty('field')) ?
      element.attributes.field.nodeValue : null;
    this.viewFactory = null;
    if (element.innerHTML.trim() !== '') {
      let template = `<template>${element.innerHTML}</template>`;
      this.viewFactory = viewCompiler.compile(template);
      element.innerHTML = '';
    } else if (!!field) {
      let template = '<template>${row.' + field + '}</template>';
      this.viewFactory = viewCompiler.compile(template);
    }
  }
}

@customElement('hio-grid')
@inject(Element, Container, ViewSlot, ViewCompiler, ObserverLocator, RepeatStrategyLocator)
export class HioGrid extends AbstractRepeater {
  @bindable rows = [];
  @bindable class;
  @bindable options;
  @bindable searchQuery;

  // sorting
  sortColumn = null;
  sortClass = null;

  // pagination
  pageOffset = 0;
  pageLimit = 0;
  pageTotal = 0;
  @bindable pageSize = 10;

  criteria = { offset: 0, limit: 10, order: null };
  columns = [];
  columnViewFactories = [];

  constructor(element, container, viewSlot, viewCompiler, observerLocator, strategyLocator) {
    super({
      local: 'row',
      viewsRequireLifecycle: false
    });

    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.observerLocator = observerLocator;
    this.strategyLocator = strategyLocator;
    this.scope = null;
    this.strategy = null;
    this.rowViewFactory =
      viewCompiler.compile('<template><slot></slot></template>');

    this.rowViewSlots = [];
  }

  attached() {
    this.columns = getChildViewModels(this.element, 'hio-grid-column');
    this.scrapeColumnViewFactories();

    $('.dropdown', this._element).dropdown();
    if (!!this.options.criteria) Object.assign(this.criteria, this.options.criteria);

    // @todo: in the future this should be a class that can handle multi-page settings
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
    return this.options.service.list(this.criteria)
      .then(response => {
        overwriteArrayContents(this.rows, response.body);
        this.parseContentRange(response.headers.get('Content-Range'));
      })
      .catch(err => {
        this.rows = [];
        console.log(err);
      });
  }

  // life-cycle business
  bind(bindingContext, overrideContext) {
    this.scope = { bindingContext, overrideContext };
    // this.scrapeColumnViewFactories();
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

  // view related
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

  // collection observation
  _stopObservation() {
    if (this.collectionObserver) {
      this.collectionObserver.unsubscribe(this.callContext, this);
      this.collectionObserver = null;
      this.callContext = null;
    }
  }

  _observeCollection() {
    let rows = this.rows;
    this.collectionObserver =
      this.strategy.getCollectionObserver(this.observerLocator, rows);

    if (this.collectionObserver) {
      this.callContext = 'handleCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
    }
  }

  handleCollectionMutated(collection, changes) {
    this.strategy.instanceMutated(this, collection, changes);
  }

  // @override AbstractRepeater
  views() { return this.rowViewSlots; }
  view(index) { return this.rowViewSlots[index]; }
  viewCount() { return this.rowViewSlots.length; }

  addView(bindingContext, overrideContext) {
    // console.log('addView(bctx= ', bindingContext, ')');
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

      // move the view to the `td` element
      cellView.removeNodes();
      cellView.appendNodesTo(cellElement);
    }

    rowViewSlot.bind(bindingContext, overrideContext);
    this.rowViewSlots.push(rowViewSlot);
    rowViewSlot.attached();
  }

  insertView(index, bindingContext, overrideContext) {
    // console.log('insertView(index=', index, ', bctx= ', bindingContext, ')');
    let rowElement = document.createElement('tr');
    let existingElement =
      (!!this.rowViewSlots[index] && !!this.rowViewSlots[index].anchor) ?
      this.rowViewSlots[index].anchor : null;
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

      // move the view to the `td` element
      cellView.removeNodes();
      cellView.appendNodesTo(cellElement);
    }

    rowViewSlot.bind(bindingContext, overrideContext);
    this.rowViewSlots.splice(index, 0, rowViewSlot);
    rowViewSlot.attached();
  }

  removeAllViews() {
    // console.log('removeAllViews()');
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
    // console.log('removeView(index=', index, ')');
    let rowViewSlots = this.rowViewSlots;
    let anchor = rowViewSlots[index].anchor;
    let parentNode = anchor.parentNode;
    rowViewSlots[index].removeAll(true);
    parentNode.removeChild(anchor);
    rowViewSlots.splice(index, 1);
    this.viewSlot.removeAt(index, true);
  }

  updateBindings(view) {
    // console.log('updateBindings(view=', view, ')');
    let i = view.children.length;
    while (i--) {
      let j = view.children[i].bindings.length;
      while (j--) updateOneTimeBinding(view.children[i].bindings[j]);

      j = view.children[i].controllers.length;
      while (j--) {
        let k = view.children[i].controllers[j].boundProperties.length;
        while (k--) {
          let binding =
            view.children[i].controllers[j].boundProperties[k].binding;
          updateOneTimeBinding(binding);
        }
      }
    }
  }

  // SORTING, SEARCH AND PAGINATION
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
    if (!!value) this.criteria.q = value;
    else delete this.criteria.q;
    this.criteria.offset = 0;
    return this.updateData();
  }

  @computedFrom('pageOffset', 'pageSize', 'pageTotal')
  get hasNextPage() { return this.pageOffset + this.pageSize < this.pageTotal; }
  nextPage() {
    if (!this.hasNextPage) return;
    this.criteria.offset = Math.min(this.criteria.offset + this.pageSize, this.pageTotal);
    return this.updateData();
  }

  @computedFrom('pageOffset', 'pageSize', 'pageTotal')
  get hasPreviousPage() { return this.pageOffset - this.pageSize >= 0; }
  previousPage() {
    if (!this.hasPreviousPage) return;
    this.criteria.offset = Math.max(0, this.criteria.offset - this.pageSize);
    return this.updateData();
  }

  @computedFrom('pageOffset', 'pageSize', 'pageTotal')
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

    // @todo: eventually use a HiveSettings class
    localStorage.setItem('hive:settings', JSON.stringify({ pageSize: this.pageSize }));

    return this.updateData();
  }
}
