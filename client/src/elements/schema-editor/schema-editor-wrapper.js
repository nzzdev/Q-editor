import { bindable } from 'aurelia-framework';
import { getType, getOptions} from './helpers';

export class SchemaEditorWrapper {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

  constructor() {
    this.getType = getType;
    this.getOptions = getOptions;
  }

}
