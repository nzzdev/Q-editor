import { bindable, observable, inject, LogManager } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import qEnv from "resources/qEnv.js";
import QTargets from "resources/QTargets.js";
import QConfig from "resources/QConfig.js";
import User from "resources/User.js";

const log = LogManager.getLogger("Q");

const defaultSizeOptions = [
  {
    value: 290,
    min_height: 568,
    label_i18n_key: "preview.small"
  },
  {
    value: 560,
    min_height: 568,
    label_i18n_key: "preview.medium"
  },
  {
    value: 800,
    min_height: 568,
    label_i18n_key: "preview.large"
  }
];

@inject(QTargets, QConfig, User, I18N, Element)
export class ItemPreview {
  @bindable
  data;
  @bindable
  id;
  @bindable
  target;
  @observable
  error = false;

  sizeOptions = [];
  errorMessage = "";

  constructor(qTargets, qConfig, user, i18n, element) {
    this.qTargets = qTargets;
    this.qConfig = qConfig;
    this.user = user;
    this.i18n = i18n;
    this.element = element;

    // we track the preview widths the user clicked
    // to hide the notification about checking all of them if he has done so
    this.sizeOptionsChecked = [];

    // we use this proxy to catch any changes to the target and then load the preview after we have it
    this.targetProxy = new Proxy(
      {},
      {
        set: (target, property, value, receiver) => {
          // Only update value if it is different from previous value
          if (target[property] !== value) {
            target[property] = value;
            this.target = value;
            this.loadPreview();
          }
          return true;
        }
      }
    );

    // we use this proxy to catch any changes to the previewWidth and reload the preview renderingInfo on change
    this.previewWidthProxy = new Proxy(
      {},
      {
        set: (target, property, value, receiver) => {
          // Only update value if it is different from previous value
          if (target[property] !== value) {
            target[property] = value;
            this.handleSizeChange();
          }
          return true;
        }
      }
    );

    this.init();
  }

  async init() {
    try {
      // set the preview size options
      const previewSizes = await this.qConfig.get("previewSizes");
      if (previewSizes) {
        this.sizeOptions = [];
        for (let previewSizeName in previewSizes) {
          const previewSize = previewSizes[previewSizeName];
          const sizeOption = {
            value: previewSize.value,
            min_height: previewSize.min_height || 568,
            label_i18n_key: `preview.${previewSizeName}`
          };
          if (previewSize.label) {
            sizeOption.label = previewSize.label;
          }
          this.sizeOptions.push(sizeOption);
        }
      } else {
        this.sizeOptions = defaultSizeOptions;
      }

      // set the default preview width to the most narrow variant
      this.previewWidthProxy.width = this.sizeOptions[0].value;

      const availableTargets = await this.qTargets.get("availableTargets");

      // get the list of publication filters
      const publications = await this.qConfig.get("publications");

      // wait for user loaded
      // get the users default publication
      // if given, test if the users publication is configured
      // if so, get the default target of the users publication
      // then use this as the default preview target
      await this.user.loaded;
      if (this.user.data.publication) {
        let userDefaultPublication;
        // only use the users publication key if it is configured in the publications
        for (let publication of publications) {
          if (publication.key === this.user.data.publication) {
            userDefaultPublication = publication;
          }
        }
        if (userDefaultPublication) {
          // only use the users default target if there is a target
          // available with the previewTarget key in the publication config
          let userDefaultTarget;
          for (let target of availableTargets) {
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

      if (!this.targetProxy.target) {
        this.targetProxy.target = availableTargets[0];
      }

      this.initialised = true;
    } catch (e) {
      log.error(e);
    }
  }

  getCurrentSizeOption() {
    return this.sizeOptions.find(option => {
      return option.value === this.previewWidthProxy.width;
    });
  }

  dataChanged(newValue, oldValue) {
    this.sizeOptionsChecked = [this.previewWidthProxy.width];
    this.applyPreviewHint();
    this.loadPreview();
  }

  idChanged() {
    this.loadPreview();
  }

  errorChanged() {
    if (this.error && this.errorMessage) {
      this.notification = {
        message: {
          title: "preview.technicalError.title",
          body: "preview.technicalError.body",
          parameters: {
            errorMessage: this.errorMessage
          }
        },
        priority: {
          type: "high",
          value: 10
        }
      };
    } else if (!this.error) {
      this.applyPreviewHint();
    }
  }

  areAllSizeOptionsChecked() {
    for (const sizeOption of this.sizeOptions) {
      if (!this.sizeOptionsChecked.includes(sizeOption.value)) {
        return false;
      }
    }
    return true;
  }

  applyPreviewHint() {
    if (!this.areAllSizeOptionsChecked()) {
      this.notification = {
        message: {
          title: "preview.hint.title",
          body: "preview.hint.body"
        },
        priority: {
          type: "low",
          value: 10
        }
      };
    } else {
      this.notification = null;
    }
  }

  handleSizeChange() {
    this.sizeOptionsChecked.push(this.previewWidthProxy.width);
    this.applyPreviewHint();
    // set the min-height if configured;
    this.element.style.setProperty(
      "--q-preview-min-height",
      `${this.getCurrentSizeOption().min_height}px`
    );
    this.loadPreview();
  }

  fetchRenderingInfo() {
    const toolRuntimeConfig = {
      size: {
        width: [
          {
            value: this.previewWidthProxy.width,
            comparison: "="
          }
        ]
      },
      isPure: true
    };

    return qEnv.QServerBaseUrl.then(QServerBaseUrl => {
      if (this.id) {
        return fetch(
          `${QServerBaseUrl}/rendering-info/${this.id}/${
            this.targetProxy.target.key
          }?ignoreInactive=true&noCache=true&toolRuntimeConfig=${encodeURI(
            JSON.stringify(toolRuntimeConfig)
          )}`
        );
      } else if (this.data) {
        const body = {
          item: this.data,
          toolRuntimeConfig: toolRuntimeConfig
        };
        return fetch(
          `${QServerBaseUrl}/rendering-info/${this.targetProxy.target.key}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
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
        if (
          this.targetProxy.target.preview &&
          this.targetProxy.target.preview.stylesheets
        ) {
          if (!renderingInfo.stylesheets) {
            renderingInfo.stylesheets = [];
          }
          this.targetProxy.target.preview.stylesheets.forEach(stylesheet => {
            renderingInfo.stylesheets.push(stylesheet);
          });
        }

        // add scripts for target preview if any
        if (
          this.targetProxy.target.preview &&
          this.targetProxy.target.preview.scripts
        ) {
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
    this.loadingStatus = "loading";
    this.fetchRenderingInfo()
      .then(renderingInfo => {
        this.renderingInfo = renderingInfo;
        this.error = undefined;
        this.errorMessage = undefined;
        this.loadingStatus = "loaded";
      })
      .catch(response => {
        if (![400, 500].includes(response.status)) {
          this.errorMessage = response.statusText;
        }
        this.error = true;
        this.renderingInfo = {};
        this.loadingStatus = "loaded";
      });
  }
}
