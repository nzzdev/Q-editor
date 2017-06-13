const defaultBundle = [
  "**/*.js",
  "**/*.html!text",
  "**/*.css!text",
  "text",
  "css",
]

const resourcesBundle = [
  "resources/*.js"
]

const editorBundle = [
  "pages/editor.js",
  "pages/editor.html!text",
  "elements/schema-editor/*.js",
  "elements/schema-editor/*.html!text",
  "elements/schema-editor/*.css!text",
  "elements/item-preview/*.js",
  "elements/item-preview/*.html!text",
  "elements/item-preview/*.css!text",
  "elements/organisms/tool-status-bar.js",
  "elements/organisms/tool-status-bar.html!text",
  "elements/organisms/tool-status-bar.css!text"
]

const aureliaBundle = [
  "aurelia-animator-css",
  "aurelia-binding",
  "aurelia-binding",
  "aurelia-bootstrapper",
  "aurelia-dependency-injection",
  "aurelia-dialog",
  "aurelia-event-aggregator",
  "aurelia-fetch-client",
  "aurelia-framework",
  "aurelia-history-browser",
  "aurelia-i18n",
  "aurelia-loader",
  "aurelia-loader-default",
  "aurelia-logging",
  "aurelia-logging-console",
  "aurelia-metadata",
  "aurelia-pal",
  "aurelia-path",
  "aurelia-polyfills",
  "aurelia-router",
  "aurelia-task-queue",
  "aurelia-templating",
  "aurelia-templating-binding",
  "aurelia-templating-resources",
  "aurelia-templating-router",
  "i18next-fetch-backend",
  "aurelia-notification",
  "aurelia-authentication"
]

module.exports = {
  "bundles": {
    "dist/aurelia": {
      "includes": aureliaBundle,
      "options": {
        "inject": true,
        "minify": false,
        "depCache": false,
        "rev": true
      }
    },
    "dist/resources": {
      "includes": resourcesBundle,
      "excludes": aureliaBundle,
      "options": {
        "inject": true,
        "minify": false,
        "depCache": false,
        "rev": true
      }
    },
    "dist/q-bundle": {
      "includes": defaultBundle,
      "excludes": editorBundle
                  .concat(aureliaBundle)
                  .concat(resourcesBundle),
      "options": {
        "inject": true,
        "minify": false,
        "depCache": true,
        "rev": true
      }
    },
    "dist/q-editor-bundle": {
      "includes": editorBundle,
      "excludes": aureliaBundle
                  .concat(resourcesBundle),
      "options": {
        "inject": true,
        "minify": false,
        "depCache": true,
        "rev": true
      }
    },
  }
};
