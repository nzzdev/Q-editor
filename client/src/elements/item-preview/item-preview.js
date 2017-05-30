import { bindable, inject } from 'aurelia-framework';
import qEnv from 'resources/qEnv.js';
import QTargets from 'resources/QTargets.js';
import MessageService from 'resources/MessageService.js';

@inject(QTargets, MessageService)
export class ItemPreview {

  @bindable data
  @bindable id
  @bindable target

  sizeOptions = [
    {
      value: 290,
      icon: 'mobile'
    },
    {
      value: 540,
      icon: 'tablet'
    },
    {
      value: 800,
      icon: 'widescreen'
    }
  ]

  constructor(qTargets, messageService) {
    this.qTargets = qTargets;
    this.messageService = messageService;

    // we use this proxy to catch any changes to the target and then load the preview after we have it
    this.targetProxy = new Proxy({}, {
      set: (target, property, value, receiver) => {
        target[property] = value;
        this.target = value;
        this.loadPreview();
        return true;
      }
    });

    // we use this proxy to catch any changes to the previewWidth and reload the preview renderingInfo on change
    this.previewWidthProxy = new Proxy({}, {
      set: (target, property, value, receiver) => {
        target[property] = value;
        this.handleSizeChange();
        return true;
      }
    });

    this.init();
  }

  async init() {
    // set the default preview width to the most narrow variant
    this.previewWidthProxy.width = this.sizeOptions[0].value;

    this.availableTargets = await this.qTargets.get('availableTargets');
  }

  dataChanged() {
    this.loadPreview();
  }

  idChanged() {
    this.loadPreview();
  }

  attached() {
    this.loadPreview();
  }

  handleSizeChange() {
    this.loadPreview();
  }

  fetchRenderingInfo() {
    const toolRuntimeConfig = {
      size: {
        width: [
          {
            value: this.previewContainer.getBoundingClientRect().width,
            comparison: '='
          }
        ]
      }
    };

    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        if (this.id) {
          return fetch(`${QServerBaseUrl}/rendering-info/${this.id}/${this.targetProxy.target.key}?ignoreInactive=true&noCache=true&toolRuntimeConfig=${encodeURI(JSON.stringify(toolRuntimeConfig))}`);
        } else if (this.data) {
          this.data.tool = this.data.tool.replace(new RegExp('-', 'g'), '_');
          const body = {
            item: this.data,
            toolRuntimeConfig: toolRuntimeConfig
          };
          return fetch(`${QServerBaseUrl}/rendering-info/${this.targetProxy.target.key}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      })
      .then(res => {
        if (res.ok && res.status >= 200 && res.status < 400) {
          return res.json();
        }
        throw res.statusText;
      })
      .then(renderingInfo => {
        // add stylesheets for target preview if any
        if (this.targetProxy.target.preview && this.targetProxy.target.preview.stylesheets) {
          if (!renderingInfo.stylesheets) {
            renderingInfo.stylesheets = [];
          }
          this.targetProxy.target.preview.stylesheets.forEach(stylesheet => {
            renderingInfo.stylesheets.push(stylesheet);
          });
        }

        // add scripts for target preview if any
        if (this.targetProxy.target.preview && this.targetProxy.target.preview.scripts) {
          if (!renderingInfo.scripts) {
            renderingInfo.scripts = [];
          }
          this.targetProxy.target.preview.scripts.forEach(script => {
            renderingInfo.scripts.push(script);
          });
        }
        return renderingInfo;
      });
  }

  loadPreview() {
    // if we have no target, we cannot load the preview
    if (!this.targetProxy.target || !this.targetProxy.target.key) {
      return;
    }
    // either an id or data is needed as well
    if (!this.id && !this.data) {
      return;
    }
    this.fetchRenderingInfo()
      .then(renderingInfo => {
        this.errorMessage = undefined;
        this.renderingInfo = renderingInfo;
      })
      .catch(errorMessage => {
        this.errorMessage = errorMessage;
        this.renderingInfo = {};
      });
  }
}
