import { bindable, inject } from 'aurelia-framework'
import qEnv from 'resources/qEnv.js';
import MessageService from 'resources/MessageService.js';

@inject(MessageService)
export class ItemPreview {

  @bindable data
  @bindable id
  @bindable onDrag
  
  previewWidth = 540;

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

  constructor(messageService) {
    this.messageService = messageService;

    // we use this proxy to catch any changes to the target and then load the preview after we have it
    this.targetProxy = new Proxy({}, {
      set: (target, property, value, receiver) => {
        target[property] = value;
        this.loadPreview();
        return true;
      }
    })

    qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/editor/targets`);
      })
      .then(response => {
        if (response.ok && response.status >= 200 && response.status < 400) {
          return response.json();
        } else {
          throw new Error(response.statusText)
        }
      })
      .then(targets => {
        this.availableTargets = targets;
      })
      .catch(err => {
        this.messageService.pushMessage('error', 'failedLoadingTargets')
      })
  }

  dataChanged() {
    this.loadPreview();
  }

  idChanged() {
    this.loadPreview();
  }

  onDragChanged(onDrag, oldOnDrag) {
    if (this.onDrag && this.previewContainer) {
      this.ensureDragHandling()
    } else if (oldOnDrag && this.previewContainer) {
      this.previewContainer.removeAttribute('draggable');
      this.previewContainer.removeEventListener('dragstart', oldOnDrag);
    }
  }

  attached() {
    if (this.onDrag) {
      this.ensureDragHandling();
    }
    this.loadPreview();
  }

  ensureDragHandling() {
    if (this.onDrag) {
      this.previewContainer.setAttribute('draggable', true);
    }
    if (!this.dragEventListener) {
      this.dragEventListener = this.previewContainer.addEventListener('dragstart', this.onDrag);
    }
  }

  detached() {
    this.previewContainer.removeEventListener('dragstart', this.onDrag);
  }

  handleSizeChange() {
    this.previewContainer.style.width = `${this.previewWidth}px`;
    this.loadPreview();
  }

  fetchRenderingInfo() {
    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        if (this.id) {
          return fetch(`${QServerBaseUrl}/rendering-info/${this.id}/${this.targetProxy.target.key}`)
        } else if (this.data) {
          this.data.tool = this.data.tool.replace(new RegExp('-','g'), '_');
          const body = {
            item: this.data
          }
          return fetch(`${QServerBaseUrl}/rendering-info/${this.targetProxy.target.key}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        }
      })
      .then(res => {
        if (res.ok && res.status >= 200 && res.status < 400) {
          return res.json()
        }
        throw res.statusText
      })
      .then(renderingInfo => {
        // add stylesheets for target preview if any
        if (this.targetProxy.target.preview && this.targetProxy.target.preview.stylesheets) {
          if (!renderingInfo.stylesheets) {
            renderingInfo.stylesheets = []
          }
          this.targetProxy.target.preview.stylesheets.forEach(stylesheet => {
            renderingInfo.stylesheets.push(stylesheet);
          })
        }

        // add scripts for target preview if any
        if (this.targetProxy.target.preview && this.targetProxy.target.preview.scripts) {
          if (!renderingInfo.scripts) {
            renderingInfo.scripts = []
          }
          this.targetProxy.target.preview.scripts.forEach(script => {
            renderingInfo.scripts.push(script);
          })
        }
        return renderingInfo;
      })
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
      })
  }
}
