import {HioGrid} from './hio-grid';
import {HioGridColumn} from './hio-grid-column';

export function configure(aurelia) {
  aurelia.globalResources(
    './hio-grid',
    './hio-grid-column'
  );
}

export { HioGrid, HioGridColumn };
