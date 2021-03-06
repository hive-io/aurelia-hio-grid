import { createOverrideContext, BindingBehavior, ValueConverter, sourceContext, bindingMode } from 'aurelia-framework';

const oneTime = bindingMode.oneTime;

export function updateOverrideContexts(views, startIndex) {
  let length = views.length;

  if (startIndex > 0) {
    startIndex = startIndex - 1;
  }

  for (; startIndex < length; ++startIndex) {
    updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
  }
}

export function createFullOverrideContext(repeat, data, index, length, key) {
  let bindingContext = {};
  let overrideContext = createOverrideContext(bindingContext, repeat.scope.overrideContext);

  if (typeof key !== 'undefined') {
    bindingContext[repeat.key] = key;
    bindingContext[repeat.value] = data;
  } else {
    bindingContext[repeat.local] = data;
  }
  updateOverrideContext(overrideContext, index, length);
  return overrideContext;
}

export function updateOverrideContext(overrideContext, index, length) {
  let first = index === 0;
  let last = index === length - 1;
  let even = index % 2 === 0;

  overrideContext.$index = index;
  overrideContext.$first = first;
  overrideContext.$last = last;
  overrideContext.$middle = !(first || last);
  overrideContext.$odd = !even;
  overrideContext.$even = even;
}

export function getItemsSourceExpression(instruction, attrName) {
  return instruction.behaviorInstructions.filter(bi => bi.originalAttrName === attrName)[0].attributes.items.sourceExpression;
}

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

export function isOneTime(expression) {
  while (expression instanceof BindingBehavior) {
    if (expression.name === 'oneTime') {
      return true;
    }
    expression = expression.expression;
  }
  return false;
}

export function updateOneTimeBinding(binding) {
  if (binding.call && binding.mode === oneTime) {
    binding.call(sourceContext);
  } else if (binding.updateOneTimeBindings) {
    binding.updateOneTimeBindings();
  }
}

export function overwriteArrayContents(dst, src) {
  let i;
  for (i = 0; i < Math.min(src.length, dst.length); i++) {
    Object.assign(dst[i], src[i]);
  }

  for (; i < src.length; i++) dst.push(src[i]);
  while (i < dst.length) dst.pop();
}

export function getChildViewModels(element, cssSelector) {
  let elements = $(element).children(cssSelector);
  let viewModels = [];
  elements.each((index, elem) => {
    if (elem.au && elem.au.controller) {
      viewModels.push(elem.au.controller.viewModel);
    } else {
      throw new Error(`au property not found on element ${ elem.tagName }. Did you load this custom element via <require> or via main.js?`);
    }
  });

  return viewModels;
}