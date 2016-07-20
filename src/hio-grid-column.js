import {inject} from 'aurelia-dependency-injection';
import {
  bindable,
  customElement,
  noView,
  processContent,
  ViewCompiler
} from 'aurelia-templating';

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
