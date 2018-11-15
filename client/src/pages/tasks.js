import { inject } from "aurelia-framework";
import qEnv from "resources/qEnv.js";

@inject()
export default class Tasks {
  constructor() {}
  tasks = [];
  selectedTask = {};
  output = [];
  taskInput = {
    selectedItemId: ""
  };
  renderingInfoTask = {};

  async activate() {
    // get all tasks
    this.renderingInfoTask = {
      name: "Rendering Info",
      endpoint: "tasks/renderingInfo",
      schema: {
        input: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "string"
        },
        output: {}
      }
    };
    this.tasks.push(this.renderingInfoTask);
  }

  loadTask(selectedTask) {
    this.selectedTask = selectedTask;
  }

  executeTask() {
    return qEnv.QServerBaseUrl.then(QServerBaseUrl => {
      return fetch(
        `${QServerBaseUrl}/${this.selectedTask.endpoint}/${
          this.taskInput.selectedItemId
        }`
      );
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

  handleChange() {
    console.log("test");
  }
}
