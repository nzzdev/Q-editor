import { bindable, useShadowDOM, inject } from "aurelia-framework";
import qEnv from "resources/qEnv.js";

@useShadowDOM()
@inject(Element)
export class PreviewContainer {
  @bindable width;
  @bindable renderingInfo;
  @bindable noRenderingInfoText;
  @bindable target;

  insertedElements = [];

  stylesheetRules = [];

  constructor(element) {
    this.element = element;
    this.id = `preview-container-${Math.floor(Math.random() * 10 ** 9)}`;
    this.element.setAttribute("id", this.id);

    this.styleSheet = this.element.ownerDocument.styleSheets[0];
  }

  attached() {
    this.showPreview(this.renderingInfo);
  }

  detached() {
    this.removePreviewBorderStyles();
  }

  renderingInfoChanged(renderingInfo) {
    this.showPreview(this.renderingInfo);
  }

  targetChanged() {
    let color = "white";
    try {
      if (this.target.context.background.color) {
        color = this.target.context.background.color;
      }
    } catch (e) {
      // nevermind, default color already set to white
    }
    try {
      if (this.target.preview.background.color) {
        color = this.target.preview.background.color;
      }
    } catch (e) {
      // nevermind, default color already set to white
    }

    this.addPreviewBorder(color);
    this.previewColor = color;
  }

  addPreviewBorder(backgroundColor) {
    this.removePreviewBorderStyles();
    let beforeIndex = this.styleSheet.insertRule(`preview-container::before {
      background-image: url('data:image/svg+xml;utf-8,<svg width="14" height="9" viewBox="0 0 14 9" xmlns="http://www.w3.org/2000/svg"><path fill="#adadad" d="M14 9V7L7 0 0 7v2l7-7z"/><path fill="${backgroundColor}" d="M0 9h14L7 2z"/></svg>');
    }`);
    let afterIndex = this.styleSheet.insertRule(`preview-container::after {
      background-image: url('data:image/svg+xml;utf-8,<svg width="14" height="9" viewBox="0 0 14 9" xmlns="http://www.w3.org/2000/svg"><path fill="#adadad" d="M14 0v2L7 9 0 2V0l7 7z"/><path fill="${backgroundColor}" d="M0 0h14L7 7z"/></svg>');
    }`);
    this.stylesheetRules.push(beforeIndex);
    this.stylesheetRules.push(afterIndex);
  }

  removePreviewBorderStyles() {
    while (this.stylesheetRules.length > 0) {
      this.styleSheet.deleteRule(this.stylesheetRules.pop());
    }
  }

  async showPreview(renderingInfo) {
    if (!this.previewElement) {
      return;
    }

    if (!renderingInfo) {
      this.previewElement.innerHTML = "";
      return;
    }

    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    // remove all previously inserted elements
    while (this.insertedElements.length > 0) {
      let element = this.insertedElements.pop();
      element.parentNode.removeChild(element);
    }

    // load the stylesheets
    if (Array.isArray(renderingInfo.stylesheets)) {
      renderingInfo.stylesheets
        .map(stylesheet => {
          if (!stylesheet.url && stylesheet.path) {
            stylesheet.url = `${QServerBaseUrl}${stylesheet.path}`;
          }
          return stylesheet;
        })
        .map(stylesheet => {
          if (stylesheet.url) {
            let link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = stylesheet.url;
            this.insertedElements.push(link);
            this.element.shadowRoot.appendChild(link);
          } else if (stylesheet.content) {
            let style = document.createElement("style");
            style.type = "text/css";
            style.appendChild(document.createTextNode(stylesheet.content));
            this.insertedElements.push(style);
            this.element.shadowRoot.appendChild(style);
          }
        });
    }

    // add the markup if any
    if (renderingInfo.markup) {
      this.previewElement.innerHTML = renderingInfo.markup;
    } else {
      this.previewElement.innerHTML = "";
    }

    // load the scripts one after the other
    if (Array.isArray(renderingInfo.scripts)) {
      renderingInfo.scripts = renderingInfo.scripts
        .filter(script => script.loadInEditorPreview !== false)
        .map(script => {
          if (script.path) {
            script.url = `${QServerBaseUrl}${script.path}`;
          }
          return script;
        });

      this.loadAllScripts(renderingInfo.scripts);
    }
  }

  loadAllScripts(scripts, callback = null, index = 0) {
    if (
      scripts &&
      scripts[index] &&
      (scripts[index].url || scripts[index].content)
    ) {
      let script = scripts[index];
      let scriptElement = document.createElement("script");

      if (script.url) {
        scriptElement.src = script.url;
        script.async = true;

        scriptElement.onload = () => {
          this.loadAllScripts(scripts, callback, index + 1);
        };

        this.insertedElements.push(scriptElement);
        this.element.shadowRoot.appendChild(scriptElement);
      } else if (script.content) {
        script.content = script.content.replace(
          new RegExp("document.querySelector", "g"),
          `document.querySelector('#${this.id}').shadowRoot.querySelector`
        );
        script.content = script.content.replace(
          new RegExp("document.getElementById", "g"),
          `document.querySelector('#${this.id}').shadowRoot.getElementById`
        );

        scriptElement.innerHTML = script.content;
        this.insertedElements.push(scriptElement);
        this.element.shadowRoot.appendChild(scriptElement);
        this.loadAllScripts(scripts, callback, index + 1);
      }
    } else if (typeof callback === "function") {
      callback();
    }
  }
}
