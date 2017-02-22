import {inject} from 'aurelia-framework';
import ToolsInfo from 'resources/ToolsInfo'

@inject(ToolsInfo)
export class ToolSelection {

  constructor(toolsInfo) {
    this.toolsInfo = toolsInfo;
  }

  attached() {
    this.toolsInfo.getAvailableTools()
      .then(tools => {
        this.tools = tools;
      })
  }
}
