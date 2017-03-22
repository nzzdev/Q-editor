import { valueConverter } from 'aurelia-framework';

@valueConverter('dotNotationProperty')
export class DotNotationPropertyValueConverter {

  toView(value, params) {
    return 'test';
  }

}
