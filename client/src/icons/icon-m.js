import { inject } from "aurelia-framework";
import QConfig from "resources/QConfig.js";

@inject(Element, QConfig)
export class IconM {
  constructor(element, qConfig) {
    this.element = element;
    this.qConfig = qConfig;

    this.play = () => {
      this.m.play();
      this.mFaceVisible = true;
    };
    this.pause = () => {
      this.m.pause();
      this.mFaceVisible = false;
    };
  }

  async attached() {
    let eastereggConfig = await this.qConfig.get("eastereggs");
    if (
      !eastereggConfig ||
      !eastereggConfig.hasOwnProperty("sounds") ||
      !eastereggConfig.sounds.hasOwnProperty("m")
    ) {
      return;
    }
    if (!this.m) {
      this.m = new Audio(eastereggConfig.sounds.m);

      this.element.addEventListener("mouseenter", this.play);
      this.element.addEventListener("mouseleave", this.pause);
    }
  }

  detached() {
    this.element.removeEventListener("mouseenter", this.play);
    this.element.removeEventListener("mouseleave", this.pause);
  }
}
