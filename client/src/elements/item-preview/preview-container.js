import { bindable, useShadowDOM, inject } from 'aurelia-framework';
import qEnv from 'resources/qEnv.js';

@useShadowDOM()
@inject(Element)
export class PreviewContainer {

  @bindable width
  @bindable renderingInfo
  @bindable noRenderingInfoText

  insertedElements = [];

  constructor(element) {
    this.element = element;
  }

  attached() {
    this.showPreview(this.renderingInfo);
  }

  renderingInfoChanged(renderingInfo) {
    this.showPreview(this.renderingInfo);
  }

  async showPreview(renderingInfo) {
    if (!this.previewElement) {
      return;
    }

    if (!renderingInfo) {
      this.previewElement.innerHTML = '';
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
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = stylesheet.url;
            this.insertedElements.push(link);
            this.element.shadowRoot.appendChild(link);
          } else if (stylesheet.content) {
            let style = document.createElement('style');
            style.type = 'text/css';
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
      this.previewElement.innerHTML = '';
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
    if (scripts && scripts[index] && (scripts[index].url || scripts[index].content)) {
      let script = scripts[index];
      let scriptElement = document.createElement('script');

      if (script.url) {
        scriptElement.src = script.url;
        script.async = true;

        scriptElement.onload = () => {
          this.loadAllScripts(scripts, callback, index + 1);
        };

        this.insertedElements.push(scriptElement);
        this.element.shadowRoot.appendChild(scriptElement);
      } else if (script.content) {
        script.content = script.content.replace(new RegExp('document.querySelector', 'g'), "document.querySelector('#preview-container').shadowRoot.querySelector");

        scriptElement.innerHTML = script.content;
        this.insertedElements.push(scriptElement);
        this.element.shadowRoot.appendChild(scriptElement);
        this.loadAllScripts(scripts, callback, index + 1);
      }
    } else if (typeof callback === 'function') {
      callback();
    }
  }
}
