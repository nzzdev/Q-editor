import { inject, singleton } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import ItemStore from "resources/ItemStore.js";
import QTargets from "resources/QTargets.js";
import qEnv from "resources/qEnv.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

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
@inject(
  ItemStore,
  QTargets,
  ObjectFromSchemaGenerator,
  I18N,
  CurrentItemProvider
)
export class App {
  moreItemsAvailable = false;

  constructor(
    itemStore,
    qTargets,
    objectFromSchemaGenerator,
    i18n,
    currentItemProvider
  ) {
    this.itemStore = itemStore;
    this.qTargets = qTargets;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    this.i18n = i18n;
    this.previewWidth = 290;
    this.displayOptionsSchema = {
      properties: {}
    };
    this.currentItemProvider = currentItemProvider;
  }

  async activate() {
    this.selectedItems = [];

    const paramsQuery = /params=(.*)&?/.exec(window.location.search);
    const targetQuery = /target=([^&]*)/.exec(window.location.search);

    try {
      const selectedItem = JSON.parse(decodeURIComponent(paramsQuery[1]));
      const item = await getItem(selectedItem.id);
      selectedItem.active = item.conf.active;
      this.selectedItems.push(selectedItem);
      this.selectedItemIndex = 0;
    } catch (e) {
      // nevermind an error here, if there is no valid config, we handle it like there is none at all
    }

    try {
      this.targetKey = decodeURIComponent(targetQuery[1]);
    } catch (e) {
      this.targetKey = "nzz_ch";
      console.log(e);
    }
  }

  async attached() {
    this.tools = await this.getTools();
    await this.loadTarget();
    await this.filterChanged();
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
      this.currentItemProvider.setCurrentItem(item);
      this.title = item.conf.title;
      await this.loadDisplayOptions();

      if (this.target) {
        await this.loadPreview();
      }
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
        active: item.conf.active,
        toolRuntimeConfig: {}
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

  async filterChanged() {
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
      this.moreItemsAvailable = result.moreItemsAvailable;
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
      this.moreItemsAvailable = result.moreItemsAvailable;
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

  async fetchRenderingInfo() {
    const toolRuntimeConfig = {
      size: {
        width: [
          {
            value: Math.floor(
              this.previewContainer.shadowRoot
                .querySelector(".preview-element > *:first-child")
                .getBoundingClientRect().width
            ),
            comparison: "="
          }
        ]
      },
      displayOptions: this.selectedItems[this.selectedItemIndex]
        .toolRuntimeConfig.displayOptions,
      isPure: true
    };

    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    let renderingInfo = {};
    if (this.selectedItemIndex !== undefined) {
      const response = await fetch(
        `${QServerBaseUrl}/rendering-info/${
          this.selectedItems[this.selectedItemIndex].id
        }/${this.target.key}?toolRuntimeConfig=${encodeURI(
          JSON.stringify(toolRuntimeConfig)
        )}`
      );
      if (response.ok) {
        renderingInfo = await response.json();
      }
    }
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

    // add sophieModules for target preview if any
    if (this.target.preview && this.target.preview.sophieModules) {
      if (!renderingInfo.sophieModules) {
        renderingInfo.sophieModules = [];
      }
      this.target.preview.sophieModules.forEach(sophieModule => {
        renderingInfo.sophieModules.push(sophieModule);
      });
    }
    return renderingInfo;
  }

  async loadPreview() {
    try {
      this.renderingInfo = await this.fetchRenderingInfo();
      this.errorMessage = undefined;
    } catch (error) {
      this.renderingInfo = {};
      this.errorMessage = error;
    }
  }

  async loadDisplayOptions() {
    try {
      const item = await getItem(this.selectedItems[this.selectedItemIndex].id);
      this.tool = item.conf.tool;

      let selectedItem = this.selectedItems[this.selectedItemIndex];
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      let displayOptionsSchema = {};
      const response = await fetch(
        `${QServerBaseUrl}/tools/${this.tool}/display-options-schema.json`
      );
      if (response.ok) {
        displayOptionsSchema = await response.json();
      }
      for (let [key, value] of Object.entries(
        displayOptionsSchema.properties
      )) {
        if (value.title) {
          displayOptionsSchema.properties[key].title = this.i18n.tr(
            `${this.tool}:${value.title}`
          );
        }
      }
      this.displayOptionsSchema = displayOptionsSchema;
      if (!selectedItem.toolRuntimeConfig) {
        selectedItem.toolRuntimeConfig = {};
      }

      if (!selectedItem.toolRuntimeConfig.displayOptions) {
        selectedItem.toolRuntimeConfig.displayOptions = this.objectFromSchemaGenerator.generateFromSchema(
          displayOptionsSchema
        );
      }
    } catch (error) {
      this.displayOptionsSchema = {};
      selectedItem.toolRuntimeConfig = {
        displayOptions: {}
      };
    }
  }
}
