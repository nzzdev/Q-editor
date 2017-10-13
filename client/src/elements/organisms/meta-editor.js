import { inject, bindable } from 'aurelia-framework';
import QConfig from 'resources/QConfig';

@inject(QConfig)
export class MetaEditor {

  @bindable data

  constructor(qConfig, qTargets) {
    qConfig.get('departments')
      .then(departments => {
        this.departments = departments.sort();
      });

    qConfig.get('publications')
      .then(publications => {
        this.publications = publications;
      });
  }

}
