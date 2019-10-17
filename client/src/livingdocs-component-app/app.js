import { inject, singleton, LogManager } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import ItemStore from "resources/ItemStore.js";
import QTargets from "resources/QTargets.js";
import qEnv from "resources/qEnv.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import QConfig from "resources/QConfig.js";

const log = LogManager.getLogger("Q");

@singleton()
@inject(
  ItemStore,
  QTargets,
  ObjectFromSchemaGenerator,
  I18N,
  CurrentItemProvider,
  QConfig
)
export class App {
  constructor(
    itemStore,
    qTargets,
    objectFromSchemaGenerator,
    i18n,
    currentItemProvider,
    qConfig
  ) {
    this.itemStore = itemStore;
    this.qTargets = qTargets;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    this.i18n = i18n;
    this.currentItemProvider = currentItemProvider;
    this.qConfig = qConfig;
    this.previewWidth = 290;
    this.displayOptionsSchema = {
      properties: {}
    };
    this.moreItemsAvailable = false;
    this.items = [];
  }

  async attached() {
    this.QServerBaseUrl = await qEnv.QServerBaseUrl;
    this.tools = await this.getTools();
    this.target = await this.getTarget();
    this.items = await this.getItems();
    this.loadStylesheets();
    this.selectedItem = await this.getInitialSelectedItem();
    if (this.selectedItem) {
      await this.loadPreview();
    }
  }

  async search() {
    try {
      this.items = await this.getItems(this.searchString);
    } catch (error) {
      log.error(error);
    }
  }

  async loadMore() {
    try {
      const items = await this.getItems(this.searchString, this.bookmark);
      this.items = this.items.concat(items);
    } catch (error) {
      log.error(error);
    }
  }

  async getInitialSelectedItem() {
    try {
      const paramsQuery = /params=(.*)&?/.exec(window.location.search);
      if (paramsQuery && paramsQuery[1]) {
        const params = JSON.parse(decodeURIComponent(paramsQuery[1]));
        return await this.getItem(params);
      }
    } catch (error) {
      log.error(error);
    }
  }

  async getTarget() {
    try {
      const targets = await this.qTargets.get("availableTargets");
      const targetQuery = /target=([^&]*)/.exec(window.location.search);
      let targetKey = "nzz_ch";
      if (targetQuery && targetQuery[1]) {
        targetKey = decodeURIComponent(targetQuery[1]);
      }
      return targets.find(target => {
        return target.key === targetKey;
      });
    } catch (error) {
      log.error(error);
    }
  }

  async getTools() {
    try {
      const response = await fetch(`${this.QServerBaseUrl}/editor/tools`);
      return await response.json();
    } catch (error) {
      log.error(error);
    }
  }

  async getItem(params) {
    try {
      const response = await fetch(`${this.QServerBaseUrl}/item/${params.id}`);
      params.conf = await response.json();
      params.toolConfig = this.getToolConfig(params.conf);
      return params;
    } catch (error) {
      log.error(error);
    }
  }

  async getItems(searchString, bookmark) {
    this.itemsLoading = true;
    const numberOfItemsToLoadPerStep = 9;
    const availableToolNames = this.tools.map(tool => tool.name);
    let result = await this.itemStore.getItems(
      searchString,
      numberOfItemsToLoadPerStep,
      availableToolNames,
      bookmark
    );

    // sets toolConfig to items
    result.items = result.items.map(item => {
      item.toolConfig = this.getToolConfig(item.conf);
      return item;
    });
    this.bookmark = result.bookmark;
    this.moreItemsAvailable = result.moreItemsAvailable;
    this.itemsLoading = false;
    return result.items;
  }

  getToolConfig(itemConf) {
    let toolConfig = {};
    let tool = this.tools.find(toolItem => {
      return toolItem.name === itemConf.tool;
    });

    if (tool) {
      toolConfig = {
        icon: tool.icon
      };
    }
    return toolConfig;
  }

  async selectItem(item) {
    this.selectedItem = {
      id: item.conf._id,
      conf: item.conf,
      toolConfig: item.toolConfig,
      toolRuntimeConfig: {}
    };
    if (this.selectedItem.conf.active) {
      await this.loadPreview();
    }
  }

  insertItem() {
    // delete all displayOptions set to false if any
    if (
      this.selectedItem.toolRuntimeConfig.displayOptions &&
      Object.keys(this.selectedItem.toolRuntimeConfig.displayOptions).length > 0
    ) {
      Object.keys(this.selectedItem.toolRuntimeConfig.displayOptions).forEach(
        displayOptionName => {
          if (
            this.selectedItem.toolRuntimeConfig.displayOptions[
              displayOptionName
            ] === false
          ) {
            delete this.selectedItem.toolRuntimeConfig.displayOptions[
              displayOptionName
            ];
          }
        }
      );
    }
    // delete the conf and toolConfig properties of the selectedItem before saving it with the item
    delete this.selectedItem.conf;
    delete this.selectedItem.toolConfig;
    const message = {
      action: "update",
      params: this.selectedItem
    };
    window.parent.postMessage(message, "*");
  }

  async loadPreview() {
    this.currentItemProvider.setCurrentItem(this.selectedItem);
    this.title = this.selectedItem.conf.title;
    this.displayOptionsSchema = await this.getDisplayOptionsSchema();
    if (!this.selectedItem.toolRuntimeConfig.displayOptions) {
      this.selectedItem.toolRuntimeConfig.displayOptions = await this.getDefaultDisplayOptions();
    }
    if (this.target) {
      this.renderingInfo = await this.getRenderingInfo();
    }
  }

  async getDisplayOptionsSchema() {
    try {
      let displayOptionsSchema = {};
      const response = await fetch(
        `${this.QServerBaseUrl}/display-options-schema/${this.selectedItem.id}/${this.target.key}.json`
      );
      if (response.ok) {
        displayOptionsSchema = await response.json();
        // translate displayOption titles
        for (let [key, value] of Object.entries(
          displayOptionsSchema.properties
        )) {
          if (value.title) {
            displayOptionsSchema.properties[key].title = this.i18n.tr(
              `${this.selectedItem.conf.tool}:${value.title}`
            );
          }
        }
      }

      return displayOptionsSchema;
    } catch (error) {
      log.error(error);
    }
  }

  async getDefaultDisplayOptions() {
    try {
      return this.objectFromSchemaGenerator.generateFromSchema(
        this.displayOptionsSchema
      );
    } catch (error) {
      log.error(error);
    }
  }

  async getRenderingInfo() {
    try {
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
    } catch (error) {
      log.error(error);
    }
  }

  async loadStylesheets() {
    // load any additional stylesheets defined for themeing or font-face loading as @font-face doesn't work within ShadowRoot (used for the preview)
    try {
      const stylesheets = await this.qConfig.get("stylesheets");
      if (stylesheets && stylesheets.length) {
        stylesheets
          .map(stylesheet => {
            if (!stylesheet.url && stylesheet.path) {
              stylesheet.url = `${QServerBaseUrl}${stylesheet.path}`;
            }
            return stylesheet;
          })
          .map(stylesheet => {
            if (stylesheet.url) {
              let link = document.createElement("link");
              link.type = "text/css";
              link.rel = "stylesheet";
              link.href = stylesheet.url;
              document.head.appendChild(link);
            } else if (stylesheet.content) {
              let style = document.createElement("style");
              style.type = "text/css";
              style.appendChild(document.createTextNode(stylesheet.content));
              document.head.appendChild(style);
            }
          });
      }
    } catch (e) {
      // nevermind
    }
  }
}
