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
    return this.conf.tool;
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
    const oldConf = JSON.parse(JSON.stringify(this.conf));
    this.conf._id = undefined;
    this.conf._rev = undefined;
    this.conf.active = false;
    await this.setDepartmentToUserDepartment();
    await this.setPublicationToUserPublication();
    await this.setAcronymToUserAcronym();
    try {
      return this.save();
    } catch (e) {
      this.conf = oldConf;
      throw e;
    }
  }

  addConf(conf) {
    Object.assign(this.conf, conf);
    return this;
  }

  async activate() {
    this.conf.active = true;
    try {
      await this.save();
    } catch (e) {
      this.conf.active = false;
      throw e;
    }
  }

  async deactivate() {
    this.conf.active = false;
    try {
      await this.save();
    } catch (e) {
      this.conf.active = true;
      throw e;
    }
  }

  async delete() {
    this.conf._deleted = true;
    try {
      await this.save();
    } catch (e) {
      delete this.conf._deleted;
      throw e;
    }
  }

  async save() {
    if (this.isSaving === true) {
      console.log("isSaving already");
      throw new Error("isSaving");
    }
    this.isSaving = true;

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
      this.isSaving = false;
      throw response;
    }

    const body = await response.json();

    if (body.error) {
      this.isSaving = false;
      throw body;
    }

    // we get new properties as a response to the save and assign them the the conf
    this.conf = Object.assign(this.conf, body);
    this.isSaving = false;
    this.isSaved = true;
  }

  async reset() {
    if (this.id) {
      return this.load(this.id);
    }

    return true;
  }
}
