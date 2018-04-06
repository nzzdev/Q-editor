import { valueConverter } from "aurelia-framework";

@valueConverter("json")
export class JsonValueConverter {
  toView(obj) {
    if (typeof obj === "object") {
      return JSON.stringify(obj);
    } else if (typeof obj === "string") {
      return obj;
    }
    return "";
  }
  fromView(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return json;
    }
  }
}
