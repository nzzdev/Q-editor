import { inject, singleton } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Notification } from "aurelia-notification";
import { DialogService } from "aurelia-dialog";
import User from "resources/User.js";
import ItemStore from "resources/ItemStore.js";
import ToolsInfo from "resources/ToolsInfo.js";
import Statistics from "resources/Statistics.js";
import QConfig from "resources/QConfig.js";
import { AccountDialog } from "dialogs/account-dialog";

@singleton()
@inject(
  ItemStore,
  User,
  ToolsInfo,
  Router,
  QConfig,
  Statistics,
  Notification,
  DialogService
)
export class Index {
  enoughNewItems = true;
  initialised = false;

  constructor(
    itemStore,
    user,
    toolsInfo,
    router,
    qConfig,
    statistics,
    notification,
    dialogService
  ) {
    this.itemStore = itemStore;
    this.user = user;
    this.toolsInfo = toolsInfo;
    this.router = router;
    this.qConfig = qConfig;
    this.statistics = statistics;
    this.notification = notification;
    this.dialogService = dialogService;
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
    if (this.user.getUserConfig("q-filters")) {
      for (let userFilterSelection of this.user.getUserConfig("q-filters")) {
        this.availableFilters.map(filter => {
          if (filter.name === userFilterSelection.name) {
            filter.selected = userFilterSelection.selected;
          }
        });
      }
    }

    this.reloadItems();
    this.loadStatistics();
    this.initialised = true;
  }

  attached() {
    this.itemListScrollObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && this.moreItemsAvailable !== false) {
        this.loadMore();
      }
    });
  }

  filterChanged() {
    this.reloadItems();

    // store current filter selection on user object
    if (this.user) {
      this.user.setUserConfig(
        "q-filters",
        this.availableFilters.map(filter => {
          return {
            name: filter.name,
            selected: filter.selected
          };
        })
      );
    }
  }

  async loadItems(searchString, bookmark) {
    try {
      this.itemsLoading = true;
      let itemListConfig = await this.qConfig.get("itemList");
      let availableToolsNames = await this.toolsInfo.getAvailableToolsNames();

      let numberOfItemsToLoadPerStep = itemListConfig.itemsPerLoad || 18;

      const result = await this.itemStore.getItems(
        searchString,
        numberOfItemsToLoadPerStep,
        availableToolsNames,
        bookmark
      );
      this.itemsLoading = false;
      return result;
    } catch (e) {
      this.notification.error("notifications.failedLoadingItems");
    }
  }

  async reloadItems() {
    this.items = [];
    const result = await this.loadItems(this.currentSearchString);
    this.items = result.items;
    this.setScrollObserverToLastItem();
    this.bookmark = result.bookmark;
    this.updateMoreItemsAvailableState(result);

    return this.items;
  }

  async loadMore() {
    const result = await this.loadItems(
      this.currentSearchString,
      this.bookmark
    );
    this.items = this.items.concat(result.items);
    this.setScrollObserverToLastItem();
    this.bookmark = result.bookmark;
    this.updateMoreItemsAvailableState(result);
    return this.items;
  }

  setScrollObserverToLastItem() {
    this.itemListScrollObserver.observe(
      this.itemsListElement.children[this.itemsListElement.children.length - 1]
    );
  }

  updateMoreItemsAvailableState(result) {
    this.moreItemsAvailable = result.moreItemsAvailable;
  }

  async loadStatistics() {
    this.statsValues = null;

    try {
      let statsValues = {};
      statsValues.totalActiveCount = await this.statistics.getNumberOfActiveItems();

      const lowNewItemsConfig = await this.qConfig.get("lowNewItems");
      statsValues.days = lowNewItemsConfig.days;

      statsValues.count = await this.statistics.getNumberOfActiveItems(
        lowNewItemsConfig.days
      );

      // only set the stats after all values are available
      this.statsValues = statsValues;

      if (statsValues.count <= lowNewItemsConfig.threshold) {
        this.enoughNewItems = false;
      } else {
        this.enoughNewItems = true;
      }
    } catch (e) {
      // we do not care about errors here but just do not show statistics if something failed
    }
  }

  async showAccountModal() {
    const openDialogResult = await this.dialogService.open({
      viewModel: AccountDialog,
      model: {
        router: this.router
      }
    });
    const closeResult = await openDialogResult.closeResult;
    if (closeResult.wasCancelled === false) {
      this.router.navigateToRoute("index", { replace: true });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
}
