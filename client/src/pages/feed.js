import { inject } from "aurelia-framework";

import ItemStore from "resources/ItemStore.js";
import ToolsInfo from "resources/ToolsInfo.js";
import QTargets from "resources/QTargets.js";
import qEnv from "resources/qEnv.js";

@inject(ItemStore, ToolsInfo, QTargets)
export default class Feed {
  items = [];
  renderingInfos = {};

  constructor(itemStore, toolsInfo, qTargets) {
    this.itemStore = itemStore;
    this.toolsInfo = toolsInfo;
    this.qTargets = qTargets;
  }

  async activate() {
    this.availableTargets = await this.qTargets.get("availableTargets");
    this.currentTarget = this.availableTargets[0];
    this.loadMore();
  }

  async loadRenderingInfos(item) {
    const toolRuntimeConfig = {
      size: {
        width: [
          {
            value: 320,
            comparison: "="
          }
        ]
      },
      isPure: true
    };
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    if (item.id) {
      if (this.renderingInfos[item.id]) {
        return;
      }
      try {
        const response = await fetch(
          `${QServerBaseUrl}/rendering-info/${item.id}/${
            this.currentTarget.key
          }?ignoreInactive=true&noCache=true&toolRuntimeConfig=${encodeURI(
            JSON.stringify(toolRuntimeConfig)
          )}`
        );
        if (response.ok) {
          this.renderingInfos[item.id] = await response.json();
        } else {
          this.renderingInfos[item.id] = {
            markup: '<div style="color: black;">Failed to load</div>'
          };
        }
      } catch (e) {
        this.renderingInfos[item.id] = {
          markup: '<div style="color: black;">Failed to load</div>'
        };
      }
    }
  }

  async loadMore() {
    const availableToolsNames = await this.toolsInfo.getAvailableToolsNames();
    const result = await this.itemStore.getItems(
      "",
      10,
      availableToolsNames,
      this.bookmark
    );
    this.bookmark = result.bookmark;

    for (const item of result.items) {
      this.items.push(item);
      this.loadRenderingInfos(item);
    }
  }
}
