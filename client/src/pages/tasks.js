import { inject } from "aurelia-framework";
import qEnv from "resources/qEnv.js";

@inject()
export default class Tasks {
  constructor() {}
  tasks = [];
  selectedTask = {};
  output = [];
  taskInput = {};
  displaySchemaEditor = false;

  async activate() {
    this.getTasks();
  }

  loadTask(selectedTask) {
    this.selectedTask = selectedTask;
    this.displaySchemaEditor = true;
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
      .then(renderingInfo => {
        this.output = renderingInfo;
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
      .then(response => {
        this.tasks = response.tasks;
      });
  }
}
