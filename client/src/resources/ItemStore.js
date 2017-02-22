import { inject } from 'aurelia-framework'
import { I18N } from 'aurelia-i18n';
import { BindingEngine } from 'aurelia-binding'
import qEnv from 'resources/qEnv.js'
import User from 'resources/User.js'
import Item from 'resources/Item.js'
import ToolsInfo from 'resources/ToolsInfo.js'

@inject(User, ToolsInfo, BindingEngine, I18N)
export default class ItemStore {

  items = {};

  constructor(user, toolsInfo, bindingEngine, i18n) {
    this.user = user;
    this.toolsInfo = toolsInfo;
    this.bindingEngine = bindingEngine;
    this.i18n = i18n;

    this.filters = [
      {
        name: 'tool',
        options: [
          {
            name: 'all',
            label: this.i18n.tr('itemsFilter.allGraphics')
          }
        ],
        selected: 'all'
      },
      {
        name: 'createdBy',
        options: [
          {
            name: 'all',
            label: this.i18n.tr('itemsFilter.fromEveryone')
          },
          {
            name: 'byMe',
            label: this.i18n.tr('itemsFilter.byMe')
          }
        ],
        selected: 'all'
      },
      {
        name: 'department',
        options: [
          {
            name: 'all',
            label: this.i18n.tr('itemsFilter.allDepartments')
          },
          {
            name: 'myDepartment',
            label: this.i18n.tr('itemsFilter.myDepartment')
          }
        ],
        selected: 'all'
      },
      {
        name: 'active',
        options: [
          {
            name: 'all',
            label: this.i18n.tr('itemsFilter.allStates')
          },
          {
            name: 'onlyActive',
            label: this.i18n.tr('itemsFilter.onlyActive')
          },
          {
            name: 'onlyInactive',
            label: this.i18n.tr('itemsFilter.onlyInactive')
          }
        ],
        selected: 'all'
      }
    ]

    this.toolsInfo.getAvailableTools()
      .then(tools => {
        tools.map(tool => {
          this.filters[0].options.push({
            name: tool.name,
            label: `nur ${tool.label}`
          })
        })
      });
  }

  getNewItem() {
    let item = new Item(this.user);
    item.setDepartmentToUserDepartment();
    this.bindingEngine
      .propertyObserver(item, 'isSaved')
      .subscribe(() => {
        if (item.conf.id) {
          this.items[id] = item;
        }
      })
    return item;
  }

  getItem(id) {
    if (!this.items.hasOwnProperty(id)) {
      let item = this.getNewItem();
      this.items[id] = item;
    }
    return this.items[id].load(id);
  }

  getSearchRequestBody(searchString, limit, onlyTools) {
    let queries = [];
    for (let filter of this.filters) {
      if (filter.name === 'tool' && filter.selected !== 'all') {
        queries.push(`tool:"${filter.selected}" OR tool:${filter.selected.replace(new RegExp('_','g'), '-')}`);

        // we do have a specific tool filter, so we do not want to have the onlyTools processed
        onlyTools = null;
      }
      if (filter.name === 'createdBy' && filter.selected === 'byMe') {
        queries.push(`createdBy:"${this.user.name}"`);
      }
      if (filter.name === 'department' && filter.selected === 'myDepartment') {
        queries.push(`department:"${this.user.department}"`);
      }
      if (filter.name === 'active' && filter.selected !== 'all') {
        queries.push(`active:${filter.selected === 'onlyActive' ? 'true' : 'false'}`);
      }
    }

    if (searchString) {
      queries.push(`(title:${searchString}* OR annotations:${searchString}*)`);
    }

    if (onlyTools) {
      let onlyToolsQuery = onlyTools
        .map(tool => {
          return `tool:"${tool}" OR tool:${tool.replace(new RegExp('_','g'), '-')}`;
        })
        .join(' OR ')
        
      queries.push(`(${onlyToolsQuery})`);
    }

    let body = {
      include_docs: true,
      limit: limit || 18,
      sort: '-orderDate'
    }

    if (queries.length > 0) {
      body.query = queries.join(' AND ');
    } else {
      body.query = '*:*';
    }
    return body;
  }

  getItems(searchString = undefined, limit, onlyTools = undefined, bookmark = undefined) {
    let searchRequestBody = this.getSearchRequestBody(searchString, limit, onlyTools);
    if (bookmark) {
      searchRequestBody.bookmark = bookmark;
    }
    return this.loadItems(searchRequestBody);
  }

  // getNextItems(searchString, bookmark, limit, onlyTools = undefined) {
  //   let searchRequestBody = this.getSearchRequestBody(searchString, limit, onlyTools);
  //   searchRequestBody.bookmark = bookmark;
  //   return this.loadItems(searchRequestBody);
  // }

  loadItems(searchRequestBody) {
    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/search`, {
          method: 'POST',
          body: JSON.stringify(searchRequestBody)
        })
      })
      .then(response => {
        return response.json();
      })
      .then(result => {
        if (!result.rows) {
          result.rows = []
        }
        let items = result.rows
          .map(row => {
            let item = new Item(this.user);
            item.addConf(row.doc);
            this.items[row.doc._id];
            return item;
          });

        return {
          items: items,
          total_rows: result.total_rows,
          bookmark: result.bookmark
        };
      })
  }

  getFilters() {
    return this.filters;
  }

}
