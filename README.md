# Q Editor [![Build Status](https://travis-ci.com/nzzdev/Q-editor.svg?branch=dev)](https://travis-ci.com/nzzdev/Q-editor) [![Greenkeeper badge](https://badges.greenkeeper.io/nzzdev/Q-editor.svg)](https://greenkeeper.io/)

**Maintainer**: [manuelroth](https://github.com/manuelroth)

This is the editor for the Q Toolbox. To make use of Q editor you will also need a [Q server](https://nzzdev.github.io/Q-server/).
Here you find some technical documentation to get your own Q editor running.

Q editor works in all evergreen browser.

Demo: https://editor.q.tools

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## Installation

```
git clone git@github.com:nzzdev/Q-editor.git
cd ./Q-editor
npm install
npm run build
```

## Configuration

### env

See the file `client/env`. This is loaded for development only and "fakes" the environment served by the Q server part on production:

```
{
  "QServerBaseUrl": "http://localhost:3001",
  "loginMessage": "some text to be shown on the login screen",
  "devLogging": true,
  "pushState": false
}
```

where `QServerBaseUrl` is a url to a running [Q server](https://github.com/nzzdev/Q-server).
Start one locally or use your staging environment. You probably do not want to develop using your production Q server.

### Configuration of features

Apart from the ENV variables mentioned above, Q editor gets its configuration from the Q server. You need a running [Q server](https://nzzdev.github.io/Q-server/) now so head over to https://nzzdev.github.io/Q-server/install.html if you haven't already. This is what you can configure in `config/editorConfig.js` of your Q server implementation:

```js
const editorConfig = {
  languages: [ // an array of languages, if more that one is configured, Q editor will show a language switcher
    {
      key: 'de',
      label: 'de'
    },
    {
      key: 'en',
      label: 'en'
    }
  ],
  departments: [ // every item is assign one department. These are used for the filtering on the overview.
    "International",
    "Economics",
    "Sport"
  ],
  lowNewItems: {   // if there are not enough graphics, M will appear instead of Q. This is used to configure 'not enough'.
    threshold: 21, // less than that many new items..
    days: 7        // in the last days are considered 'not enough'
  },
  itemList: {
    itemsPerLoad: 18 // how many items to load per step (load more) on item overview
  },
  schemaEditor: {
    latLngLayerConfig: { // if you use schema-editor-lat-lng this is the layer config for Leaflet
      url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
      config: {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
      }
    }
  },
  help: { // configuration for the help dialog. this has no localization support for now :-(
    intro: 'some text that can contain html', // shown on top of the dialog
    faq: [ // a list of questions and answers shown below the intro
      {
        question: 'What is this?',
        answer: 'This is a Storytelling Toolbox'
      },
      {
        question: 'Why?',
        answer: 'Because there is more than letters.'
      }
    ]
  },
  stylesheets: [ // a list of stylesheets to load in addition to the default styles. Use this to load your theme if you do not like our design
    {
      url: ''
    },
  ],
  metaInformation: {
    // if articlesWithItem is given Q-editor makes a GET request to the endpoint on Q-server (if path, you can provide url instead) and expects a json array like this
    // [
    //  {
    //    title: '', // this string will be the text of the link to the url
    //    url: '', // url to the article
    //    publicationDate: '', // something Date.parse() understands
    //    publicationLastUpdated: '' // something Date.parse() understands
    //  }
    // ]
    articlesWithItem: {
      endpoint: {
        path: 'meta/articles-with-item/{id}'
      }
    }
  },
  uiBehavior: {
    useItemDialogToActivate: true // if false, item is directly activatable from tool-status-bar (default: true)
    askBeforeEditIfActive: { // if given the editor will ask users before editing an active item that was last editor longer than lastEditSecondsThreshold before
      lastEditSecondsThreshold: 60 * 60 * 6 // 6 hours
    }
  },
  eastereggs: { // there are some eastereggs in Q. provide the urls to the soundfiles here. We do not distribute them because we do not have the copyright for the tunes we use at NZZ.
    sounds: {
      m: '', // played if M is visible and user hovers her
      q: '', // played/paused if user types Shift+Q
      bondTheme: '' // played if user types Shift+0 Shift+0 Shift+7
    }
  },
  previewSizes: {
    // The previewSizes object allows to define custom sizes for the preview. The size object defines the width in px (value) and the localized label names (label_locales)
    small: {
      value: 290,
      label_locales: {
        de: "Mobile",
        en: "Mobile"
      }
    },
    medium: {
      value: 560,
      label_locales: {
        de: "Artikelbreite",
        en: "Content"
      }
    },
    large: {
      value: 800,
      label_locales: {
        de: "Volle Breite",
        en: "Full"
      }
    }
  }
}
```

Q Editor uses the tools configuration from the Q Server to search for items of the configured tools in the database and check their availability using availabilityChecks to e.g. make a tool available only for specific roles like configured below. This is what you can configure in the `editor` property of any tool configured in `config.tools` of your Q Server config:

```js
  {
    label_locales: {
      de: 'Label de',
      en: 'Label en',
    },
    availabilityChecks: [
      {
        type: 'UserHasRole',
        role: 'any-role-the-user-needs'
      }
    ],
    icon: 'svg string used as the tool icon'
  }
```

#### Notifications

Q Editor allows to display notifications to support users while creating charts. A notification is triggered by a notification-check (see `client/src/resources/notification-checks` for more details). In order to show a notification a configuration in the following form needs to be added to the tool's schema:

```json
{
  "title": "Daten",
  "type": "array",
  "Q:type": "table",
  "Q:options": {
    "notificationChecks": [
      {
        "type": "EmptyData",
        "config": {
          "fields": ["data"]
        },
        "priority": {
          "type": "low",
          "value": 1
        }
      },
      {
        "type": "ToolEndpoint",
        "config": {
          "endpoint": "notification/shouldBeBarChart",
          "data": ["data", "options.chartType"],
          "options": {
            "limit": 2
          }
        },
        "priority": {
          "type": "medium",
          "value": 3
        }
      }
    ]
  }
}
```

#### Availability Checks

Q-Editor allows to hide certains editor elements based on checks. This is used for example in the charts tool. Only the options specific to a chart type (line, bar ect.) are shown and all other options are hidden.

Hideing an editor element is triggered by an availability-check (see `client/src/resources/availability-checks` for more details). In order to hide an editor element a configuration in the following form needs to be added to the tool's schema:

```json
{
  "title": "Allgemeine Optionen",
  "type": "object",
  "properties": {
    "chartType": {
      "title": "Diagrammtyp",
      "type": "string",
      "Q:options": {
        "availabilityChecks": [
          {
            "type": "ToolEndpoint",
            "config": {
              "endpoint": "option-availability/chartType",
              "fields": ["vegaSpec"]
            }
          }
        ]
      }
    }
  }
}
```

There are three types of availability-checks:

- UserHasRole: Used to hide editor elements based on a role save on the user object

```json
{
  "type": "UserHasRole",
  "config": {
    "role": "expert-chart"
  }
}
```

- ItemHasId: Used to hide editor elements until an id is present on the item object:

```json
{
  "type": "ItemHasId",
  "config": {
    "unavailableMessage": "Bitte speichere deinen Titel um fortzufahren."
  }
}
```

- ToolEndpoint: Used to perform an availability-check inside the tool
  - `endpoint` defines which endpoint in the tool should be called
  - `fields` defines which parts of the item should be sent as part of the request

```json
{
  "type": "ToolEndpoint",
  "config": {
    "endpoint": "option-availability/chartType",
    "fields": ["vegaSpec"]
  }
}
```

#### Dynamic Schema

Dynamic Schema allows you to alter the schema for a specific property based on dynamic data. This is for example used in the charts tool to change the maxItems of an array based on the data

```json
"highlightDataSeries": {
  "title": "Hervorhebungen von Datenreihen",
  "type": "array",
  "Q:options": {
    "dynamicSchema": {
      "type": "ToolEndpoint",
      "config": {
        "endpoint": "dynamic-schema/highlighDataSeries",
        "fields": ["data"]
      }
    }
  }
}
```

The endpoint in the tool returns JSON like this:

```javascript
{
  maxItems: item.data[0].length - 2; // the number of data series - 1
}
```

This will result in the maxItems property set in the `highlightDataSeries` object. You can use this feature to set any properties in the schema. Whatever you return from the endpoint will be deep merged with the existing schema.
Use this feature to implement the deprecated functionality from `dynamicEnum`.

#### Dynamic Enums (DEPRECATED, will be removed in Q-editor 5.0)

Dynamic Enums allow to create a selection element (select menu, radio button) based on dynamic data. This is for example used in the charts tool to select a column that should be highlighted. The titles in the select menu are based on the data entered by the user.

A select element based on dynamic data can be created by adding the following configuration to the tool's schema:

```json
{
  "title": "Hervorhebung",
  "type": "number",
  "Q:options": {
    "dynamicEnum": {
      "type": "ToolEndpoint",
      "config": {
        "endpoint": "dynamic-enum/highlightDataSeries",
        "fields": ["data"]
      }
    }
  }
}
```

## Development

Q editor consists of two parts:

- the server part
- the client part

The server part is a small webserver built on [hapijs](https://hapijs.com/) that serves the client files and the ENV variables at `/env` endpoint.
The client part is a web application built on [Aurelia](http://aurelia.io). This is were most of the work is done.

Q editor communicates with the endpoints provided by a Q server directly.

For development you can run the client part without the server part:
You need [Node.js](https://nodejs.org/) and `npm`.
When you have this installed running the following commands in the root of this project should give you a working environment.

```
npm install -g jspm
cd client
npm install
jspm install
```

After that you can start a live reloading webserver by running `gulp watch` within the folder `client`.

## Testing

The `e2e`-tests for Q Editor are in [this repository](https://github.com/nzzdev/Q-automated-tests) and made with [Cypress](https://www.cypress.io/).

[to the top](#table-of-contents)

## Deployment

We provide automatically built docker images for Q editor at https://hub.docker.com/r/nzzonline/q-editor/.
You have three options for deployment:

- use the provided images
- build your own docker images
- deploy the service using another technology

### Use the provided docker images

1. Deploy `nzzonline/q-editor` to a docker environment
2. You can set the following ENV variables
   - `PORT`: defaults to `8080`, the port Q editor will be listening on
   - `Q_SERVER_BASE_URL`: required, the url to a running [Q server](https://nzzdev.github.io/Q-server/)
   - `LOGIN_MESSAGE`: defaults to `null`, a string that is displayed on the login screen
   - `DEV_LOGGING`: defaults to `false`, if `true` lots of console log messages will appear
   - `PUSH_STATE`: defaults to `true`, if `true` the editor will use nice urls without `#` but needs server support (so it's only used for production, for development `#` is used)

### Build your own docker images / deploy using another technology

If you choose to build your own docker image or deploy it some other way make sure that you run `cd client && npm install && jspm install && gulp export` to build the client.

[to the top](#table-of-contents)

## License

Copyright (c) 2019 Neue Zürcher Zeitung. All rights reserved.

This software is published under the MIT license.
