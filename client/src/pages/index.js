import { inject, singleton } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import User from 'resources/User.js'
import ItemStore from 'resources/ItemStore.js'
import ToolsInfo from 'resources/ToolsInfo.js'
import Statistics from 'resources/Statistics.js'
import QConfig from 'resources/QConfig.js'

@singleton()
@inject(ItemStore, User, ToolsInfo, Router, QConfig, Statistics)
export class Index {

  enoughNewItems = true;
  initialised = false;

  constructor(itemStore, user, toolsInfo, router, qConfig, statistics) {
    this.itemStore = itemStore;
    this.user = user;
    this.toolsInfo = toolsInfo;
    this.router = router;
    this.qConfig = qConfig;
    this.statistics = statistics;
  }

  canActivate() {
    return this.user.loaded;
  }

  activate() {
    if (this.initialised) {
      this.reloadItems();
      this.loadStatistics();
      return;
    }
    
    // load filter defaults
    this.availableFilters = this.itemStore.getFilters();

    // apply stored user filter selections
    if (this.user.getUserConfig('q-filters')) {
      for (let userFilterSelection of this.user.getUserConfig('q-filters')) {
        this.availableFilters.map(filter => {
          if (filter.name === userFilterSelection.name) {
            filter.selected = userFilterSelection.selected;
          }
        })
      }
    }

    this.reloadItems();
    this.loadStatistics();
    this.initialised = true;
  }

  filterChanged() {
    this.reloadItems();

    // store current filter selection on user object
    if (this.user) {
      this.user.setUserConfig('q-filters', this.availableFilters
        .map(filter => {
          return {
            name: filter.name,
            selected: filter.selected
          }
        })
      );
    }
  }

  loadItems(searchString, bookmark) {
    this.itemsLoading = true;
    let itemListConfig = this.qConfig.get('itemList');
    let availableToolsNames = this.toolsInfo.getAvailableToolsNames();

    return Promise.all([itemListConfig, availableToolsNames])
      .then(conf => {
        let itemListConfig = conf[0];
        let availableToolsNames = conf[1];

        let numberOfItemsToLoadPerStep = itemListConfig.itemsPerLoad || 18;
        return this.itemStore.getItems(searchString, numberOfItemsToLoadPerStep, availableToolsNames, bookmark)
      })
      .then(result => {
        this.itemsLoading = false;
        return result;        
      })
  }

  reloadItems() {
    this.items = []
    return this.loadItems(this.currentSearchString)
      .then(result => {
        this.items = result.items;
        this.bookmark = result.bookmark;
        this.updateMoreItemsAvailableState(result);
        return this.items;
      })
  }

  loadMore() {
    return this.loadItems(this.currentSearchString, this.bookmark)
      .then(result => {
        this.items = this.items.concat(result.items);
        this.bookmark = result.bookmark;
        this.updateMoreItemsAvailableState(result);
        return this.items;
      })
  }

  updateMoreItemsAvailableState(result) {
    if (result.total_rows > this.items.length) {
      this.moreItemsAvailable = true;
    } else {
      this.moreItemsAvailable = false;
    }
  }

  loadStatistics() {
    this.statsValues = {};

    this.statistics.getNumberOfActiveItems()
      .then(res => {
        this.statsValues.totalActiveCount = res;
      })

    this.qConfig.get('lowNewItems')
      .then(lowNewItemsConfig => {
        this.lowNewItemsConfig = lowNewItemsConfig;
        this.statsValues.days = lowNewItemsConfig.days;
        return this.statistics.getNumberOfActiveItems(lowNewItemsConfig.days);
      })
      .then(newInLastXDays => {
        this.statsValues.count = newInLastXDays;
        if (newInLastXDays <= this.lowNewItemsConfig.threshold) {
          this.enoughNewItems = false;
        } else {
          this.enoughNewItems = true;
        }
      })
  }

}
