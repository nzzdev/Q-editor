import { bindable, inject, Loader, LogManager } from "aurelia-framework";
import QConfig from "resources/QConfig";
import { isRequired } from "./helpers.js";

const log = LogManager.getLogger("Q");

@inject(QConfig, Loader)
export class SchemaEditorCode {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  showNotifications;

  options = {};

  constructor(qConfig, loader) {
    this.qConfig = qConfig;
    this.loader = loader;
    this.isRequired = isRequired;
  }

  async schemaChanged() {
    this.applyOptions();
  }

  applyOptions() {
    if (!this.schema) {
      return;
    }
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }

  async attached() {
    this.showLoadingError = false;

    if (!window.CodeMirror) {
      try {
        window.CodeMirror = await this.loader.loadModule("codemirror");
        await this.loader.loadModule(
          "npm:codemirror@5.41.0/lib/codemirror.css!"
        );
        await this.loader.loadModule(
          "npm:codemirror@5.41.0/mode/javascript/javascript.js"
        );
        this.codeMirror = window.CodeMirror.fromTextArea(this.textareaElement, {
          mode: this.options.mimeType,
          lineNumbers: true
        });
        this.codeMirror.on("change", (codeMirror, change) => {
          this.data = this.codeMirror.getValue();
          this.change();
        });
      } catch (e) {
        log.error(e);
      }
    }
    if (!window.CodeMirror) {
      log.error("window.Codemirror is not defined after loading codemirror");
      this.showLoadingError = true;
      return;
    }
  }
}
