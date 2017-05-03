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
  }

  activate() {
    this.selectedItems = [];

    const paramsQuery = /params=(.*)&?/.exec(window.location.search);
    const targetQuery = /target=([^&]*)/.exec(window.location.search);

    try {
      this.selectedItem = JSON.parse(decodeURIComponent(paramsQuery[1]));
      this.selectedItems.push(this.selectedItem);
    } catch (e) {
      // nevermind an error here, if there is no valid config, we handle it like there is none at all
    }

    try {
      this.targetKey = decodeURIComponent(targetQuery[1]);
    } catch (e) {
      // nevermind for the moment - return error message of missing target later on
    }
  }

  async attached() {
    await this.loadTarget();
    await this.reloadItems();
    this.loadView();
  }

  async loadTarget() {
    try {
      const targets = await this.qTargets.get('availableTargets');
      this.target = targets.filter(target => {
        return target.key === this.targetKey;
      })[0];
    } catch (e) {
      // nevermind, we'll check if target exists before loading preview
    }
  }

  loadView() {
    if (this.selectedItem) {
      this.title = this.items
        .filter(item => {
          return item.id === this.selectedItem.id;
        })
        .map(item => {
          return item.conf.title;
        })[0];

      if (this.target && this.selectedItem) {
        this.loadPreview();
      }
      this.loadDisplayOptions();
    }
  }

  selectItem(item) {
    this.loadSelectedItem(item);
    this.loadView();
  }

  loadSelectedItem(item) {
    this.title = item.conf.title;
    const alreadySelected = this.selectedItems.filter(selectedItem => {
      return item.conf._id === selectedItem.id;
    });

    if (alreadySelected.length > 0) {
      this.selectedItem = alreadySelected[0];
    } else {
      this.selectedItem = {
        id: item.conf._id,
        tool: item.conf.tool,
        toolRuntimeConfig: {
          displayOptions: {}
        }
      };
    }
  }

  changeDisplayOptions() {
    this.selectedItems = this.selectedItems.filter(item => {
      return item.id !== this.selectedItem.id;
    });
    this.selectedItems.push(this.selectedItem);
    this.loadPreview();
  }

  insertItem() {
    // delete all displayOptions set to false
    let displayOptions = this.selectedItem.toolRuntimeConfig.displayOptions;
    Object.keys(displayOptions).forEach(displayOption => {
      if (!displayOptions[displayOption]) {
        delete displayOptions[displayOption];
      }
    });

    const message = {
      action: 'update',
      params: this.selectedItem
    };
    window.parent.postMessage(message, '*');
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
      displayOptions: this.selectedItem.toolRuntimeConfig.displayOptions
    };

    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        if (this.selectedItem) {
          return fetch(`${QServerBaseUrl}/rendering-info/${this.selectedItem.id}/${this.target.key}?toolRuntimeConfig=${encodeURI(JSON.stringify(toolRuntimeConfig))}`);
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
        if (this.selectedItem && this.selectedItem.tool) {
          const tool = this.selectedItem.tool;
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

        if (!this.selectedItem.toolRuntimeConfig) {
          this.selectedItem.toolRuntimeConfig = {};
        }

        if (!this.selectedItem.toolRuntimeConfig.displayOptions) {
          this.selectedItem.toolRuntimeConfig.displayOptions = {};
          this.optionKeys.forEach(optionKey => {
            this.selectedItem.toolRuntimeConfig.displayOptions[optionKey] = false;
          });
        }
      });
  }
}
