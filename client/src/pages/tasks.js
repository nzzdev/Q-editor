import { inject } from "aurelia-framework";

@inject()
export default class Tasks {
  constructor() {}
  tasks = [];
  renderingInfoTask = {
    name: "Rendering Info",
    loadTask: function() {
      console.log("up and running");
    }
  };

  async activate() {
    this.tasks.push(this.renderingInfoTask);
  }

  executeTask(task) {
    task.loadTask();
  }
}
