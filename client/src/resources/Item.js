import qEnv from "resources/qEnv.js";

export default class Item {
  conf = {};

  changeCallbacks = [];

  isSaved = true;

  constructor(user, httpClient) {
    this.user = user;
    this.httpClient = httpClient;
  }

  get id() {
    return this.conf._id;
  }

  set id(id) {
    this.conf._id = id;
  }

  getToolName() {
    // this is used because we have legacy tool names with - which is not supported in Q server config
    return this.conf.tool.replace(new RegExp("-", "g"), "_");
  }

  changed() {
    this.isSaved = false;
  }

  async setDepartmentToUserDepartment() {
    await this.user.loaded;
    this.conf.department = this.user.data.department;
  }

  async setPublicationToUserPublication() {
    await this.user.loaded;
    if (this.user.data.publication) {
      this.conf.publication = this.user.data.publication;
    }
  }

  async setAcronymToUserAcronym() {
    await this.user.loaded;
    this.conf.acronym = this.user.data.acronym;
  }

  async load(id) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    const response = await this.httpClient.fetch(
      `${QServerBaseUrl}/item/${id}`
    );

    if (!response.ok) {
      throw response;
    }

    const doc = await response.json();
    this.conf = Object.assign(this.conf, doc);
  }

  async blueprint() {
    this.conf._id = undefined;
    this.conf._rev = undefined;
    this.conf.active = false;
    await this.setDepartmentToUserDepartment();
    await this.setPublicationToUserPublication();
    await this.setAcronymToUserAcronym();
    return this.save();
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

  async save() {
    // per default we use POST to store a new item
    let method = "POST";

    // if we already have an id, we use PUT to update the item
    if (this.id) {
      method = "PUT";
    }

    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await this.httpClient.fetch(`${QServerBaseUrl}/item`, {
      method: method,
      credentials: "include",
      body: JSON.stringify(this.conf)
    });

    if (!response.ok) {
      throw response;
    }

    const body = await response.json();

    if (body.error) {
      throw body;
    }

    // we get new properties as a response to the save and assign them the the conf
    this.conf = Object.assign(this.conf, body);
    this.isSaved = true;
  }

  async reset() {
    if (this.id) {
      return this.load(this.id);
    }

    return true;
  }
}
