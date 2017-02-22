import { inject, bindable } from 'aurelia-framework';
import QConfig from 'resources/QConfig';

@inject(QConfig)
export class MetaEditor {

  @bindable data

  constructor(qConfig) {
    qConfig.get('departments')
      .then(departments => {
        this.departments = departments.sort();
      })
  }

}
