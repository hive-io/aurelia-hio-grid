'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateOverrideContexts = updateOverrideContexts;
exports.createFullOverrideContext = createFullOverrideContext;
exports.updateOverrideContext = updateOverrideContext;
exports.getItemsSourceExpression = getItemsSourceExpression;
exports.unwrapExpression = unwrapExpression;
exports.isOneTime = isOneTime;
exports.updateOneTimeBinding = updateOneTimeBinding;
exports.overwriteArrayContents = overwriteArrayContents;
exports.getChildViewModels = getChildViewModels;

var _aureliaFramework = require('aurelia-framework');

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

function getChildViewModels(element, cssSelector) {
  var elements = $(element).children(cssSelector);
  var viewModels = [];
  elements.each(function (index, elem) {
    if (elem.au && elem.au.controller) {
      viewModels.push(elem.au.controller.viewModel);
    } else {
      throw new Error('au property not found on element ' + elem.tagName + '. Did you load this custom element via <require> or via main.js?');
    }
  });

  return viewModels;
}