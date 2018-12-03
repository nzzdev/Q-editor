import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import qEnv from "resources/qEnv.js";

@inject(HttpClient)
export default class Tasks {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  tasks = [];
  selectedTask = {};
  output = [];
  taskInput = {};

  async activate(routeParams) {
    this.tasks = await this.getTasks();
    if (routeParams.hasOwnProperty("id") && routeParams.id !== undefined) {
      this.selectedTask = this.tasks.find(
        element => element.id === routeParams.id
      );
    }
  }

  async executeTask() {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await this.httpClient.fetch(
      `${QServerBaseUrl}${this.selectedTask.route.path}`,
      {
        method: "POST",
        body: JSON.stringify(this.taskInput),
        credentials: "include"
      }
    );
    if (!response.ok || response.status >= 400) {
      return;
    }
    this.output = await response.json();
  }

  async getTasks() {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await this.httpClient.fetch(`${QServerBaseUrl}/tasks`, {
      credentials: "include"
    });
    if (!response.ok || response.status >= 400) {
      return;
    }
    const json = await response.json();
    return json.tasks;
  }
}
