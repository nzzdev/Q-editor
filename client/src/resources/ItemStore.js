import { inject } from "aurelia-framework";
import { BindingEngine } from "aurelia-binding";
import { HttpClient } from "aurelia-fetch-client";
import { I18N } from "aurelia-i18n";
import qEnv from "resources/qEnv.js";
import User from "resources/User.js";
import Item from "resources/Item.js";
import ToolsInfo from "resources/ToolsInfo.js";
import QConfig from "resources/QConfig.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator";

@inject(
  User,
  ToolsInfo,
  QConfig,
  ObjectFromSchemaGenerator,
  BindingEngine,
  HttpClient,
  I18N
)
export default class ItemStore {
  items = {};

  constructor(
    user,
    toolsInfo,
    qConfig,
    objectFromSchemaGenerator,
    bindingEngine,
    httpClient,
    i18n
  ) {
    this.user = user;
    this.toolsInfo = toolsInfo;
    this.qConfig = qConfig;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    this.bindingEngine = bindingEngine;
    this.httpClient = httpClient;
    this.i18n = i18n;

    this.initFilters();
  }

  async initFilters() {
    this.filters = [
      {
        name: "tool",
        options: [
          {
            value: "all",
            label_i18n_key: "itemsFilter.allGraphics"
          }
        ],
        selected: "all"
      },
      {
        name: "createdBy",
        options: [
          {
            value: "all",
            label_i18n_key: "itemsFilter.byAll"
          },
          {
            value: "byMe",
            label_i18n_key: "itemsFilter.byMe"
          }
        ],
        selected: "all"
      },
      {
        name: "department",
        options: [
          {
            value: "all",
            label_i18n_key: "itemsFilter.allDepartments"
          },
          {
            value: "myDepartment",
            label_i18n_key: "itemsFilter.myDepartment"
          }
        ],
        selected: "all"
      }
    ];

    // add a publication filter if there are any publications configured in the targets config
    const publications = await this.qConfig.get("publications");
    if (publications) {
      const publicationsFilter = {
        name: "publication",
        options: [
          {
            value: "all",
            label_i18n_key: "itemsFilter.allPublications"
          }
        ],
        selected: "all"
      };
      for (let publication of publications) {
        publicationsFilter.options.push({
          value: publication.key,
          label_i18n_key: publication.label
        });
      }
      this.filters.push(publicationsFilter);
    }

    // add the last filter to filter by state
    this.filters.push({
      name: "active",
      options: [
        {
          value: "all",
          label_i18n_key: "itemsFilter.allStates"
        },
        {
          value: "onlyActive",
          label_i18n_key: "itemsFilter.onlyActive"
        },
        {
          value: "onlyInactive",
          label_i18n_key: "itemsFilter.onlyInactive"
        }
      ],
      selected: "all"
    });

    const tools = await this.toolsInfo.getAvailableTools();
    tools.map(tool => {
      this.filters[0].options.push({
        value: tool.name,
        label_i18n_key: `tools:${tool.name}`
      });
    });
  }

  getNewItem() {
    let item = new Item(this.user, this.httpClient);
    item.setDepartmentToUserDepartment();
    item.setPublicationToUserPublication();
    item.setAcronymToUserAcronym();
    this.bindingEngine.propertyObserver(item, "isSaved").subscribe(() => {
      if (item.conf.id) {
        this.items[id] = item;
      }
    });
    return item;
  }

  async getItem(id) {
    if (!this.items.hasOwnProperty(id)) {
      let item = this.getNewItem();
      this.items[id] = item;
    }
    await this.items[id].load(id);
    return this.items[id];
  }

  async getBlueprintedItem(id) {
    // get the original
    const item = await this.getItem(id);

    // create a new one to hold the blueprinted data
    const blueprintedItem = this.getNewItem();

    // set the tool, we need to know what schema to load blueprint
    blueprintedItem.conf.tool = item.conf.tool;

    // set the title, otherwise we cannot save it
    blueprintedItem.conf.title = `${this.i18n.tr(
      "item.blueprintTitlePrefix"
    )} ${item.conf.title}`;

    // save to get a new id
    await blueprintedItem.save();

    // generate the new conf based on the original item and the schema
    const blueprintedItemConf = this.objectFromSchemaGenerator.generateFromItemAndSchema(
      item.conf,
      await item.getSchema(),
      blueprintedItem.id
    );

    // remove the title from the new conf, this is a little hacky, but we set the title already before to be able to save
    delete blueprintedItemConf.title;

    // add the blueprinted conf to the new item
    blueprintedItem.addConf(blueprintedItemConf);

    // save again
    await blueprintedItem.save();

    this.items[blueprintedItem.id] = blueprintedItem;
    return this.items[blueprintedItem.id];
  }

  async getSearchUrl(searchString, limit, bookmark, onlyTools) {
    const searchParams = new URLSearchParams();
    for (let filter of this.filters) {
      if (filter.name === "tool" && filter.selected !== "all") {
        searchParams.append("tool", filter.selected);
        // we do have a specific tool filter, so we do not want to have the onlyTools processed
        onlyTools = undefined;
      }
      await this.user.loaded;
      if (filter.name === "createdBy" && filter.selected === "byMe") {
        searchParams.append("createdBy", this.user.data.username);
      }
      if (filter.name === "department" && filter.selected === "myDepartment") {
        searchParams.append("department", this.user.data.department);
      }
      if (filter.name === "publication" && filter.selected !== "all") {
        searchParams.append("publication", filter.selected);
      }
      if (filter.name === "active" && filter.selected !== "all") {
        if (filter.selected === "onlyActive") {
          searchParams.append("active", "true");
        } else {
          searchParams.append("active", "false");
        }
      }
    }
    if (onlyTools) {
      searchParams.append("tool", JSON.stringify(onlyTools));
    }
    if (searchString) {
      searchParams.append("searchString", searchString);
    }
    if (limit) {
      searchParams.append("limit", limit);
    }
    if (bookmark) {
      searchParams.append("bookmark", bookmark);
    }
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    return `${QServerBaseUrl}/search?${searchParams.toString()}`;
  }

  async getItems(
    searchString = undefined,
    limit = 18,
    onlyTools = undefined,
    bookmark = undefined
  ) {
    const searchUrl = await this.getSearchUrl(
      searchString,
      limit,
      bookmark,
      onlyTools
    );
    const response = await this.httpClient.fetch(searchUrl, {
      method: "GET"
    });

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    if (!data.docs) {
      data.docs = [];
    }

    const items = data.docs.map(doc => {
      let item = new Item(this.user, this.httpClient);
      item.addConf(doc);
      this.items[doc._id];
      return item;
    });

    // moreItemsAvailable: As long as the returned amount of items are the same as the limit there are more items available
    // See pagination section in http://docs.couchdb.org/en/2.1.1/api/database/find.html
    return {
      items: items,
      moreItemsAvailable: data.docs.length === limit,
      bookmark: data.bookmark
    };
  }

  getFilters() {
    return this.filters;
  }
}
