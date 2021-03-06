'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HioGridColumn = undefined;

var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

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

var HioGridColumn = exports.HioGridColumn = (_dec = (0, _aureliaTemplating.processContent)(false), _dec2 = (0, _aureliaTemplating.customElement)('hio-grid-column'), _dec3 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaTemplating.ViewCompiler), (0, _aureliaTemplating.noView)(_class = _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function HioGridColumn(element, viewCompiler) {
  

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