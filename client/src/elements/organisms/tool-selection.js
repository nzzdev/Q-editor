import {inject} from 'aurelia-framework';
import ToolsInfo from 'resources/ToolsInfo';

@inject(ToolsInfo)
export class ToolSelection {

  constructor(toolsInfo) {
    this.toolsInfo = toolsInfo;
  }

  async attached() {
    this.tools = await this.toolsInfo.getAvailableTools();
  }
}
