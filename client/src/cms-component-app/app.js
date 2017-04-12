import { inject, singleton } from 'aurelia-framework';
import ItemStore from 'resources/ItemStore.js';
import QTargets from 'resources/QTargets.js';
import qEnv from 'resources/qEnv.js';

@singleton()
@inject(ItemStore, QTargets)
export class App {
  constructor(itemStore, qTargets) {
    this.itemStore = itemStore;
    this.qTargets = qTargets;
    this.showSearch = true;
  }

  attached() {
    window.addEventListener('message', this.receiveMessage.bind(this));
  }

  detached() {
    window.removeEventListener('message', this.receiveMessage.unbind(this));
  }

  async receiveMessage(event) {
    this.cmsOrigin = event.origin;
    const itemConfigObject = event.data;

    try {
      const targets = await this.qTargets.get('availableTargets');
      this.target = targets.filter(target => {
        return target.key === itemConfigObject.target;
      })[0];
    } catch (e) {
      window.parent.postMessage('sent target is unknown', this.cmsOrigin);
    }

    if (itemConfigObject.id) {
      this.showSearch = false;
      this.id = itemConfigObject.id;
      this.tool = itemConfigObject.tool;
      this.loadPreview();
    } else {
      this.showSearch = true;
      this.reloadItems();
    }
  }

  unselectItem() {
    this.showSearch = true;
    this.item = undefined;
    this.id = undefined;
    window.parent.postMessage({}, this.cmsOrigin);
  }

  sendItemToLd() {
    const data = {
      id: this.id,
      tool: this.tool,
      toolRuntimeConfig: {
        displayOptions: {}
      }
    };
    window.parent.postMessage(data, this.cmsOrigin);
  }

  selectForLd(item) {
    this.id = item.conf._id;
    this.tool = item.conf.tool;
    this.sendItemToLd();
  }

  async reloadItems() {
    this.items = [];
    const tools = await this.getTools();
    const result = await this.loadItems(this.currentSearchString);

    this.items =  result.items.map(item => {
      let itemTool = tools
        .filter(tool => {
          return tool.name === item.getToolName();
        })[0];

      if (itemTool) {
        item.conf.icon = itemTool.icon;
      }
      return item;
    });

    this.bookmark = result.bookmark;
    this.updateMoreItemsAvailableState(result);

    return this.items;
  }

  async loadItems(searchString, bookmark) {
    try {
      this.itemsLoading = true;
      let numberOfItemsToLoadPerStep = 5;

      const result = await this.itemStore.getItems(searchString, numberOfItemsToLoadPerStep, undefined, bookmark);
      this.itemsLoading = false;
      return result;
    } catch (e) {
      this.messageService.push('error', 'failedLoadingItems');
    }
  }

  async loadMore() {
    const result = await this.loadItems(this.currentSearchString, this.bookmark);
    const tools = await this.getTools();

    this.items = this.items.concat(result.items);
    this.items =  this.items.map(item => {
      let itemTool = tools
        .filter(tool => {
          return tool.name === item.getToolName();
        })[0];

      if (itemTool) {
        item.conf.icon = itemTool.icon;
      }
      return item;
    });
    this.bookmark = result.bookmark;
    this.updateMoreItemsAvailableState(result);

    return this.items;
  }

  async getTools() {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const toolResponse = await fetch(`${QServerBaseUrl}/editor/tools`);
    return toolResponse.json();
  }


  updateMoreItemsAvailableState(result) {
    if (result.total_rows > this.items.length) {
      this.moreItemsAvailable = true;
    } else {
      this.moreItemsAvailable = false;
    }
  }

  redirectToItemPreview(item) {
    this.item = item.conf;
    if (this.item && this.item._id) {
      this.tool = this.item.tool;
      this.showSearch = false;
      this.id = item.conf._id;
      this.loadPreview();
    }
  }

  fetchRenderingInfo() {
    const toolRuntimeConfig = {
      size: {
        width: [
          {
            value: 290,
            comparison: '='
          }
        ]
      }
    };

    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        if (this.id) {
          return fetch(`${QServerBaseUrl}/rendering-info/${this.id}/${this.target.key}?toolRuntimeConfig=${encodeURI(JSON.stringify(toolRuntimeConfig))}`);
        }
        return {};
      })
      .then(res => {
        if (res.ok && res.status >= 200 && res.status < 400) {
          return res.json();
        }
        throw res.statusText;
      })
      .then(renderingInfo => {
        // add stylesheets for target preview if any
        if (this.target.preview && this.target.preview.stylesheets) {
          if (!renderingInfo.stylesheets) {
            renderingInfo.stylesheets = [];
          }
          this.target.preview.stylesheets.forEach(stylesheet => {
            renderingInfo.stylesheets.push(stylesheet);
          });
        }

        // add scripts for target preview if any
        if (this.target.preview && this.target.preview.scripts) {
          if (!renderingInfo.scripts) {
            renderingInfo.scripts = [];
          }
          this.target.preview.scripts.forEach(script => {
            renderingInfo.scripts.push(script);
          });
        }
        return renderingInfo;
      });
  }

  loadPreview() {
    this.fetchRenderingInfo()
      .then(renderingInfo => {
        this.errorMessage = undefined;
        this.renderingInfo = renderingInfo;
      })
      .catch(errorMessage => {
        this.errorMessage = errorMessage;
        this.renderingInfo = {};
      });
  }
}
