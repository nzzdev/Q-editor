import { valueConverter } from 'aurelia-framework';

@valueConverter('keys')
export class KeysValueConverter {
  toView(obj){
    return Reflect.ownKeys(obj);
  }
}
