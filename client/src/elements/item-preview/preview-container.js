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

        this.previewElement.innerHTML = renderingInfo.markup;
    
        // load the stylesheets
        if (Array.isArray(renderingInfo.stylesheets)) {
          renderingInfo.stylesheets
            .map(stylesheet => {
              if (stylesheet.url) {
                return stylesheet.url;
              }
              if (stylesheet.path) {
                return `${QServerBaseUrl}${stylesheet.path}`
              }
            })
            .map(url => {
              if (url) {
                let link = document.createElement('link');
                link.type = 'text/css';
                link.rel = "stylesheet";
                link.href = url;
                this.element.shadowRoot.appendChild(link);
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

          loadAllScripts(renderingInfo.scripts);
        }
      })
  }
}

function loadAllScripts(scripts, index = 0, callback) {
  if (scripts && scripts[index] && scripts[index].url) {
    let script = document.createElement('script');

    if (script.url) {
      script.src = src;
      script.async = true;

      script.onload = () => {
        loadAllScripts(scripts, index + 1, callback)
      }
      this.element.shadowRoot.appendChild(script);

    } else if (script.content) {
      script.innerHTML = script.content;
      this.element.shadowRoot.appendChild(script);
      loadAllScripts(scripts, index + 1, callback)
    }

  } else {
    callback();
  }
}
