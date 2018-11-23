import { inject } from "aurelia-framework";
import qEnv from "resources/qEnv.js";

@inject()
export default class Tasks {
  constructor() {}
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

  executeTask() {
    return qEnv.QServerBaseUrl.then(QServerBaseUrl => {
      return fetch(`${QServerBaseUrl}/${this.selectedTask.endpoint}`, {
        method: "POST",
        body: JSON.stringify(this.taskInput)
      });
    })
      .then(res => {
        if (res.ok && res.status >= 200 && res.status < 400) {
          return res.json();
        }
        throw res;
      })
      .then(output => {
        this.output = output;
      });
  }

  getTasks() {
    return qEnv.QServerBaseUrl.then(QServerBaseUrl => {
      return fetch(`${QServerBaseUrl}/tasks`);
    })
      .then(res => {
        if (res.ok && res.status >= 200 && res.status < 400) {
          return res.json();
        }
        throw res;
      })
      .then(response => response.tasks);
  }
}
