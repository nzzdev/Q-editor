import { bindable, useShadowDOM, inject } from "aurelia-framework";
import qEnv from "resources/qEnv.js";
import QConfig from "resources/QConfig.js";

@useShadowDOM()
@inject(Element, QConfig)
export class PreviewContainer {
  @bindable
  width;
  @bindable
  renderingInfo;
  @bindable
  loadingStatus;
  @bindable
  target;
  @bindable
  error;

  insertedElements = [];
  stylesheetRules = [];

  constructor(element, qConfig) {
    this.element = element;
    this.qConfig = qConfig;
    this.id = `preview-container-${Math.floor(Math.random() * 10 ** 9)}`;
    this.element.setAttribute("id", this.id);
  }

  attached() {
    this.showPreview(this.renderingInfo);
  }

  detached() {
    if (this.imageObjectURL) {
      URL.revokeObjectURL(this.imageObjectURL);
    }
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

    this.previewColor = color;
  }

  async showPreview(renderingInfo) {
    if (!this.previewElement) {
      return;
    }

    if (!renderingInfo) {
      this.previewElement.innerHTML = "";
      return;
    }

    // if we have a Blob here, we display this as an Image
    if (renderingInfo instanceof Blob) {
      // cleanup
      if (this.imageObjectURL) {
        URL.revokeObjectURL(this.imageObjectURL);
      }
      if (this.imageElement) {
        this.previewElement.removeChild(this.imageElement);
      }

      // create new image element and append to preview
      this.imageElement = new Image();
      this.imageObjectURL = URL.createObjectURL(renderingInfo);
      this.imageElement.setAttribute("src", this.imageObjectURL);
      this.previewElement.appendChild(this.imageElement);
      return;
    }

    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    // remove all previously inserted elements
    while (this.insertedElements.length > 0) {
      let element = this.insertedElements.pop();
      element.parentNode.removeChild(element);
    }

    // load sophie modules
    if (Array.isArray(renderingInfo.sophieModules)) {
      const sophieConfig = await this.qConfig.get("sophie");
      if (sophieConfig && sophieConfig.buildServiceBaseUrl) {
        const sophieModulesString = renderingInfo.sophieModules
          .map(sophieModule => {
            let moduleString = sophieModule.name;
            if (
              Array.isArray(sophieModule.submodules) &&
              sophieModule.submodules.length > 0
            ) {
              moduleString = `${moduleString}[${sophieModule.submodules.join(
                "+"
              )}]`;
            }
            return moduleString;
          })
          .join(",");
        let link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = `${sophieConfig.buildServiceBaseUrl}/bundle/${sophieModulesString}.css`;
        this.insertedElements.push(link);
        this.element.shadowRoot.appendChild(link);
      }
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
