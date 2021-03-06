import {
  createOverrideContext,
  BindingBehavior,
  ValueConverter,
  sourceContext,
  bindingMode
} from 'aurelia-framework';
import {
  inject,
  Container
} from 'aurelia-dependency-injection';
import {
  bindable,
  customElement,
  noView,
  processContent,
  ViewCompiler,
  ViewSlot
} from 'aurelia-templating';
import {
  computedFrom,
  ObserverLocator
} from 'aurelia-binding';
import {
  AbstractRepeater,
  RepeatStrategyLocator
} from 'aurelia-templating-resources';

/**
* Update the override context.
* @param startIndex index in collection where to start updating.
*/
export declare function updateOverrideContexts(views?: any, startIndex?: any): any;

/**
  * Creates a complete override context.
  * @param data The item's value.
  * @param index The item's index.
  * @param length The collections total length.
  * @param key The key in a key/value pair.
  */
export declare function createFullOverrideContext(repeat?: any, data?: any, index?: any, length?: any, key?: any): any;

/**
* Updates the override context.
* @param context The context to be updated.
* @param index The context's index.
* @param length The collection's length.
*/
export declare function updateOverrideContext(overrideContext?: any, index?: any, length?: any): any;

/**
* Gets a repeat instruction's source expression.
*/
export declare function getItemsSourceExpression(instruction?: any, attrName?: any): any;

/**
* Unwraps an expression to expose the inner, pre-converted / behavior-free expression.
*/
export declare function unwrapExpression(expression?: any): any;

/**
* Returns whether an expression has the OneTimeBindingBehavior applied.
*/
export declare function isOneTime(expression?: any): any;

/**
* Forces a binding instance to reevaluate.
*/
export declare function updateOneTimeBinding(binding?: any): any;

/**
 * Overwrites array `dst` contents with `src`
 */
export declare function overwriteArrayContents(dst?: any, src?: any): any;

/**
 * A replacement for @children, since there are timing issues there
 */
export declare function getChildViewModels(element?: any, cssSelector?: any): any;
export declare class HioGridColumn {
  header: any;
  field: any;
  compact: any;
  sortable: any;
  constructor(element?: any, viewCompiler?: any);
}
export declare class HioGrid extends AbstractRepeater {
  rows: any;
  class: any;
  options: any;
  searchQuery: any;
  
  // sorting
  sortColumn: any;
  sortClass: any;
  
  // pagination
  pageOffset: any;
  pageLimit: any;
  pageTotal: any;
  pageSize: any;
  criteria: any;
  columns: any;
  columnViewFactories: any;
  constructor(element?: any, container?: any, viewSlot?: any, viewCompiler?: any, observerLocator?: any, strategyLocator?: any);
  attached(): any;
  parseContentRange(contentRange?: any): any;
  updateData(): any;
  
  // life-cycle business
  bind(bindingContext?: any, overrideContext?: any): any;
  unbind(): any;
  call(context?: any, changes?: any): any;
  
  // view related
  scrapeColumnViewFactories(): any;
  rowsChanged(): any;
  handleCollectionMutated(collection?: any, changes?: any): any;
  
  // @override AbstractRepeater
  views(): any;
  view(index?: any): any;
  viewCount(): any;
  addView(bindingContext?: any, overrideContext?: any): any;
  insertView(index?: any, bindingContext?: any, overrideContext?: any): any;
  removeAllViews(): any;
  removeView(index?: any): any;
  updateBindings(view?: any): any;
  
  // SORTING, SEARCH AND PAGINATION
  sort(column?: any): any;
  searchQueryChanged(value?: any): any;
  hasNextPage: any;
  nextPage(): any;
  hasPreviousPage: any;
  previousPage(): any;
  pageInfo: any;
  pageSizeChanged(size?: any): any;
}