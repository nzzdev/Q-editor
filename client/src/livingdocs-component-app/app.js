import { inject, singleton } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import ItemStore from "resources/ItemStore.js";
import QTargets from "resources/QTargets.js";
import qEnv from "resources/qEnv.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

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
    try {
      this.QServerBaseUrl = await qEnv.QServerBaseUrl;
      const paramsQuery = /params=(.*)&?/.exec(window.location.search);
      const targetQuery = /target=([^&]*)/.exec(window.location.search);
      this.targetKey = decodeURIComponent(targetQuery[1]);
      this.selectedItem = await this.getItem(
        JSON.parse(decodeURIComponent(paramsQuery[1])).id
      );
    } catch (error) {
      this.targetKey = "nzz_ch";
    }
  }

  async attached() {
    this.tools = await this.getTools();
    await this.loadTarget();
    await this.filterChanged();
    await this.loadView();
  }

  async loadTarget() {
    try {
      const targets = await this.qTargets.get("availableTargets");
      this.target = targets.filter(target => {
        return target.key === this.targetKey;
      })[0];
    } catch (error) {
      // nevermind, we'll check if target exists before loading preview
    }
  }

  async getItem(id) {
    const response = await fetch(`${this.QServerBaseUrl}/item/${id}`);
    if (!response.ok) {
      throw response;
    }

    const doc = await response.json();
    return {
      id: id,
      conf: doc
    };
  }

  async loadView() {
    if (this.selectedItem !== undefined) {
      this.currentItemProvider.setCurrentItem(this.selectedItem);
      this.title = this.selectedItem.conf.title;
      await this.loadDisplayOptions();

      if (this.target) {
        await this.loadPreview();
      }
    }
  }

  async selectItem(item) {
    this.selectedItem = {
      id: item.conf._id,
      conf: item.conf,
      toolRuntimeConfig: {}
    };
    await this.loadView();
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
      action: "update",
      params: this.selectedItem
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
    const response = await fetch(`${this.QServerBaseUrl}/editor/tools`);
    return await response.json();
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
      displayOptions: this.selectedItem.toolRuntimeConfig.displayOptions,
      isPure: true
    };

    let renderingInfo = {};
    const response = await fetch(
      `${this.QServerBaseUrl}/rendering-info/${this.selectedItem.id}/${
        this.target.key
      }?toolRuntimeConfig=${encodeURI(JSON.stringify(toolRuntimeConfig))}`
    );
    if (response.ok) {
      renderingInfo = await response.json();
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
      let displayOptionsSchema = {};
      const response = await fetch(
        `${this.QServerBaseUrl}/tools/${
          this.selectedItem.conf.tool
        }/display-options-schema.json`
      );
      if (response.ok) {
        displayOptionsSchema = await response.json();
      }
      for (let [key, value] of Object.entries(
        displayOptionsSchema.properties
      )) {
        if (value.title) {
          displayOptionsSchema.properties[key].title = this.i18n.tr(
            `${this.selectedItem.conf.tool}:${value.title}`
          );
        }
      }
      this.displayOptionsSchema = displayOptionsSchema;
      if (!this.selectedItem.toolRuntimeConfig) {
        this.selectedItem.toolRuntimeConfig = {};
      }

      if (!this.selectedItem.toolRuntimeConfig.displayOptions) {
        this.selectedItem.toolRuntimeConfig.displayOptions = this.objectFromSchemaGenerator.generateFromSchema(
          displayOptionsSchema
        );
      }
    } catch (error) {
      this.displayOptionsSchema = {};
      this.selectedItem.toolRuntimeConfig = {
        displayOptions: {}
      };
    }
  }
}
