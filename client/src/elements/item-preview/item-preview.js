import { bindable, inject, LogManager } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import qEnv from 'resources/qEnv.js';
import QTargets from 'resources/QTargets.js';
import QConfig from 'resources/QConfig.js';
import User from 'resources/User.js';

const log = LogManager.getLogger('Q');

@inject(QTargets, QConfig, User, I18N)
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
      value: 560,
      icon: 'tablet'
    },
    {
      value: 800,
      icon: 'widescreen'
    }
  ]

  constructor(qTargets, qConfig, user, i18n) {
    this.qTargets = qTargets;
    this.qConfig = qConfig;
    this.user = user;
    this.i18n = i18n;

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
    try {
      // set the default preview width to the most narrow variant
      this.previewWidthProxy.width = this.sizeOptions[0].value;

      this.availableTargets = await this.qTargets.get('availableTargets');

      // compile the list of publication filters
      // to have this BC compatible, we use targets if no publications are given
      this.publications = await this.qConfig.get('publications');
      if (!this.publications) {
        log.info('DEPRECATION NOTICE: Q editor will require publications to be defined in editorConfig and will not use targets if no publications are defined');
        this.publications = this.availableTargets
          .map(target => {
            return {
              key: target.key,
              label: target.label,
              previewTarget: target.key
            };
          });
      }

      // wait for user loaded
      // get the users default publication
      // if given, test if the users publication is configured
      // if so, get the default target of the users publication
      // then use this as the default preview target
      await this.user.loaded;
      if (this.user.data.publication) {
        let userDefaultPublication;
        // only use the users publication key if it is configured in the publications
        for (let publication of this.publications) {
          if (publication.key === this.user.data.publication) {
            userDefaultPublication = publication;
          }
        }
        if (userDefaultPublication) {
          // only use the users default target if there is a target
          // available with the previewTarget key in the publication config
          let userDefaultTarget;
          for (let target of this.availableTargets) {
            if (target.key === userDefaultPublication.previewTarget) {
              userDefaultTarget = target;
            }
          }
          // final test if userDefaultTarget is available and valid, then set it to the proxy
          // to trigger reload of the preview
          if (userDefaultTarget) {
            this.targetProxy.target = userDefaultTarget;
          }
        }
      }
      this.initialised = true;
    } catch (e) {
      log.error(e);
    }
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
            value: this.previewWidthProxy.width,
            comparison: '='
          }
        ]
      },
      isPure: true
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
        throw res;
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
      .catch(response => {
        if (response.status === 400) {
          this.errorMessage = this.i18n.tr('notifications.previewBadRequest');
        } else {
          this.errorMessage = response.statusText;
        }
        this.renderingInfo = {};
      });
  }

  getTargetForKey(targetKey) {
    for (let target of this.availableTargets) {
      if (targetKey === target.key) {
        return target;
      }
    }
    return undefined;
  }
}
