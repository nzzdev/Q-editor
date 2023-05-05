import { inject, LogManager } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import qEnv from "resources/qEnv.js";

const log = LogManager.getLogger("Q");

@inject(HttpClient)
export default class User {
  changeCallbacks = [];

  constructor(httpClient) {
    this.httpClient = httpClient;
    this.isLoggedIn = false;
    this.loaded = this.load;
  }

  async load(headers) {
    console.log("load")
    console.log(headers)
    try {
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      const response = await this.httpClient.fetch(`${QServerBaseUrl}/user`, {
        headers
      });

      console.log("user", response)
      if (!response.ok) {
        throw response;
      }

      this.data = await response.json();
      return true;
    } catch (e) {
      console.log("EE" , e)
      this.data = null;
    } finally {
      this.setLoggedInState();
      return true;
    }
  }

  setLoggedInState() {
    this.isLoggedIn = this.data && this.data.username;
  }

  setUserConfig(key, value) {
    if (!this.data.hasOwnProperty("config") || !this.data.config) {
      this.data.config = {};
    }
    this.data.config[key] = value;
    this.save();
  }

  getUserConfig(key, defaultValue = undefined) {
    if (!this.data) {
      this.data = {};
    }
    if (!this.data.hasOwnProperty("config") || !this.data.config) {
      this.data.config = {};
    }
    if (
      (!this.data.config.hasOwnProperty(key) ||
        this.data.config[key] === undefined) &&
      defaultValue !== undefined
    ) {
      this.data.config[key] = defaultValue;
    }
    if (this.data && this.data.config && this.data.config[key]) {
      return this.data.config[key];
    }
    return undefined;
  }

  get roles() {
    if (!this.data || !this.data.hasOwnProperty("roles")) {
      return null;
    }
    return this.data.roles;
  }

  get username() {
    if (!this.data || !this.data.hasOwnProperty("username")) {
      return null;
    }
    return this.data.username;
  }

  async save() {
    try {
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      const response = await this.httpClient.fetch(`${QServerBaseUrl}/user`, {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify(this.data),
      });

      if (!response.ok) {
        throw response;
      }
      try {
        for (let cb of this.changeCallbacks) {
          cb();
        }
      } catch (e) {
        log.error("failed to call user change callback", e);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  registerChangeCallback(cb) {
    this.changeCallbacks.push(cb);
  }

  unregisterChangeCallback(cb) {
    const index = this.changeCallbacks.indexOf(cb);
    if (index > -1) {
      this.changeCallbacks.splice(index, 1);
    }
  }
}
