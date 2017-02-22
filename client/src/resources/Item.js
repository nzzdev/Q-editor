import qEnv from 'resources/qEnv.js';

export default class Item {

  conf = {};

  changeCallbacks = [];

  isSaved = true;

  constructor(user) {
    this.user = user;
  }

  get id() {
    return this.conf._id;
  }

  set id(id) {
    this.conf._id = id;
  }

  getToolName() {
    return this.conf.tool.replace(new RegExp('-','g'), '_');
  }

  changed() {
    this.isSaved = false;
  }

  setDepartmentToUserDepartment() {
    return this.user.loaded
      .then(() => {
        this.conf.department = this.user.data.department;
      })
  }

  load(id) {
    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/item/${id}`)
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(doc => {
        this.conf = Object.assign(this.conf, doc);
        return this;
      })
  }

  blueprint() {
    this.conf._id = undefined;
    this.conf._rev = undefined;
    this.conf.active = false;
    return this.setDepartmentToUserDepartment()
      .then(() => {
        return this.save();
      });
  }

  addConf(conf) {
    Object.assign(this.conf, conf);
    return this;
  }

  activate() {
    this.conf.active = true;
    return this.save();
  }

  deactivate() {
    this.conf.active = false;
    return this.save();
  }

  delete() {
    this.conf._deleted = true;
    return this.save();
  }

  save() {
    let method = 'POST';
    if (this.id) {
      method = 'PUT';
    }

    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/item`, {
          method: method,
          credentials: 'include',
          body: JSON.stringify(this.conf)
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw response
        }
      })
      .then(newItemProperties => {
        // we get the changed properties back from Q Server and apply them here
        // this could include: _id, _rev, activateDate, deactivateDate, createdBy, updatedBy
        this.conf = Object.assign(this.conf, newItemProperties);
        this.isSaved = true;
      })
  }

}
