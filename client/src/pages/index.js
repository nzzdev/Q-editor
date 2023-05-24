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
import { SessionStorage } from "../session-storage";

@singleton()
@inject(
  ItemStore,
  User,
  ToolsInfo,
  Router,
  QConfig,
  Statistics,
  Notification,
  DialogService,
  SessionStorage
)
export class Index {
  enoughNewItems = true;
  initialised = false;
  moreItemsAvailable = false;

  constructor(
    itemStore,
    user,
    toolsInfo,
    router,
    qConfig,
    statistics,
    notification,
    dialogService,
    sessionStorage
  ) {
    this.itemStore = itemStore;
    this.user = user;
    this.toolsInfo = toolsInfo;
    this.router = router;
    this.qConfig = qConfig;
    this.statistics = statistics;
    this.notification = notification;
    this.dialogService = dialogService;
    this.sessionStorage = sessionStorage;
  }

  canActivate() {
    return this.user.loaded;
  }

  activate() {
    if (document.referrer === "https://login.microsoftonline.com/") {
      const redirectPath = this.sessionStorage.getItem(
        "redirectPathAfterLogin"
      );

      if (redirectPath) {
        this.sessionStorage.removeItem("redirectPathAfterLogin");
        this.router.navigateToRoute(redirectPath);
      }
    }
  }

  async attached() {
    if (!this.initialised) {
      this.applyUserDefinedFilters();
    }

    await this.reloadItems();
    this.loadStatistics();
    this.attachItemListScrollObserver();
    this.initialised = true;
  }

  applyUserDefinedFilters() {
    // load filter defaults
    this.availableFilters = this.itemStore.getFilters();

    // apply stored user filter selections
    if (this.user.getUserConfig("q-filters")) {
      for (let userFilterSelection of this.user.getUserConfig("q-filters")) {
        this.availableFilters.map((filter) => {
          if (filter.name === userFilterSelection.name) {
            filter.selected = userFilterSelection.selected;
          }
        });
      }
    }
  }

  attachItemListScrollObserver() {
    // this observer will always observe the last item in the item list
    // it checks if the observed element is within the viewport
    // if so, we load more items
    this.itemListScrollObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.moreItemsAvailable !== false) {
        this.loadMore();
      }
    });

    this.itemListScrollObserver.observe(this.infiniteScrollingSentinel);
  }

  filterChanged() {
    this.reloadItems();

    // store current filter selection on user object
    if (this.user) {
      this.user.setUserConfig(
        "q-filters",
        this.availableFilters.map((filter) => {
          return {
            name: filter.name,
            selected: filter.selected,
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
    this.bookmark = result.bookmark;
    this.moreItemsAvailable = result.moreItemsAvailable;
    return this.items;
  }

  async loadMore() {
    const result = await this.loadItems(
      this.currentSearchString,
      this.bookmark
    );
    this.items = this.items.concat(result.items);
    this.bookmark = result.bookmark;
    this.moreItemsAvailable = result.moreItemsAvailable;
    return this.items;
  }

  async loadStatistics() {
    this.statsValues = null;

    try {
      let statsValues = {};
      statsValues.totalActiveCount =
        await this.statistics.getNumberOfActiveItems();

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
        router: this.router,
      },
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
