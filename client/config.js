System.config({
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "ajv": "npm:ajv@5.5.2",
    "array2d": "npm:array2d@0.0.5",
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.4",
    "aurelia-authentication": "npm:aurelia-authentication@3.7.0",
    "aurelia-binding": "npm:aurelia-binding@1.7.1",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@2.2.0",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
    "aurelia-dialog": "npm:aurelia-dialog@1.0.0-rc.2.0.0",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
    "aurelia-fetch-client": "npm:aurelia-fetch-client@1.3.1",
    "aurelia-framework": "npm:aurelia-framework@1.2.0",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.1.1",
    "aurelia-i18n": "npm:aurelia-i18n@2.1.2",
    "aurelia-loader": "npm:aurelia-loader@1.0.0",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.4",
    "aurelia-logging": "npm:aurelia-logging@1.4.0",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
    "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
    "aurelia-notification": "npm:aurelia-notification@1.0.0",
    "aurelia-pal": "npm:aurelia-pal@1.8.0",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.8.0",
    "aurelia-path": "npm:aurelia-path@1.1.1",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.3.0",
    "aurelia-router": "npm:aurelia-router@1.5.0",
    "aurelia-task-queue": "npm:aurelia-task-queue@1.2.1",
    "aurelia-templating": "npm:aurelia-templating@1.7.0",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.4.1",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.6.0",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.3.1",
    "aurelia-testing": "npm:aurelia-testing@1.0.0-beta.4.0.0",
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "core-js": "npm:core-js@1.2.7",
    "css": "github:systemjs/plugin-css@0.1.37",
    "dropzone": "npm:dropzone@5.4.0",
    "handsontable": "github:handsontable/handsontable@2.0.0",
    "heyman/leaflet-areaselect": "github:heyman/leaflet-areaselect@master",
    "i18next-fetch-backend": "npm:i18next-fetch-backend@0.0.1",
    "leaflet": "github:Leaflet/Leaflet@1.3.1",
    "leaflet-geocoder-mapzen": "npm:leaflet-geocoder-mapzen@1.8.0",
    "leaflet-search": "npm:leaflet-search@2.3.7",
    "moment": "npm:moment@2.22.0",
    "text": "github:systemjs/plugin-text@0.0.8",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.1": {
      "buffer": "npm:buffer@5.1.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.10"
    },
    "github:jspm/nodelibs-punycode@0.1.0": {
      "punycode": "npm:punycode@1.3.2"
    },
    "github:jspm/nodelibs-querystring@0.1.0": {
      "querystring": "npm:querystring@0.2.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:ajv@5.5.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "co": "npm:co@4.6.0",
      "fast-deep-equal": "npm:fast-deep-equal@1.1.0",
      "fast-json-stable-stringify": "npm:fast-json-stable-stringify@2.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "json-schema-traverse": "npm:json-schema-traverse@0.3.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "punycode": "github:jspm/nodelibs-punycode@0.1.0",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:array2d@0.0.5": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.4": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-templating": "npm:aurelia-templating@1.7.0"
    },
    "npm:aurelia-api@3.1.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-fetch-client": "npm:aurelia-fetch-client@1.3.1",
      "aurelia-framework": "npm:aurelia-framework@1.2.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "extend": "npm:extend@3.0.1"
    },
    "npm:aurelia-authentication@3.7.0": {
      "aurelia-api": "npm:aurelia-api@3.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-fetch-client": "npm:aurelia-fetch-client@1.3.1",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-router": "npm:aurelia-router@1.5.0",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.6.0",
      "extend": "npm:extend@3.0.1",
      "jwt-decode": "npm:jwt-decode@2.2.0"
    },
    "npm:aurelia-binding@1.7.1": {
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.2.1"
    },
    "npm:aurelia-bootstrapper@2.2.0": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-framework": "npm:aurelia-framework@1.2.0",
      "aurelia-history": "npm:aurelia-history@1.1.0",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.1.1",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.4",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.8.0",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.3.0",
      "aurelia-router": "npm:aurelia-router@1.5.0",
      "aurelia-templating": "npm:aurelia-templating@1.7.0",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.4.1",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.6.0",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.3.1"
    },
    "npm:aurelia-dependency-injection@1.3.2": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0"
    },
    "npm:aurelia-dialog@1.0.0-rc.2.0.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-templating": "npm:aurelia-templating@1.7.0"
    },
    "npm:aurelia-event-aggregator@1.0.1": {
      "aurelia-logging": "npm:aurelia-logging@1.4.0"
    },
    "npm:aurelia-framework@1.2.0": {
      "aurelia-binding": "npm:aurelia-binding@1.7.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.2.1",
      "aurelia-templating": "npm:aurelia-templating@1.7.0"
    },
    "npm:aurelia-history-browser@1.1.1": {
      "aurelia-history": "npm:aurelia-history@1.1.0",
      "aurelia-pal": "npm:aurelia-pal@1.8.0"
    },
    "npm:aurelia-i18n@2.1.2": {
      "aurelia-binding": "npm:aurelia-binding@1.7.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-templating": "npm:aurelia-templating@1.7.0",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.6.0",
      "i18next": "npm:i18next@9.1.0",
      "intl": "npm:intl@1.2.5"
    },
    "npm:aurelia-loader-default@1.0.4": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0"
    },
    "npm:aurelia-loader@1.0.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-logging-console@1.0.0": {
      "aurelia-logging": "npm:aurelia-logging@1.4.0"
    },
    "npm:aurelia-metadata@1.0.3": {
      "aurelia-pal": "npm:aurelia-pal@1.8.0"
    },
    "npm:aurelia-notification@1.0.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-i18n": "npm:aurelia-i18n@2.1.2",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "extend": "npm:extend@3.0.1",
      "humane-js": "npm:humane-js@3.2.2"
    },
    "npm:aurelia-pal-browser@1.8.0": {
      "aurelia-pal": "npm:aurelia-pal@1.8.0"
    },
    "npm:aurelia-polyfills@1.3.0": {
      "aurelia-pal": "npm:aurelia-pal@1.8.0"
    },
    "npm:aurelia-route-recognizer@1.1.1": {
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-router@1.5.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-history": "npm:aurelia-history@1.1.0",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.1.1"
    },
    "npm:aurelia-task-queue@1.2.1": {
      "aurelia-pal": "npm:aurelia-pal@1.8.0"
    },
    "npm:aurelia-templating-binding@1.4.1": {
      "aurelia-binding": "npm:aurelia-binding@1.7.1",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-templating": "npm:aurelia-templating@1.7.0"
    },
    "npm:aurelia-templating-resources@1.6.0": {
      "aurelia-binding": "npm:aurelia-binding@1.7.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.2.1",
      "aurelia-templating": "npm:aurelia-templating@1.7.0"
    },
    "npm:aurelia-templating-router@1.3.1": {
      "aurelia-binding": "npm:aurelia-binding@1.7.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-router": "npm:aurelia-router@1.5.0",
      "aurelia-templating": "npm:aurelia-templating@1.7.0"
    },
    "npm:aurelia-templating@1.7.0": {
      "aurelia-binding": "npm:aurelia-binding@1.7.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.2.1"
    },
    "npm:aurelia-testing@1.0.0-beta.4.0.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.2",
      "aurelia-framework": "npm:aurelia-framework@1.2.0",
      "aurelia-logging": "npm:aurelia-logging@1.4.0",
      "aurelia-pal": "npm:aurelia-pal@1.8.0",
      "aurelia-templating": "npm:aurelia-templating@1.7.0"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@5.1.0": {
      "base64-js": "npm:base64-js@1.3.0",
      "ieee754": "npm:ieee754@1.1.11"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:dropzone@5.4.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:fast-json-stable-stringify@2.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:i18next-fetch-backend@0.0.1": {
      "i18next-xhr-backend": "npm:i18next-xhr-backend@1.5.1"
    },
    "npm:i18next@9.1.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:intl@1.2.5": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:json-schema-traverse@0.3.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:jwt-decode@2.2.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:leaflet-geocoder-mapzen@1.8.0": {
      "leaflet": "npm:leaflet@1.3.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:leaflet-search@2.3.7": {
      "leaflet": "npm:leaflet@1.3.1"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.10": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
