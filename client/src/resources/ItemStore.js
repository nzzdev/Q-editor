import { inject } from 'aurelia-framework';
import { BindingEngine } from 'aurelia-binding';
import { HttpClient } from 'aurelia-fetch-client';
import qEnv from 'resources/qEnv.js';
import User from 'resources/User.js';
import Item from 'resources/Item.js';
import ToolsInfo from 'resources/ToolsInfo.js';

@inject(User, ToolsInfo, BindingEngine, HttpClient)
export default class ItemStore {

  items = {};

  constructor(user, toolsInfo, bindingEngine, httpClient) {
    this.user = user;
    this.toolsInfo = toolsInfo;
    this.bindingEngine = bindingEngine;
    this.httpClient = httpClient;

    this.initFilters();
  }

  async initFilters() {
    this.filters = [
      {
        name: 'tool',
        options: [
          {
            name: 'all',
            label_i18n_key: 'itemsFilter.allGraphics'
          }
        ],
        selected: 'all'
      },
      {
        name: 'createdBy',
        options: [
          {
            name: 'all',
            label_i18n_key: 'itemsFilter.byAll'
          },
          {
            name: 'byMe',
            label_i18n_key: 'itemsFilter.byMe'
          }
        ],
        selected: 'all'
      },
      {
        name: 'department',
        options: [
          {
            name: 'all',
            label_i18n_key: 'itemsFilter.allDepartments'
          },
          {
            name: 'myDepartment',
            label_i18n_key: 'itemsFilter.myDepartment'
          }
        ],
        selected: 'all'
      },
      {
        name: 'active',
        options: [
          {
            name: 'all',
            label_i18n_key: 'itemsFilter.allStates'
          },
          {
            name: 'onlyActive',
            label_i18n_key: 'itemsFilter.onlyActive'
          },
          {
            name: 'onlyInactive',
            label_i18n_key: 'itemsFilter.onlyInactive'
          }
        ],
        selected: 'all'
      }
    ];

    let tools = await this.toolsInfo.getAvailableTools();
    tools.map(tool => {
      this.filters[0].options.push(tool);
    });
  }

  getNewItem() {
    let item = new Item(this.user, this.httpClient);
    item.setDepartmentToUserDepartment();
    this.bindingEngine
      .propertyObserver(item, 'isSaved')
      .subscribe(() => {
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

  async getSearchRequestBody(searchString, limit, onlyTools) {
    let queries = [];
    for (let filter of this.filters) {
      if (filter.name === 'tool' && filter.selected !== 'all') {
        queries.push(`(tool:"${filter.selected}" OR tool:${filter.selected.replace(new RegExp('_', 'g'), '-')})`);

        // we do have a specific tool filter, so we do not want to have the onlyTools processed
        onlyTools = null;
      }
      await this.user.loaded;
      if (filter.name === 'createdBy' && filter.selected === 'byMe') {
        queries.push(`createdBy:"${this.user.data.username}"`);
      }
      if (filter.name === 'department' && filter.selected === 'myDepartment') {
        queries.push(`department:"${this.user.data.department}"`);
      }
      if (filter.name === 'active' && filter.selected !== 'all') {
        queries.push(`active:${filter.selected === 'onlyActive' ? 'true' : 'false'}`);
      }
    }

    if (searchString) {
      queries.push(`(title:${searchString}* OR subtitle:${searchString}* OR annotations:${searchString}*)`);
    }

    if (onlyTools) {
      let onlyToolsQuery = onlyTools
        .map(tool => {
          return `tool:"${tool}" OR tool:${tool.replace(new RegExp('_', 'g'), '-')}`;
        })
        .join(' OR ');

      queries.push(`(${onlyToolsQuery})`);
    }

    let body = {
      include_docs: true,
      limit: limit || 18,
      sort: '-orderDate'
    };

    if (queries.length > 0) {
      body.query = queries.join(' AND ');
    } else {
      body.query = '*:*';
    }
    return body;
  }

  async getItems(searchString = undefined, limit, onlyTools = undefined, bookmark = undefined) {
    let searchRequestBody = await this.getSearchRequestBody(searchString, limit, onlyTools);
    if (bookmark) {
      searchRequestBody.bookmark = bookmark;
    }
    return this.loadItems(searchRequestBody);
  }

  async loadItems(searchRequestBody) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await this.httpClient.fetch(`${QServerBaseUrl}/search`, {
      method: 'POST',
      body: JSON.stringify(searchRequestBody)
    });

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    if (!data.rows) {
      data.rows = [];
    }

    const items = data.rows
      .map(row => {
        let item = new Item(this.user, this.httpClient);
        item.addConf(row.doc);
        this.items[row.doc._id];
        return item;
      });

    return {
      items: items,
      total_rows: data.total_rows,
      bookmark: data.bookmark
    };
  }

  getFilters() {
    return this.filters;
  }

}
