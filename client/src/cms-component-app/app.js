import { inject, singleton } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import ItemStore from 'resources/ItemStore.js';
import QTargets from 'resources/QTargets.js';
import qEnv from 'resources/qEnv.js';

@singleton()
@inject(ItemStore, QTargets, I18N)
export class App {

  constructor(itemStore, qTargets, i18n) {
    this.itemStore = itemStore;
    this.qTargets = qTargets;
    this.i18n = i18n;
    this.showSearch = true;
    this.previewWidth = 290;
    // just for testing purposes:
    this.givenTarget = 'demo1';
  }

  activate() {
    const query = /params=(.*)&?/.exec(window.location.search);
    try {
      const data = JSON.parse(decodeURIComponent(query[1]));
      if (data.id) {
        this.id = data.id;
      }
      if (data.toolRuntimeConfig && data.toolRuntimeConfig.hasOwnProperty('displayOptions')) {
        this.displayOptions = data.toolRuntimeConfig.displayOptions;
      }
    } catch (e) {
      // nevermind an error here, if there is no valid config, we handle it like there is none at all
    }
  }

  async attached() {
    await this.loadTarget();
    await this.reloadItems();
    this.loadView();
  }

  change() {
    this.loadPreview();
  }

  async loadTarget() {
    try {
      const targets = await this.qTargets.get('availableTargets');
      this.target = targets.filter(target => {
        return target.key === this.givenTarget;
      })[0];
    } catch (e) {
      //
    }
  }

  async loadView() {
    if (this.id) {
      this.selectedItem = this.items
        .filter(item => {
          return item.id === this.id;
        })[0];

      this.loadPreview();
      this.loadDisplayOptions();
    }
  }

  insertItem() {
    // delete all displayOptions set to false
    Object.keys(this.displayOptions).forEach(displayOption => {
      if (!this.displayOptions[displayOption]) {
        delete this.displayOptions[displayOption];
      }
    });

    const data = {
      id: this.selectedItem.conf._id,
      tool: this.selectedItem.conf.tool,
      toolRuntimeConfig: {
        displayOptions: this.displayOptions
      }
    };
    window.parent.postMessage(data, '*');
  }

  selectItem(selectedItemId) {
    this.id = selectedItemId;
    this.displayOptions = {};
    this.loadView();
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
      let numberOfItemsToLoadPerStep = 6;

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

  fetchRenderingInfo() {
    const toolRuntimeConfig = {
      size: {
        width: [
          {
            value: this.previewContainer.getBoundingClientRect().width,
            comparison: '='
          }
        ]
      },
      displayOptions: this.displayOptions
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

  loadDisplayOptions() {
    qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        if (this.selectedItem && this.selectedItem.conf.tool) {
          const tool = this.selectedItem.conf.tool;
          return fetch(`${QServerBaseUrl}/tools/${tool}/display-options-schema.json`);
        }
        throw new Error('no tool defined');
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(schema => {
        if (schema.hasOwnProperty('properties')) {
          // we just accept one object containing simple boolean type properties
          Object.keys(schema.properties).forEach(propertyName => {
            // maybe delete all non boolean properties here??
            let displayOption = schema.properties[propertyName];
            if (displayOption.title) {
              schema.properties[propertyName].title = this.i18n.tr(`${this.tool}:${displayOption.title}`);
            }
          });
        }
        this.optionKeys = Object.keys(schema.properties);
        this.displayOptionsSchema = schema;

        if (!this.displayOptions) {
          this.displayOptions = {};
          this.optionKeys.forEach(optionKey => {
            this.displayOptions[optionKey] = false;
          });
        }
      });
  }
}
