import { bindable, useShadowDOM, inject } from 'aurelia-framework';
import qEnv from 'resources/qEnv.js';

@useShadowDOM()
@inject(Element)
export class PreviewContainer {

  @bindable width
  @bindable renderingInfo

  constructor(element) {
    this.element = element;
  }

  attached() {
    this.showPreview(this.renderingInfo);
  }

  renderingInfoChanged(renderingInfo) {
    this.showPreview(this.renderingInfo);
  }

  showPreview(renderingInfo) {
    if (!this.previewElement) {
      return;
    }
    if (!renderingInfo) {
      this.previewElement.innerHTML = '';
      return;
    }

    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
    
        // load the stylesheets
        if (Array.isArray(renderingInfo.stylesheets)) {
          renderingInfo.stylesheets
            .map(stylesheet => {
              if (!stylesheet.url && stylesheet.path) {
                stylesheet.url = `${QServerBaseUrl}${stylesheet.path}`
              }
              return stylesheet
            })
            .map(stylesheet => {
              if (stylesheet.url) {
                let link = document.createElement('link');
                link.type = 'text/css';
                link.rel = "stylesheet";
                link.href = stylesheet.url;
                this.element.shadowRoot.insertBefore(link, this.element.shadowRoot.firstChild);
              } else if (stylesheet.content) {
                let style = document.createElement('style');
                style.type = 'text/css';
                style.appendChild(document.createTextNode(stylesheet.content));
                this.element.shadowRoot.insertBefore(style, this.element.shadowRoot.firstChild);
              }
            })
        }

        // load the scripts one after the other
        if (Array.isArray(renderingInfo.scripts)) {
          renderingInfo.scripts = renderingInfo.scripts
            .filter(script => script.name !== 'system.js') // do not laod system.js if the tool wants it, it's already here
            .map(script => {
              if (script.path) {
                script.url = `${QServerBaseUrl}${script.path}`;
              }
              return script;
            })

          loadAllScripts(renderingInfo.scripts, this.element.shadowRoot);
        }

        this.previewElement.innerHTML = renderingInfo.markup;
      })
  }
}

function loadAllScripts(scripts, parentElement, index = 0, callback) {
  if (scripts && scripts[index] && scripts[index].url) {
    let script = scripts[index];
    let scriptElement = document.createElement('script');

    if (script.url) {
      scriptElement.src = script.url;
      script.async = true;

      scriptElement.onload = () => {
        console.log('script loaded')
        loadAllScripts(scripts, parentElement, index + 1, callback)
      }
      parentElement.appendChild(scriptElement);

    } else if (script.content) {
      scriptElement.innerHTML = script.content;
      parentElement.appendChild(scriptElement);
      loadAllScripts(scripts, parentElement, index + 1, callback)
    }

  } else if (typeof callback === 'function') {
    callback();
  }
}
