System.config({
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  map: {
    "@mapbox/mapbox-gl-draw": "npm:@mapbox/mapbox-gl-draw@1.1.2",
    "@tarekraafat/autocomplete.js": "npm:@tarekraafat/autocomplete.js@6.1.0",
    "@turf/bbox": "npm:@turf/bbox@6.0.1",
    "@turf/bbox-polygon": "npm:@turf/bbox-polygon@6.0.1",
    "@turf/helpers": "npm:@turf/helpers@6.1.4",
    "ajv": "npm:ajv@5.5.2",
    "array2d": "npm:array2d@0.0.5",
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.4",
    "aurelia-authentication": "npm:aurelia-authentication@3.8.3",
    "aurelia-binding": "npm:aurelia-binding@2.3.1",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@2.3.3",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
    "aurelia-dialog": "npm:aurelia-dialog@1.1.0",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.3",
    "aurelia-fetch-client": "npm:aurelia-fetch-client@1.8.2",
    "aurelia-framework": "npm:aurelia-framework@1.3.1",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.4.0",
    "aurelia-i18n": "npm:aurelia-i18n@2.3.2",
    "aurelia-loader": "npm:aurelia-loader@1.0.2",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.2.1",
    "aurelia-logging": "npm:aurelia-logging@1.5.2",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.1.1",
    "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
    "aurelia-notification": "npm:aurelia-notification@1.1.0",
    "aurelia-pal": "npm:aurelia-pal@1.8.2",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.8.1",
    "aurelia-path": "npm:aurelia-path@1.1.3",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.3.4",
    "aurelia-router": "npm:aurelia-router@1.7.1",
    "aurelia-task-queue": "npm:aurelia-task-queue@1.3.3",
    "aurelia-templating": "npm:aurelia-templating@1.10.2",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.5.3",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.11.0",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.4.0",
    "aurelia-testing": "npm:aurelia-testing@1.0.0",
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "codemirror": "npm:codemirror@5.41.0",
    "core-js": "npm:core-js@1.2.7",
    "css": "github:systemjs/plugin-css@0.1.37",
    "dropzone": "npm:dropzone@5.5.1",
    "file-saver": "npm:file-saver@2.0.2",
    "get-value": "npm:get-value@3.0.1",
    "handsontable": "github:handsontable/handsontable@5.0.2",
    "i18next": "npm:i18next@9.1.0",
    "i18next-fetch-backend": "npm:i18next-fetch-backend@0.0.1",
    "mapbox-gl": "npm:mapbox-gl@1.1.1",
    "mime-db": "npm:mime-db@1.41.0",
    "mixin-deep": "npm:mixin-deep@2.0.0",
    "moment": "npm:moment@2.22.0",
    "set-value": "npm:set-value@3.0.0",
    "slugify": "npm:slugify@1.3.5",
    "text": "github:systemjs/plugin-text@0.0.8",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.5.0"
    },
    "github:jspm/nodelibs-buffer@0.1.1": {
      "buffer": "npm:buffer@5.2.1"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.4",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
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
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
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
    "github:jspm/nodelibs-zlib@0.1.0": {
      "browserify-zlib": "npm:browserify-zlib@0.1.4"
    },
    "npm:@mapbox/geojson-area@0.2.2": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "wgs84": "npm:wgs84@0.0.0"
    },
    "npm:@mapbox/geojson-coords@0.0.0": {
      "@mapbox/geojson-normalize": "npm:@mapbox/geojson-normalize@0.0.1",
      "geojson-flatten": "npm:geojson-flatten@0.2.4"
    },
    "npm:@mapbox/geojson-extent@0.3.2": {
      "@mapbox/extent": "npm:@mapbox/extent@0.4.0",
      "@mapbox/geojson-coords": "npm:@mapbox/geojson-coords@0.0.0",
      "rw": "npm:rw@0.1.4",
      "traverse": "npm:traverse@0.6.6"
    },
    "npm:@mapbox/geojson-rewind@0.4.0": {
      "@mapbox/geojson-area": "npm:@mapbox/geojson-area@0.2.2",
      "concat-stream": "npm:concat-stream@1.6.2",
      "minimist": "npm:minimist@1.2.0",
      "sharkdown": "npm:sharkdown@0.1.1"
    },
    "npm:@mapbox/geojson-types@1.0.2": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:@mapbox/geojsonhint@2.2.0": {
      "concat-stream": "npm:concat-stream@1.6.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "jsonlint-lines": "npm:jsonlint-lines@1.7.1",
      "minimist": "npm:minimist@1.2.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "vfile": "npm:vfile@4.0.1",
      "vfile-reporter": "npm:vfile-reporter@5.1.2"
    },
    "npm:@mapbox/jsonlint-lines-primitives@2.0.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:@mapbox/mapbox-gl-draw@1.1.2": {
      "@mapbox/geojson-area": "npm:@mapbox/geojson-area@0.2.2",
      "@mapbox/geojson-extent": "npm:@mapbox/geojson-extent@0.3.2",
      "@mapbox/geojson-normalize": "npm:@mapbox/geojson-normalize@0.0.1",
      "@mapbox/geojsonhint": "npm:@mapbox/geojsonhint@2.2.0",
      "@mapbox/point-geometry": "npm:@mapbox/point-geometry@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "hat": "npm:hat@0.0.3",
      "lodash.isequal": "npm:lodash.isequal@4.5.0",
      "mapbox-gl": "npm:mapbox-gl@1.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "xtend": "npm:xtend@4.0.2"
    },
    "npm:@mapbox/mapbox-gl-supported@1.4.1": {
      "mapbox-gl": "npm:mapbox-gl@1.1.1"
    },
    "npm:@mapbox/vector-tile@1.3.1": {
      "@mapbox/point-geometry": "npm:@mapbox/point-geometry@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:@mapbox/whoots-js@3.1.0": {
      "http": "github:jspm/nodelibs-http@1.7.1",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:@turf/bbox-polygon@6.0.1": {
      "@turf/helpers": "npm:@turf/helpers@6.1.4"
    },
    "npm:@turf/bbox@6.0.1": {
      "@turf/helpers": "npm:@turf/helpers@6.1.4",
      "@turf/meta": "npm:@turf/meta@6.0.2"
    },
    "npm:@turf/meta@6.0.2": {
      "@turf/helpers": "npm:@turf/helpers@6.1.4",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:JSV@4.0.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
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
    "npm:assert@1.5.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.4": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-templating": "npm:aurelia-templating@1.10.2"
    },
    "npm:aurelia-api@3.2.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-fetch-client": "npm:aurelia-fetch-client@1.8.2",
      "aurelia-framework": "npm:aurelia-framework@1.3.1",
      "aurelia-path": "npm:aurelia-path@1.1.3",
      "extend": "npm:extend@3.0.2"
    },
    "npm:aurelia-authentication@3.8.3": {
      "aurelia-api": "npm:aurelia-api@3.2.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.3",
      "aurelia-fetch-client": "npm:aurelia-fetch-client@1.8.2",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-path": "npm:aurelia-path@1.1.3",
      "aurelia-router": "npm:aurelia-router@1.7.1",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.11.0",
      "extend": "npm:extend@3.0.2",
      "jwt-decode": "npm:jwt-decode@2.2.0"
    },
    "npm:aurelia-binding@2.3.1": {
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.3.3"
    },
    "npm:aurelia-bootstrapper@2.3.3": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.3",
      "aurelia-framework": "npm:aurelia-framework@1.3.1",
      "aurelia-history": "npm:aurelia-history@1.2.1",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.4.0",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.2.1",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.1.1",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.8.1",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.3.4",
      "aurelia-router": "npm:aurelia-router@1.7.1",
      "aurelia-templating": "npm:aurelia-templating@1.10.2",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.5.3",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.11.0",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.4.0"
    },
    "npm:aurelia-dependency-injection@1.4.2": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2"
    },
    "npm:aurelia-dialog@1.1.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-templating": "npm:aurelia-templating@1.10.2"
    },
    "npm:aurelia-event-aggregator@1.0.3": {
      "aurelia-logging": "npm:aurelia-logging@1.5.2"
    },
    "npm:aurelia-fetch-client@1.8.2": {
      "aurelia-pal": "npm:aurelia-pal@1.8.2"
    },
    "npm:aurelia-framework@1.3.1": {
      "aurelia-binding": "npm:aurelia-binding@2.3.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.2",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-path": "npm:aurelia-path@1.1.3",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.3.3",
      "aurelia-templating": "npm:aurelia-templating@1.10.2"
    },
    "npm:aurelia-history-browser@1.4.0": {
      "aurelia-history": "npm:aurelia-history@1.2.1",
      "aurelia-pal": "npm:aurelia-pal@1.8.2"
    },
    "npm:aurelia-i18n@2.3.2": {
      "aurelia-binding": "npm:aurelia-binding@2.3.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.3",
      "aurelia-loader": "npm:aurelia-loader@1.0.2",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-templating": "npm:aurelia-templating@1.10.2",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.11.0",
      "i18next": "npm:i18next@9.1.0",
      "intl": "npm:intl@1.2.5"
    },
    "npm:aurelia-loader-default@1.2.1": {
      "aurelia-loader": "npm:aurelia-loader@1.0.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2"
    },
    "npm:aurelia-loader@1.0.2": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-path": "npm:aurelia-path@1.1.3"
    },
    "npm:aurelia-logging-console@1.1.1": {
      "aurelia-logging": "npm:aurelia-logging@1.5.2"
    },
    "npm:aurelia-metadata@1.0.6": {
      "aurelia-pal": "npm:aurelia-pal@1.8.2"
    },
    "npm:aurelia-notification@1.1.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-i18n": "npm:aurelia-i18n@2.3.2",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "extend": "npm:extend@3.0.2",
      "humane-js": "npm:humane-js@3.2.2"
    },
    "npm:aurelia-pal-browser@1.8.1": {
      "aurelia-pal": "npm:aurelia-pal@1.8.2"
    },
    "npm:aurelia-polyfills@1.3.4": {
      "aurelia-pal": "npm:aurelia-pal@1.8.2"
    },
    "npm:aurelia-route-recognizer@1.3.2": {
      "aurelia-path": "npm:aurelia-path@1.1.3"
    },
    "npm:aurelia-router@1.7.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.3",
      "aurelia-history": "npm:aurelia-history@1.2.1",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-path": "npm:aurelia-path@1.1.3",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.3.2"
    },
    "npm:aurelia-task-queue@1.3.3": {
      "aurelia-pal": "npm:aurelia-pal@1.8.2"
    },
    "npm:aurelia-templating-binding@1.5.3": {
      "aurelia-binding": "npm:aurelia-binding@2.3.1",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-templating": "npm:aurelia-templating@1.10.2"
    },
    "npm:aurelia-templating-resources@1.11.0": {
      "aurelia-binding": "npm:aurelia-binding@2.3.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.2",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-path": "npm:aurelia-path@1.1.3",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.3.3",
      "aurelia-templating": "npm:aurelia-templating@1.10.2"
    },
    "npm:aurelia-templating-router@1.4.0": {
      "aurelia-binding": "npm:aurelia-binding@2.3.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-path": "npm:aurelia-path@1.1.3",
      "aurelia-router": "npm:aurelia-router@1.7.1",
      "aurelia-templating": "npm:aurelia-templating@1.10.2"
    },
    "npm:aurelia-templating@1.10.2": {
      "aurelia-binding": "npm:aurelia-binding@2.3.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.2",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.6",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-path": "npm:aurelia-path@1.1.3",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.3.3"
    },
    "npm:aurelia-testing@1.0.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-framework": "npm:aurelia-framework@1.3.1",
      "aurelia-logging": "npm:aurelia-logging@1.5.2",
      "aurelia-pal": "npm:aurelia-pal@1.8.2",
      "aurelia-templating": "npm:aurelia-templating@1.10.2"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:browserify-zlib@0.1.4": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "pako": "npm:pako@0.2.9",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readable-stream": "npm:readable-stream@2.3.6",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:buffer-from@1.1.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:buffer@5.2.1": {
      "base64-js": "npm:base64-js@1.3.0",
      "ieee754": "npm:ieee754@1.1.13"
    },
    "npm:cardinal@0.4.4": {
      "ansicolors": "npm:ansicolors@0.2.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "redeyed": "npm:redeyed@0.4.4",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:chalk@0.4.0": {
      "ansi-styles": "npm:ansi-styles@1.0.0",
      "has-color": "npm:has-color@0.1.7",
      "strip-ansi": "npm:strip-ansi@0.1.1"
    },
    "npm:codemirror@5.41.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:concat-stream@1.6.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "buffer-from": "npm:buffer-from@1.1.1",
      "inherits": "npm:inherits@2.0.4",
      "readable-stream": "npm:readable-stream@2.3.6",
      "typedarray": "npm:typedarray@0.0.6"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:dropzone@5.5.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:earcut@2.1.5": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:esm@3.0.84": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:esprima@1.0.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:fast-json-stable-stringify@2.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:geojson-flatten@0.2.4": {
      "get-stdin": "npm:get-stdin@6.0.0",
      "minimist": "npm:minimist@1.2.0"
    },
    "npm:geojson-vt@3.2.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:get-stdin@6.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:get-value@3.0.1": {
      "isobject": "npm:isobject@3.0.1"
    },
    "npm:has-color@0.1.7": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:has-flag@3.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
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
    "npm:inherits@2.0.4": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:intl@1.2.5": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:is-buffer@2.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:is-plain-object@2.0.4": {
      "isobject": "npm:isobject@3.0.1"
    },
    "npm:isarray@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:json-schema-traverse@0.3.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:jsonlint-lines@1.7.1": {
      "JSV": "npm:JSV@4.0.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "nomnom": "npm:nomnom@1.8.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:jwt-decode@2.2.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:lodash.isequal@4.5.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:mapbox-gl@1.1.1": {
      "@mapbox/geojson-rewind": "npm:@mapbox/geojson-rewind@0.4.0",
      "@mapbox/geojson-types": "npm:@mapbox/geojson-types@1.0.2",
      "@mapbox/jsonlint-lines-primitives": "npm:@mapbox/jsonlint-lines-primitives@2.0.2",
      "@mapbox/mapbox-gl-supported": "npm:@mapbox/mapbox-gl-supported@1.4.1",
      "@mapbox/point-geometry": "npm:@mapbox/point-geometry@0.1.0",
      "@mapbox/tiny-sdf": "npm:@mapbox/tiny-sdf@1.1.1",
      "@mapbox/unitbezier": "npm:@mapbox/unitbezier@0.0.0",
      "@mapbox/vector-tile": "npm:@mapbox/vector-tile@1.3.1",
      "@mapbox/whoots-js": "npm:@mapbox/whoots-js@3.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "csscolorparser": "npm:csscolorparser@1.0.3",
      "earcut": "npm:earcut@2.1.5",
      "esm": "npm:esm@3.0.84",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "geojson-vt": "npm:geojson-vt@3.2.1",
      "gl-matrix": "npm:gl-matrix@3.0.0",
      "grid-index": "npm:grid-index@1.1.0",
      "minimist": "npm:minimist@0.0.8",
      "murmurhash-js": "npm:murmurhash-js@1.0.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "pbf": "npm:pbf@3.2.0",
      "potpack": "npm:potpack@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "quickselect": "npm:quickselect@2.0.0",
      "rw": "npm:rw@1.3.3",
      "supercluster": "npm:supercluster@6.0.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "tinyqueue": "npm:tinyqueue@2.0.3",
      "vt-pbf": "npm:vt-pbf@3.1.1",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:mime-db@1.41.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:nomnom@1.8.1": {
      "chalk": "npm:chalk@0.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "underscore": "npm:underscore@1.6.0"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:pako@0.2.9": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pbf@3.2.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "ieee754": "npm:ieee754@1.1.13",
      "resolve-protobuf-schema": "npm:resolve-protobuf-schema@2.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:process-nextick-args@2.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.10": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:protocol-buffers-schema@3.3.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.4",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:readable-stream@2.3.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.4",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "process-nextick-args": "npm:process-nextick-args@2.0.1",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "npm:string_decoder@1.1.1",
      "util-deprecate": "npm:util-deprecate@1.0.2"
    },
    "npm:redeyed@0.4.4": {
      "esprima": "npm:esprima@1.0.4",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:replace-ext@1.0.0": {
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:resolve-protobuf-schema@2.1.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "protocol-buffers-schema": "npm:protocol-buffers-schema@3.3.2"
    },
    "npm:rw@0.1.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:rw@1.3.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:safe-buffer@5.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:set-value@3.0.0": {
      "is-plain-object": "npm:is-plain-object@2.0.4"
    },
    "npm:sharkdown@0.1.1": {
      "cardinal": "npm:cardinal@0.4.4",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "minimist": "npm:minimist@0.0.5",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "split": "npm:split@0.2.10"
    },
    "npm:split@0.2.10": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "through": "npm:through@2.3.8",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.4",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string-width@2.1.1": {
      "is-fullwidth-code-point": "npm:is-fullwidth-code-point@2.0.0",
      "strip-ansi": "npm:strip-ansi@4.0.0"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:string_decoder@1.1.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:strip-ansi@0.1.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:strip-ansi@4.0.0": {
      "ansi-regex": "npm:ansi-regex@3.0.0"
    },
    "npm:supercluster@6.0.2": {
      "kdbush": "npm:kdbush@3.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:supports-color@5.5.0": {
      "has-flag": "npm:has-flag@3.0.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:through@2.3.8": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:unist-util-stringify-position@2.0.1": {
      "@types/unist": "npm:@types/unist@2.0.3"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util-deprecate@1.0.2": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vfile-message@2.0.1": {
      "@types/unist": "npm:@types/unist@2.0.3",
      "unist-util-stringify-position": "npm:unist-util-stringify-position@2.0.1"
    },
    "npm:vfile-reporter@5.1.2": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "repeat-string": "npm:repeat-string@1.6.1",
      "string-width": "npm:string-width@2.1.1",
      "supports-color": "npm:supports-color@5.5.0",
      "unist-util-stringify-position": "npm:unist-util-stringify-position@2.0.1",
      "vfile-sort": "npm:vfile-sort@2.2.1",
      "vfile-statistics": "npm:vfile-statistics@1.1.3"
    },
    "npm:vfile@4.0.1": {
      "@types/unist": "npm:@types/unist@2.0.3",
      "is-buffer": "npm:is-buffer@2.0.3",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "replace-ext": "npm:replace-ext@1.0.0",
      "unist-util-stringify-position": "npm:unist-util-stringify-position@2.0.1",
      "vfile-message": "npm:vfile-message@2.0.1"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:vt-pbf@3.1.1": {
      "@mapbox/point-geometry": "npm:@mapbox/point-geometry@0.1.0",
      "@mapbox/vector-tile": "npm:@mapbox/vector-tile@1.3.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "pbf": "npm:pbf@3.2.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});