import { inject, singleton } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import ItemStore from "resources/ItemStore.js";
import QTargets from "resources/QTargets.js";
import qEnv from "resources/qEnv.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";

let loadedItems = [];

async function getItem(id) {
  if (!loadedItems.hasOwnProperty(id)) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await fetch(`${QServerBaseUrl}/item/${id}`);

    if (!response.ok) {
      throw response;
    }

    const doc = await response.json();
    let item = {
      id: id,
      conf: doc
    };
    loadedItems[id] = item;
  }
  return loadedItems[id];
}

@singleton()
@inject(ItemStore, QTargets, ObjectFromSchemaGenerator, I18N)
export class App {
  constructor(itemStore, qTargets, objectFromSchemaGenerator, i18n) {
    this.itemStore = itemStore;
    this.qTargets = qTargets;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    this.i18n = i18n;
    this.previewWidth = 290;
  }

  activate() {
    this.selectedItems = [];

    const paramsQuery = /params=(.*)&?/.exec(window.location.search);
    const targetQuery = /target=([^&]*)/.exec(window.location.search);

    try {
      this.selectedItems.push(JSON.parse(decodeURIComponent(paramsQuery[1])));
      this.selectedItemIndex = 0;
    } catch (e) {
      // nevermind an error here, if there is no valid config, we handle it like there is none at all
    }

    try {
      this.targetKey = decodeURIComponent(targetQuery[1]);
    } catch (e) {
      // todo: error message of missing target
    }
  }

  async attached() {
    this.tools = await this.getTools();
    await this.loadTarget();
    await this.reloadItems();
    this.loadView();
  }

  async loadTarget() {
    try {
      const targets = await this.qTargets.get("availableTargets");
      this.target = targets.filter(target => {
        return target.key === this.targetKey;
      })[0];
    } catch (e) {
      // nevermind, we'll check if target exists before loading preview
    }
  }

  async loadView() {
    if (this.selectedItemIndex !== undefined) {
      const item = await getItem(this.selectedItems[this.selectedItemIndex].id);
      this.title = item.conf.title;

      if (this.target) {
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
    const index = this.selectedItems.findIndex(selectedItem => {
      return selectedItem.id === item.conf._id;
    });
    if (index > -1) {
      this.selectedItemIndex = index;
    } else {
      this.selectedItems.push({
        id: item.conf._id,
        toolRuntimeConfig: {
          displayOptions: {}
        }
      });
      this.selectedItemIndex = this.selectedItems.length - 1;
    }
  }

  insertItem() {
    // delete all displayOptions set to false
    let displayOptions = this.selectedItems[this.selectedItemIndex]
      .toolRuntimeConfig.displayOptions;
    Object.keys(displayOptions).forEach(displayOption => {
      if (!displayOptions[displayOption]) {
        delete displayOptions[displayOption];
      }
    });

    const message = {
      action: "update",
      params: this.selectedItems[this.selectedItemIndex]
    };
    window.parent.postMessage(message, "*");
  }

  async reloadItems() {
    this.items = [];
    try {
      const result = await this.loadItems(this.currentSearchString);

      this.items = result.items.map(item => {
        let itemTool = this.tools.filter(tool => {
          return tool.name === item.getToolName();
        })[0];

        if (itemTool) {
          item.conf.icon = itemTool.icon;
        }

        return item;
      });

      this.bookmark = result.bookmark;
      this.updateMoreItemsAvailableState(result);
    } catch (e) {
      // todo: error handling
    }

    return this.items;
  }

  async loadItems(searchString, bookmark) {
    this.itemsLoading = true;
    const numberOfItemsToLoadPerStep = 9;

    const availableToolNames = this.tools.map(tool => tool.name);
    const result = await this.itemStore.getItems(
      searchString,
      numberOfItemsToLoadPerStep,
      availableToolNames,
      bookmark
    );
    this.itemsLoading = false;
    return result;
  }

  async loadMore() {
    try {
      const result = await this.loadItems(
        this.currentSearchString,
        this.bookmark
      );

      this.items = this.items.concat(result.items);
      this.items = this.items.map(item => {
        let itemTool = this.tools.filter(tool => {
          return tool.name === item.getToolName();
        })[0];

        if (itemTool) {
          item.conf.icon = itemTool.icon;
        }

        return item;
      });
      this.bookmark = result.bookmark;
      this.updateMoreItemsAvailableState(result);
    } catch (e) {
      // todo: error handling
    }

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
            comparison: "="
          }
        ]
      },
      displayOptions: this.selectedItems[this.selectedItemIndex]
        .toolRuntimeConfig.displayOptions,
      isPure: true
    };

    return qEnv.QServerBaseUrl.then(QServerBaseUrl => {
      if (this.selectedItemIndex !== undefined) {
        return fetch(
          `${QServerBaseUrl}/rendering-info/${
            this.selectedItems[this.selectedItemIndex].id
          }/${this.target.key}?toolRuntimeConfig=${encodeURI(
            JSON.stringify(toolRuntimeConfig)
          )}`
        );
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

  async loadDisplayOptions() {
    try {
      const item = await getItem(this.selectedItems[this.selectedItemIndex].id);
      this.tool = item.conf.tool;

      let selectedItem = this.selectedItems[this.selectedItemIndex];

      qEnv.QServerBaseUrl.then(QServerBaseUrl => {
        return fetch(
          `${QServerBaseUrl}/tools/${this.tool}/display-options-schema.json`
        );
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then(schema => {
          if (schema.hasOwnProperty("properties")) {
            // we just accept one object containing simple boolean type properties
            Object.keys(schema.properties).forEach(propertyName => {
              // maybe delete all non boolean properties here??
              let displayOption = schema.properties[propertyName];
              if (displayOption.title) {
                schema.properties[propertyName].title = this.i18n.tr(
                  `${this.tool}:${displayOption.title}`
                );
              }
            });
          }
          this.displayOptionsSchema = schema;
          if (!selectedItem.toolRuntimeConfig) {
            selectedItem.toolRuntimeConfig = {};
          }

          if (!selectedItem.toolRuntimeConfig.displayOptions) {
            selectedItem.toolRuntimeConfig.displayOptions = this.objectFromSchemaGenerator.generateFromSchema(
              schema
            );
          }
        })
        .catch(err => {
          if (err.status === 404) {
            this.displayOptionsSchema = {};
            selectedItem.toolRuntimeConfig = {
              displayOptions: {}
            };
          } else {
            throw err;
          }
        });
    } catch (e) {
      throw new Error("no tool defined");
    }
  }
}
