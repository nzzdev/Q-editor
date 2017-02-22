System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  map: {
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.1",
    "aurelia-binding": "npm:aurelia-binding@1.1.1",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.1",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
    "aurelia-dialog": "npm:aurelia-dialog@1.0.0-beta.3.0.1",
    "aurelia-fetch-client": "npm:aurelia-fetch-client@1.1.1",
    "aurelia-framework": "npm:aurelia-framework@1.0.8",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0",
    "aurelia-i18n": "npm:aurelia-i18n@1.3.0",
    "aurelia-loader": "npm:aurelia-loader@1.0.0",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.1",
    "aurelia-logging": "npm:aurelia-logging@1.3.0",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
    "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
    "aurelia-pal": "npm:aurelia-pal@1.3.0",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.1.0",
    "aurelia-path": "npm:aurelia-path@1.1.1",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.2.0",
    "aurelia-router": "npm:aurelia-router@1.2.0",
    "aurelia-task-queue": "npm:aurelia-task-queue@1.2.0",
    "aurelia-templating": "npm:aurelia-templating@1.2.0",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.2.0",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.2.0",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.1",
    "aurelia-testing": "npm:aurelia-testing@1.0.0-beta.2.0.1",
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "core-js": "npm:core-js@1.2.7",
    "css": "github:systemjs/plugin-css@0.1.32",
    "fetch": "github:github/fetch@1.1.1",
    "i18next-xhr-backend": "npm:i18next-xhr-backend@1.3.0",
    "leaflet": "npm:leaflet@1.0.3",
    "leaflet-geocoder-mapzen": "npm:leaflet-geocoder-mapzen@1.7.1",
    "text": "github:systemjs/plugin-text@0.0.8",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.9"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-binding@1.1.1": {
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.2.0"
    },
    "npm:aurelia-bootstrapper@1.0.1": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-framework": "npm:aurelia-framework@1.0.8",
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.1",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.1.0",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.2.0",
      "aurelia-router": "npm:aurelia-router@1.2.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.2.0",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.2.0",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.1"
    },
    "npm:aurelia-dependency-injection@1.3.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0"
    },
    "npm:aurelia-dialog@1.0.0-beta.3.0.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-event-aggregator@1.0.1": {
      "aurelia-logging": "npm:aurelia-logging@1.3.0"
    },
    "npm:aurelia-framework@1.0.8": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.2.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-history-browser@1.0.0": {
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.3.0"
    },
    "npm:aurelia-i18n@1.3.0": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.2.0",
      "i18next": "npm:i18next@3.5.2",
      "intl": "npm:intl@1.2.5"
    },
    "npm:aurelia-loader-default@1.0.1": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0"
    },
    "npm:aurelia-loader@1.0.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-logging-console@1.0.0": {
      "aurelia-logging": "npm:aurelia-logging@1.3.0"
    },
    "npm:aurelia-metadata@1.0.3": {
      "aurelia-pal": "npm:aurelia-pal@1.3.0"
    },
    "npm:aurelia-pal-browser@1.1.0": {
      "aurelia-pal": "npm:aurelia-pal@1.3.0"
    },
    "npm:aurelia-polyfills@1.2.0": {
      "aurelia-pal": "npm:aurelia-pal@1.3.0"
    },
    "npm:aurelia-route-recognizer@1.1.0": {
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-router@1.2.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.1.0"
    },
    "npm:aurelia-task-queue@1.2.0": {
      "aurelia-pal": "npm:aurelia-pal@1.3.0"
    },
    "npm:aurelia-templating-binding@1.2.0": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-templating-resources@1.2.0": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.2.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-templating-router@1.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-router": "npm:aurelia-router@1.2.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-templating@1.2.0": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.2.0"
    },
    "npm:aurelia-testing@1.0.0-beta.2.0.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-framework": "npm:aurelia-framework@1.0.8",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-pal": "npm:aurelia-pal@1.3.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.8",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:i18next@3.5.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:intl@1.2.5": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:isarray@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:leaflet-geocoder-mapzen@1.7.1": {
      "leaflet": "npm:leaflet@1.0.3",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.9": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  },
  bundles: {
    "aurelia-fafc8e499e.js": [
      "github:github/fetch@1.1.1.js",
      "github:github/fetch@1.1.1/fetch.js",
      "github:jspm/nodelibs-process@0.1.2.js",
      "github:jspm/nodelibs-process@0.1.2/index.js",
      "npm:aurelia-animator-css@1.0.1.js",
      "npm:aurelia-animator-css@1.0.1/aurelia-animator-css.js",
      "npm:aurelia-binding@1.1.1.js",
      "npm:aurelia-binding@1.1.1/aurelia-binding.js",
      "npm:aurelia-bootstrapper@1.0.1.js",
      "npm:aurelia-bootstrapper@1.0.1/aurelia-bootstrapper.js",
      "npm:aurelia-dependency-injection@1.3.0.js",
      "npm:aurelia-dependency-injection@1.3.0/aurelia-dependency-injection.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/ai-dialog-body.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/ai-dialog-footer.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/ai-dialog-header.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/ai-dialog.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/attach-focus.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/aurelia-dialog.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-configuration.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-controller.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-options.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-renderer.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-result.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-service.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/lifecycle.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/renderer.js",
      "npm:aurelia-event-aggregator@1.0.1.js",
      "npm:aurelia-event-aggregator@1.0.1/aurelia-event-aggregator.js",
      "npm:aurelia-fetch-client@1.1.1.js",
      "npm:aurelia-fetch-client@1.1.1/aurelia-fetch-client.js",
      "npm:aurelia-framework@1.0.8.js",
      "npm:aurelia-framework@1.0.8/aurelia-framework.js",
      "npm:aurelia-history-browser@1.0.0.js",
      "npm:aurelia-history-browser@1.0.0/aurelia-history-browser.js",
      "npm:aurelia-history@1.0.0.js",
      "npm:aurelia-history@1.0.0/aurelia-history.js",
      "npm:aurelia-i18n@1.3.0.js",
      "npm:aurelia-i18n@1.3.0/aurelia-i18n-loader.js",
      "npm:aurelia-i18n@1.3.0/aurelia-i18n.js",
      "npm:aurelia-i18n@1.3.0/base-i18n.js",
      "npm:aurelia-i18n@1.3.0/defaultTranslations/relative.time.js",
      "npm:aurelia-i18n@1.3.0/df.js",
      "npm:aurelia-i18n@1.3.0/i18n.js",
      "npm:aurelia-i18n@1.3.0/nf.js",
      "npm:aurelia-i18n@1.3.0/relativeTime.js",
      "npm:aurelia-i18n@1.3.0/rt.js",
      "npm:aurelia-i18n@1.3.0/t.js",
      "npm:aurelia-i18n@1.3.0/utils.js",
      "npm:aurelia-loader-default@1.0.1.js",
      "npm:aurelia-loader-default@1.0.1/aurelia-loader-default.js",
      "npm:aurelia-loader@1.0.0.js",
      "npm:aurelia-loader@1.0.0/aurelia-loader.js",
      "npm:aurelia-logging-console@1.0.0.js",
      "npm:aurelia-logging-console@1.0.0/aurelia-logging-console.js",
      "npm:aurelia-logging@1.3.0.js",
      "npm:aurelia-logging@1.3.0/aurelia-logging.js",
      "npm:aurelia-metadata@1.0.3.js",
      "npm:aurelia-metadata@1.0.3/aurelia-metadata.js",
      "npm:aurelia-pal-browser@1.1.0.js",
      "npm:aurelia-pal-browser@1.1.0/aurelia-pal-browser.js",
      "npm:aurelia-pal@1.3.0.js",
      "npm:aurelia-pal@1.3.0/aurelia-pal.js",
      "npm:aurelia-path@1.1.1.js",
      "npm:aurelia-path@1.1.1/aurelia-path.js",
      "npm:aurelia-polyfills@1.2.0.js",
      "npm:aurelia-polyfills@1.2.0/aurelia-polyfills.js",
      "npm:aurelia-route-recognizer@1.1.0.js",
      "npm:aurelia-route-recognizer@1.1.0/aurelia-route-recognizer.js",
      "npm:aurelia-router@1.2.0.js",
      "npm:aurelia-router@1.2.0/aurelia-router.js",
      "npm:aurelia-task-queue@1.2.0.js",
      "npm:aurelia-task-queue@1.2.0/aurelia-task-queue.js",
      "npm:aurelia-templating-binding@1.2.0.js",
      "npm:aurelia-templating-binding@1.2.0/aurelia-templating-binding.js",
      "npm:aurelia-templating-resources@1.2.0.js",
      "npm:aurelia-templating-resources@1.2.0/abstract-repeater.js",
      "npm:aurelia-templating-resources@1.2.0/analyze-view-factory.js",
      "npm:aurelia-templating-resources@1.2.0/array-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/attr-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/aurelia-hide-style.js",
      "npm:aurelia-templating-resources@1.2.0/aurelia-templating-resources.js",
      "npm:aurelia-templating-resources@1.2.0/binding-mode-behaviors.js",
      "npm:aurelia-templating-resources@1.2.0/binding-signaler.js",
      "npm:aurelia-templating-resources@1.2.0/compose.js",
      "npm:aurelia-templating-resources@1.2.0/css-resource.js",
      "npm:aurelia-templating-resources@1.2.0/debounce-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/dynamic-element.js",
      "npm:aurelia-templating-resources@1.2.0/focus.js",
      "npm:aurelia-templating-resources@1.2.0/hide.js",
      "npm:aurelia-templating-resources@1.2.0/html-resource-plugin.js",
      "npm:aurelia-templating-resources@1.2.0/html-sanitizer.js",
      "npm:aurelia-templating-resources@1.2.0/if.js",
      "npm:aurelia-templating-resources@1.2.0/map-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/null-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/number-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/repeat-strategy-locator.js",
      "npm:aurelia-templating-resources@1.2.0/repeat-utilities.js",
      "npm:aurelia-templating-resources@1.2.0/repeat.js",
      "npm:aurelia-templating-resources@1.2.0/replaceable.js",
      "npm:aurelia-templating-resources@1.2.0/sanitize-html.js",
      "npm:aurelia-templating-resources@1.2.0/set-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/show.js",
      "npm:aurelia-templating-resources@1.2.0/signal-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/throttle-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/update-trigger-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/with.js",
      "npm:aurelia-templating-router@1.0.1.js",
      "npm:aurelia-templating-router@1.0.1/aurelia-templating-router.js",
      "npm:aurelia-templating-router@1.0.1/route-href.js",
      "npm:aurelia-templating-router@1.0.1/route-loader.js",
      "npm:aurelia-templating-router@1.0.1/router-view.js",
      "npm:aurelia-templating@1.2.0.js",
      "npm:aurelia-templating@1.2.0/aurelia-templating.js",
      "npm:i18next-xhr-backend@1.3.0.js",
      "npm:i18next-xhr-backend@1.3.0/dist/commonjs/ajax.js",
      "npm:i18next-xhr-backend@1.3.0/dist/commonjs/index.js",
      "npm:i18next-xhr-backend@1.3.0/dist/commonjs/utils.js",
      "npm:i18next-xhr-backend@1.3.0/index.js",
      "npm:i18next@3.5.2.js",
      "npm:i18next@3.5.2/dist/commonjs/BackendConnector.js",
      "npm:i18next@3.5.2/dist/commonjs/CacheConnector.js",
      "npm:i18next@3.5.2/dist/commonjs/EventEmitter.js",
      "npm:i18next@3.5.2/dist/commonjs/Interpolator.js",
      "npm:i18next@3.5.2/dist/commonjs/LanguageUtils.js",
      "npm:i18next@3.5.2/dist/commonjs/PluralResolver.js",
      "npm:i18next@3.5.2/dist/commonjs/ResourceStore.js",
      "npm:i18next@3.5.2/dist/commonjs/Translator.js",
      "npm:i18next@3.5.2/dist/commonjs/compatibility/v1.js",
      "npm:i18next@3.5.2/dist/commonjs/defaults.js",
      "npm:i18next@3.5.2/dist/commonjs/i18next.js",
      "npm:i18next@3.5.2/dist/commonjs/index.js",
      "npm:i18next@3.5.2/dist/commonjs/logger.js",
      "npm:i18next@3.5.2/dist/commonjs/postProcessor.js",
      "npm:i18next@3.5.2/dist/commonjs/utils.js",
      "npm:i18next@3.5.2/index.js",
      "npm:process@0.11.9.js",
      "npm:process@0.11.9/browser.js"
    ],
    "resources-6d4512e0c0.js": [
      "resources/Auth.js",
      "resources/DragDataGenerator.js",
      "resources/EmbedCodeGenerator.js",
      "resources/Item.js",
      "resources/ItemStore.js",
      "resources/MessageService.js",
      "resources/QConfig.js",
      "resources/Statistics.js",
      "resources/ToolsInfo.js",
      "resources/User.js",
      "resources/qEnv.js"
    ],
    "q-editor-bundle-cf0cc164f1.js": [
      "dialogs/confirm-dialog.js",
      "dialogs/item-dialog.js",
      "elements/item-preview/item-preview.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/item-preview/item-preview.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/item-preview/item-preview.js",
      "elements/item-preview/preview-container.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/item-preview/preview-container.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/item-preview/preview-container.js",
      "elements/organisms/tool-status-bar.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/organisms/tool-status-bar.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/organisms/tool-status-bar.js",
      "elements/schema-editor/helpers.js",
      "elements/schema-editor/schema-editor-array.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-array.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-array.js",
      "elements/schema-editor/schema-editor-base64image.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-base64image.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-base64image.js",
      "elements/schema-editor/schema-editor-boolean.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-lat-lng.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-lat-lng.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-lat-lng.js",
      "elements/schema-editor/schema-editor-link.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-link.js",
      "elements/schema-editor/schema-editor-number.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-number.js",
      "elements/schema-editor/schema-editor-object.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-object.js",
      "elements/schema-editor/schema-editor-select.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-select.js",
      "elements/schema-editor/schema-editor-string.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-url.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-wrapper.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor-wrapper.js",
      "elements/schema-editor/schema-editor.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/schema-editor/schema-editor.js",
      "helpers/generateFromSchema.js",
      "npm:leaflet-geocoder-mapzen@1.7.1.js",
      "npm:leaflet-geocoder-mapzen@1.7.1/dist/leaflet-geocoder-mapzen.css!github:systemjs/plugin-css@0.1.32.js",
      "npm:leaflet-geocoder-mapzen@1.7.1/dist/leaflet-geocoder-mapzen.js",
      "npm:leaflet@1.0.3.js",
      "npm:leaflet@1.0.3/dist/leaflet-src.js",
      "npm:leaflet@1.0.3/dist/leaflet.css!github:systemjs/plugin-css@0.1.32.js",
      "pages/editor.html!github:systemjs/plugin-text@0.0.8.js",
      "pages/editor.js"
    ],
    "q-bundle-c5a78b2873.js": [
      "app.html!github:systemjs/plugin-text@0.0.8.js",
      "app.js",
      "dialogs/account-dialog.html!github:systemjs/plugin-text@0.0.8.js",
      "dialogs/account-dialog.js",
      "dialogs/confirm-dialog.html!github:systemjs/plugin-text@0.0.8.js",
      "dialogs/help-dialog.html!github:systemjs/plugin-text@0.0.8.js",
      "dialogs/help-dialog.js",
      "dialogs/item-dialog.css!github:systemjs/plugin-text@0.0.8.js",
      "dialogs/item-dialog.html!github:systemjs/plugin-text@0.0.8.js",
      "eastereggs.js",
      "elements/atoms/box-icon.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/box-icon.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/button-no.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/button-no.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/button-primary.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/button-primary.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/button-secondary.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/button-secondary.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/button-yes.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/button-yes.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/icon-button.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/icon-button.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/atoms/icon-button.js",
      "elements/atoms/index.js",
      "elements/atoms/q-loader.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/confirm-button.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/confirm-button.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/confirm-button.js",
      "elements/molecules/delete-button.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/index.js",
      "elements/molecules/item-list-entry.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/item-list-entry.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/item-list-entry.js",
      "elements/molecules/q-messages.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/q-messages.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/q-messages.js",
      "elements/molecules/radio-button-group.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/radio-button-group.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/molecules/radio-button-group.js",
      "elements/organisms/index.js",
      "elements/organisms/item-list.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/organisms/item-list.js",
      "elements/organisms/meta-editor.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/organisms/meta-editor.js",
      "elements/organisms/q-bar.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/organisms/q-bar.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/organisms/q-bar.js",
      "elements/organisms/tool-selection.css!github:systemjs/plugin-text@0.0.8.js",
      "elements/organisms/tool-selection.html!github:systemjs/plugin-text@0.0.8.js",
      "elements/organisms/tool-selection.js",
      "github:systemjs/plugin-css@0.1.32.js",
      "github:systemjs/plugin-css@0.1.32/css.js",
      "github:systemjs/plugin-text@0.0.8.js",
      "github:systemjs/plugin-text@0.0.8/text.js",
      "icons/icon-abort.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-activate.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-active-state.css!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-active-state.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-add.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-back.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-blueprint.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-close.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-deactivate.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-delete.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-down.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-edit.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-export-svg.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-help.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-logo.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-logo.js",
      "icons/icon-logout.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-m.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-m.js",
      "icons/icon-message-error.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-message-info.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-message-success.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-message-warning.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-mobile.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-next.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-no.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-proceed.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-save-state.css!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-save-state.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-save.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-tablet.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-up.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-widescreen.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/icon-yes.html!github:systemjs/plugin-text@0.0.8.js",
      "icons/index.js",
      "main.js",
      "pages/editor.css!github:systemjs/plugin-text@0.0.8.js",
      "pages/index.css!github:systemjs/plugin-text@0.0.8.js",
      "pages/index.html!github:systemjs/plugin-text@0.0.8.js",
      "pages/index.js",
      "pages/item-overview.css!github:systemjs/plugin-text@0.0.8.js",
      "pages/item-overview.html!github:systemjs/plugin-text@0.0.8.js",
      "pages/item-overview.js",
      "pages/login.html!github:systemjs/plugin-text@0.0.8.js",
      "pages/login.js",
      "styles/app.css!github:systemjs/plugin-text@0.0.8.js",
      "styles/config.css!github:systemjs/plugin-text@0.0.8.js",
      "styles/fonts.css!github:systemjs/plugin-text@0.0.8.js",
      "styles/layout.css!github:systemjs/plugin-text@0.0.8.js",
      "styles/q-dialog.css!github:systemjs/plugin-text@0.0.8.js",
      "styles/q-form.css!github:systemjs/plugin-text@0.0.8.js",
      "value-converters/KeysValueConverter.js",
      "value-converters/TimeAgoValueConverter.js",
      "value-converters/index.js"
    ]
  },
  depCache: {
    "npm:leaflet-geocoder-mapzen@1.7.1.js": [
      "npm:leaflet-geocoder-mapzen@1.7.1/dist/leaflet-geocoder-mapzen.js"
    ],
    "npm:leaflet-geocoder-mapzen@1.7.1/dist/leaflet-geocoder-mapzen.js": [
      "leaflet"
    ],
    "npm:leaflet@1.0.3.js": [
      "npm:leaflet@1.0.3/dist/leaflet-src.js"
    ],
    "elements/organisms/tool-status-bar.js": [
      "aurelia-framework",
      "aurelia-dialog",
      "dialogs/item-dialog.js",
      "dialogs/confirm-dialog.js",
      "resources/MessageService.js"
    ],
    "dialogs/confirm-dialog.js": [
      "aurelia-framework",
      "aurelia-dependency-injection",
      "aurelia-dialog"
    ],
    "dialogs/item-dialog.js": [
      "aurelia-framework",
      "aurelia-dialog",
      "resources/EmbedCodeGenerator.js"
    ],
    "elements/item-preview/preview-container.js": [
      "aurelia-framework",
      "resources/qEnv.js"
    ],
    "elements/item-preview/item-preview.js": [
      "aurelia-framework",
      "resources/qEnv.js",
      "resources/MessageService.js"
    ],
    "elements/schema-editor/schema-editor.js": [
      "aurelia-framework"
    ],
    "elements/schema-editor/schema-editor-wrapper.js": [
      "aurelia-framework",
      "./helpers"
    ],
    "elements/schema-editor/schema-editor-select.js": [
      "aurelia-framework"
    ],
    "elements/schema-editor/schema-editor-object.js": [
      "aurelia-framework",
      "./helpers.js"
    ],
    "elements/schema-editor/schema-editor-number.js": [
      "aurelia-framework"
    ],
    "elements/schema-editor/schema-editor-link.js": [
      "aurelia-framework"
    ],
    "elements/schema-editor/schema-editor-lat-lng.js": [
      "resources/qEnv",
      "aurelia-framework",
      "leaflet",
      "npm:leaflet@1.0.3/dist/leaflet.css!",
      "npm:leaflet-geocoder-mapzen@1.7.1",
      "npm:leaflet-geocoder-mapzen@1.7.1/dist/leaflet-geocoder-mapzen.css!"
    ],
    "elements/schema-editor/schema-editor-base64image.js": [
      "aurelia-framework"
    ],
    "elements/schema-editor/schema-editor-array.js": [
      "aurelia-framework",
      "helpers/generateFromSchema.js"
    ],
    "pages/editor.js": [
      "aurelia-framework",
      "aurelia-dialog",
      "aurelia-i18n",
      "dialogs/confirm-dialog.js",
      "resources/qEnv.js",
      "resources/MessageService.js",
      "resources/ItemStore.js",
      "helpers/generateFromSchema.js"
    ],
    "github:systemjs/plugin-css@0.1.32.js": [
      "github:systemjs/plugin-css@0.1.32/css"
    ],
    "github:systemjs/plugin-text@0.0.8.js": [
      "github:systemjs/plugin-text@0.0.8/text"
    ],
    "value-converters/TimeAgoValueConverter.js": [
      "aurelia-framework",
      "aurelia-i18n"
    ],
    "value-converters/KeysValueConverter.js": [
      "aurelia-framework"
    ],
    "pages/login.js": [
      "aurelia-framework",
      "aurelia-router",
      "aurelia-i18n",
      "resources/Auth.js",
      "resources/User.js"
    ],
    "pages/item-overview.js": [
      "aurelia-framework",
      "aurelia-router",
      "aurelia-i18n",
      "resources/ItemStore.js",
      "resources/MessageService.js",
      "resources/EmbedCodeGenerator.js",
      "resources/DragDataGenerator.js"
    ],
    "pages/index.js": [
      "aurelia-framework",
      "aurelia-router",
      "resources/User.js",
      "resources/ItemStore.js",
      "resources/ToolsInfo.js",
      "resources/Statistics.js",
      "resources/QConfig.js"
    ],
    "main.js": [
      "resources/QConfig.js",
      "resources/Auth.js",
      "resources/User.js",
      "resources/MessageService.js",
      "resources/EmbedCodeGenerator.js",
      "resources/ItemStore.js",
      "resources/Statistics.js",
      "resources/ToolsInfo.js",
      "resources/qEnv.js",
      "eastereggs.js",
      "aurelia-i18n",
      "i18next-xhr-backend"
    ],
    "icons/icon-m.js": [
      "aurelia-framework",
      "resources/QConfig.js"
    ],
    "icons/icon-logo.js": [
      "aurelia-framework"
    ],
    "elements/organisms/tool-selection.js": [
      "aurelia-framework",
      "resources/ToolsInfo"
    ],
    "elements/organisms/q-bar.js": [
      "aurelia-framework",
      "aurelia-dialog",
      "aurelia-router",
      "dialogs/help-dialog",
      "dialogs/account-dialog",
      "resources/User.js",
      "resources/Auth.js"
    ],
    "dialogs/help-dialog.js": [
      "aurelia-framework",
      "aurelia-dependency-injection",
      "aurelia-dialog",
      "resources/QConfig.js"
    ],
    "dialogs/account-dialog.js": [
      "aurelia-framework",
      "aurelia-dependency-injection",
      "aurelia-dialog",
      "aurelia-router",
      "aurelia-i18n",
      "resources/QConfig.js",
      "resources/User.js",
      "resources/Auth.js"
    ],
    "elements/organisms/meta-editor.js": [
      "aurelia-framework",
      "resources/QConfig"
    ],
    "elements/organisms/item-list.js": [
      "aurelia-framework"
    ],
    "elements/molecules/radio-button-group.js": [
      "aurelia-framework"
    ],
    "elements/molecules/q-messages.js": [
      "aurelia-framework",
      "resources/MessageService.js"
    ],
    "elements/molecules/item-list-entry.js": [
      "aurelia-framework",
      "aurelia-router",
      "resources/User",
      "resources/ToolsInfo",
      "resources/DragDataGenerator"
    ],
    "elements/molecules/confirm-button.js": [
      "aurelia-framework"
    ],
    "elements/atoms/icon-button.js": [
      "aurelia-framework"
    ],
    "app.js": [
      "aurelia-framework",
      "aurelia-router",
      "resources/User.js",
      "resources/QConfig.js",
      "resources/qEnv.js"
    ]
  }
});