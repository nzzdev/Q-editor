import { bindable, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import User from 'resources/User';
import ToolsInfo from 'resources/ToolsInfo';

import DragDataGenerator from 'resources/DragDataGenerator';


@inject(Element, ToolsInfo, User, DragDataGenerator, Router)
export class ItemListEntry {

  @bindable item

  constructor(element, toolsInfo, user, dragDataGenerator, router) {
    this.element           = element;
    this.toolsInfo         = toolsInfo;
    this.user              = user;
    this.dragDataGenerator = dragDataGenerator;
    this.router            = router;
  }

  attached() {
    this.setupDragHandlers();
  }

  setupDragHandlers() {
    this.element.addEventListener('dragstart', event => {
      this.dragDataGenerator.addDragDataToDataTransfer(event.dataTransfer, this.item);
    });
  }

  itemChanged() {
    this.toolsInfo.getAvailableTools()
      .then(tools => {
        let itemTool = tools
          .filter(tool => {
            return tool.name === this.item.getToolName();
          })[0];

        if (itemTool) {
          this.iconSvg = itemTool.icon;
        }
      });
  }

  redirectToItemView() {
    this.router.navigateToRoute('item', {id: this.item.id});
  }

  deleteItem() {
    this.item.delete()
      .then(() => {
        this.element.addEventListener('transitionend', () => {
          this.element.parentNode.removeChild(this.element);
        });
        this.element.style.transform = 'scale(0)';
      });
  }

}
