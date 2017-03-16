import { valueConverter } from 'aurelia-framework';

@valueConverter('forceNumber')
export class ForceNumberValueConverter {

  fromView(value){
    if (!value || value === '') {
      return undefined;
    }
    return Number(value);
  }

}
