# 6.4.5 (08.12.2021)

- fix: (aurelia-dialog) don't close the dialog window when clicking outside of it

# 6.4.4 (26.08.2021)

- fix: (schema-editor-table) The conversion from comma to point now only applies to numeric values (before strings with numeric values in them were also affected).

# 6.4.3 (25.08.2021)

- fix: (files) Multiple uploaded files can now properly be deleted

# 6.4.2 (25.08.2021)

- fix: (notifications) Notifications are now correctly sorted by their given priority (0 = lowest priority, 10 = highest priority)

# 6.4.1 (12.05.2021)

- fix: (schema-editor-number) Prevent value change on wheel event

# 6.4.0 (22.04.2021)

- feat: (ToolEndpointChecker) Send roles with every toolEndpoint request. This allows to use the roles information to calculate toolEndpoint results

# 6.3.8 (25.03.2021)

- fix: (schema-editor-files) Send credentials with `/file` request

# 6.3.7 (22.03.2021)

- fix: (preview) Use encodeURIComponent instead of encodeURI to encode toolRuntimeConfig in renderingInfo request so that reserved characters are getting encoded

# 6.3.6 (15.03.2021)

- fix: makes sure that cookies are sent with authentication requests to q-server

# 6.3.5 (12.03.2021)

- fix: makes sure that cookies are sent with authentication requests to q-server

# 6.3.4 (10.02.2021)

- fix: (schema-editor-color) show input as text input
- fix: (schema-editor-array) Improve styles of schema-editor-array\_\_entry-container--compact

# 6.3.3 (05.01.2021)

- fix: (notifications) allow empty responses of ToolEndpoint requests

# 6.3.2 (16.12.2020)

- fix: (schema-editor-table) ignore rows/columns which differ of range of predefinedValues
- fix: (dynamic-schema) apply default values which are defined in dynamicSchema

# 6.3.1 (20.08.2020)

- fix: (schema-editor-table) don't modify predefined content in order to make readOnly cells work

# 6.3.0 (09.07.2020)

- feat: (schema-editor-table) readOnly cells and predefined content

# 6.2.6 (02.06.2020)

- fix: Options are not applied in geojson and bbox schema-editor components

# 6.2.5 (29.04.2020)

- fix: Preview loads item twice on page load of item overview page

# 6.2.4 (19.02.2020)

- fix: Use patched version of handsontable

# 6.2.3 (30.01.2020)

- feat: (schema-editor-geojson-point) Use maptiler geocoder

# 6.2.2 (25.01.2020)

- fix: (editor-page) If item id is not available yet, back button should point to index page

# 6.2.1 (24.01.2020)

- fix: (schema-editor-geojson-point) Implement change detection of coordinate property

# 6.2.0 (22.01.2020)

- feat: awaits ToolEndpointChecks before rendering the preview
- feat: `schema-editor-bbox` takes an optional bounds property
- feat: `schema-editor-geojson` increases search input debounce value to one second

# 6.1.4 (16.12.2019)

- feat: change preview padding from 16px to 24px

# 6.1.3 (06.11.2019)

- fix: preview not visible if too many displayOptions in livingdocs-component

# 6.1.2 (28.10.2019)

- fix: show only the selected tools also if the users config still contains tools that are not available anymore

# 6.1.1 (22.10.2019)

- fix: chaing the renderingInfo when using image type renderingInfo works in the preview-container now.
- fix: add spacing between multiple export buttons on item overview page

# 6.1.0 (17.10.2019)

- feat: use new display-options route in livingdocs-component which makes display-options more configurable

# 6.0.1 (14.10.2019)

- fix: correctly append extension to filename on export

# 6.0.0 (09.10.2019)

- feat: Q-server@9 changes the route /export-options-schema to /display-options-schema. Q-editor@6.0.0 export dialog is compatible with this.
- fix: UX improvements for schema-editor-geojson
- use node@12 for the Docker container

# 5.1.0 (03.10.2019)

- feat: allow navigating between editor and item overview page directly using the back button (Q logo is in header on all pages, clicking it navigates to the index page)

# 5.0.1 (27.09.2019)

- fix: load stylesheets of the schema-editor-code component

# 5.0.0 (23.09.2019)

- breaking: The schemaEditorConfig has a new key `shared` which stores config properties shared for multiple schema-editor components. The schema-editor-geojson component reads its config properties now from this shared namespace.
- feature: A new schema-editor component called `schema-editor-bbox` which allows to enter a bounding box. The bounding box is stored as an array of [minX, minY, maxX, maxY] values
- feature: New component `schema-editor-dialog`. It allows to open a part of the schema in a dialog. The Q-tool can define a `Q:options` property `openInDialog` to define that a subtree of the schema should be opened in a dialog
- feature: Reimplemented the schema-editor component `schema-editor-geojson` using mapbox-gl-js and autocomplete.js to improve the user experience

# 4.1.1 (09.09.2019)

- fix: export dialog takes content-type into account for file extension
- fix: slugified item title is part of the filename in the export dialog

# 4.1.0 (06.09.2019)

- feat: exportable targets. targets configured as exportable get a button on the item-overview page opening a modal allowing to download the renderingInfo of this target
- feat: buttons take an isLoading parameter to show a spinner when they are busy
- fix: if the user has no default preview target defined through the publication config, the first available target is used for the preview

# 4.0.3 (18.07.2019)

- fix: load the additional editor stylesheets (used to load fonts needed for previews) in livingdocs-component.html to show a correct preview
- fix: show the add element button in schema-editor-array if the array value is null

# 4.0.2 (01.07.2019)

- fix: show array entry add button if maxItems is defined but array is not yet defined
- fix: show delete buttons next to form inputs in compact array layout

# 4.0.1 (27.06.2019)

- fix: do not apply notificationChecks and availabilityChecks more than once, forbid them in dynamicSchema

# 4.0.0 (26.06.2019)

- breaking: The support for the deprecated config style for AvailabilityChecks and NotificationChecks is removed. All config needs to follow the new style according to the docs in README
- feature: `dynamicSchema` is a new property in `Q:options` in the JSON schema for schema-editor. It allows to dynamically alter the schema based on data. See README for details.
- feature: schema-editor-object schemas support `expandable: true` in `Q:options` resulting in the object property inputs being hidden at first, expandable by a button (as is already supported for array entries)
- feature: `Q:options.buttonLabel` can be used on array properties to define the label used on the add/delete buttons
- feature: visual hierarchy is improved in the options pane
- feature: improve the login error messages in case the server request times out and remove the message if the browser is not Chrome (since all evergreen browsers are supported by now)
- deprecated: `dynamicEnum` is deprecated and will be removed in v5. Use the new `dynamicSchema` to implement the same functionality.

# 3.8.2 (22.01.2019)

- fix: preview container doesn't grow in height across it's container anymore

# 3.8.1 (09.01.2019)

- fix: fix showing unavailableMessage

# 3.8.0 (17.12.2018)

- feat: new page /tasks: Q server can configure tasks that take json schema based data as input to perform a task. This page provides the UI for this feature.

# 3.7.1 (03.12.2018)

- fix: load css codemirror module
- fix: fix default binding for objects on schema-editor to not fail if top level object is undefined (e.g. new options property on item)

# 3.7.0 (21.11.2018)

- feature: new schema-editor-code (`"Q:type": "code"`) using codemirror to show a code editor, currently supports javascript and html mime types.
- feature: `appendItemToPayload` is used appended to the request for `display-options-schema.json` in livingdocs-component if tool config sets `hasDynamicDisplayOptions` to true.

# 3.6.1 (19.11.2018)

- fix: fix inserting graphics from tools without displayOptions with livingdocs-component

# 3.6.0 (14.11.2018)

- feature: required notifications in editor are shown using the notification system instead of browser native notification
- feature: availability-checks, notification-checks and dynamic-enum config format is unified (see README for examples)
- fix: schema-editor-files handles thumbnail correctly if no file type is given
- refactor: livingdocs-component code is now much cleaner

# 3.5.3 (24.10.2018)

- fix: trim all cells in schema-editor-table when data is pasted or edited by hand

# 3.5.2 (19.10.2018)

- fix: blueprinting of items with arrays of objects with types using implicit properties (`files`) works now.

# 3.5.1 (10.10.2018)

- fix: availability-checks should run when ever the schema changes

# 3.5.0 (10.10.2018)

- feat: Livingdocs Component now uses schema-editor for the displayOptions form. This means that you can use all the same features in the displayOptions schema. One Exception: The UserRole availability check is not available as the user is not authenticated in this screen.
- feat: When a new graphic is saved for the first time, the id gets appended to the URL.
- fix: When an item that has generated ids in it's data ('Q:defaults': 'generateId' in schema) the id gets properly regenerated when the item is used as a blueprint.

# 3.4.0 (13.09.2018)

- feat: meta editor in schema-editor-table: tool schema can enable and configure this in Q:options. The structure for the cell metadata is defined in a json-schema and will lead to a form visible when a cell is selected.

# 3.3.0 (28.08.2018)

- feat: preview loader can load renderingInfo.sophieModules (configure sophie.buildServiceBaseUrl in editor config in your Q server instance, see https://github.com/nzzdev/sophie-build-service for details regarding Sophie)
- feat: schema-editor-files sets the fullPath as the filename when uploading directories
- fix: schema-editor-files loads thumbnail for existing files only for images
- fix: allow to copy 10000 rows and 100 columns from schema-editor-table handsontable
- fix: do not fail if options for schema-editor-textarea and schema-editor-url are given in schema

# 3.2.0 (27.07.2018)

- feat: bind minimum and maximum properties from schema on schema-editor-number input element
- fix: improve the layout of /feed page

# 3.1.0 (09.07.2018)

- feat: HEAD_MARKUP, BODY_START_MARKUP and BODY_END_MARKUP env variables can be used to inject markup into index.html
- fix: livingdocs-preview correctly handles defaults defined in display-options-schema.json

# 3.0.5 (05.07.2018)

- fix: do not allow two concurrent save requests
- fix: do not translate undefined for schema-editor strings

# 3.0.4 (29.06.2018)

- fix: schema translation properly works
- fix: "no items" message is not shown while loading
- fix: items do not appear twice in items list for search with few results
- fix: properly support new object in schema that is not defined in existing item data

# 3.0.3 (28.06.2018)

- fix: disable schema translations because of problems with dynamic enums, needs proper fix

# 3.0.2 (27.06.2018)

- fix: livingdocs-preview works correctly when opened with configured item
- fix: dynamicEnum works for translated schema

# 3.0.1 (27.06.2018)

- fix: user menu opens even if the user has no config stored yet

# 3.0.0 (27.06.2018)

- feat: notificationChecks, Q Editor can show notifications in the schema-editor to help the user enter correct data. These checks are configured in the tools schema.json
- feat: tool-selection can no be configured by the user and the order can be based on the users usage (needs Q-server >= 5)
- feat: item-list on index page contains a menu per item to delete/edit/blueprint directly
- refresh the overall visual appearance
- improvement: item-preview widths are now configurable together with min-height per width
- improvement: tool schema translation translates placeholder in Q:options as well
- fix: schema-editor-table allows to copy 10000 rows now
- breaking: some CSS custom property names changed
- breaking: translations for tools and editor config are separated (reflected in Q-server@5)

# 2.3.0 (29.05.2018)

- feat: schema-editor-table minRows is now configurable via Q:options in schema.json
- fix: schema-editor takes the whole width and expands rows to do so
- fix: schema-editor-table cells do not wrap the content
- fix/feat: schema-editor-object sets data to empty object if undefined. this allows to add new objects to the schema without running a migration on existing item
- fix: set the target to the preview-container in the feed page to see the preview on the correct background
- fix: escape handsontable textarea from styling rules targeting textareas in schema-editor
- update several dependencies

# 2.2.0 (04.05.2018)

- feat: fixed navigation bar on top
- feat: item list entries are now links and can be opened in a new tab
- feat: schema-editor-table table header is shown and columns are resizable

# 2.1.0 (23.04.2018)

- feat: users can delete items they created (powerusers can still delete all items)
- improvement: schema-editor-table uses handsontable 2.0.0, column-width is increased, scrollbar thumb is wider
- fix: meta-editor annotation input change triggers unsaved state
- fix: preview-container doesn't fail if first stylesheet is from a browser extension
- update: node to 9.11.1, aurelia-pal to 1.8.0

# 2.0.1 (10.04.2018)

- fix: load dropzone stylesheet

# 2.0.0 (06.04.2018)

- feature: use new /search endpoint of Q-server instead of building lucene query in the editor (needs Q-server >= 5.0.0)
- deprecated feature removed: schema-editor-lat-lng (use schema-editor-geojson-point)
- deprecated feature removed: onlyRoles config in tool is removed (use availabilityChecks)
- deprecated feature removed: publications need to be configured for the publication filter to work, publication filter is not built from configured targets anymore

# 1.8.1 (01.03.2018)

- fix: install node modules within Docker to not fail if built on another platform

# 1.8.0 (01.03.2018)

- update hapi to 17.2.1 and node to 9.6
- feature: show a confirm dialog before editing if item is active (configurable in editorconfig delivered from server)
- fix: make brotli compression work by depending on brok plugin

# 1.7.2 (14.02.2018)

- fix: do not try to parse the cookie to not fail on broken one as no cookie is needed

# 1.7.1 (30.01.2018)

- fix: display dropzone message in singular form if only one image is allowed

# 1.7.0 (17.01.2018)

- feat: schema-editor new type `files` using Q-server files plugin to upload files and store file information on item
- feat: schema-editor input fields allow placeholder to be defined via Q:options in schema.json
- feat: schema-editor-table allows to hide transpose button via Q:options configuration
- feat: schema-editor-geojson-point uses opencagedata as a geocoding provider for the map search (because mapzen is shutting down)
- feat: users acronym is stored with every new item (editable in meta-editor) to be displayed by tools in the footer
- fix: preview background is correctly applied when configured in publication context config
- fix: use correct target in preview container in livingdocs-component
- fix: buttons have the correct type attribute
- fix: meta-editor changes trigger saved state update and fetch of rendering-info
- updates: aurelia, hapi, node updated to latest versions

# 1.6.0 (19.12.2017)

- feat: item ID in /feed links to editor for this item
- fix: scripts with document.getElementById work now in preview
- fix: username input is focused on login page load
- fix: all notifications are closable by click

# 1.5.3 (6.11.2017)

- fixes for json schema handling

# 1.5.2 (2.11.2017)

- fix: schema-editor-array does not fail if given data is not an Array

# 1.5.1 (2.11.2017)

- fix: meta-editor now uses translation files for ui strings
- fix: schema-editor-array uses correct schema for array entry editor in case default value objects validate against multiple schemas
- fix: preview container element gets more unique name to not clash with styles applied from target context

# 1.5.0 (12.10.2017)

- feat: publication filter. If any publications are configured on the Q-server, the editor now provides a publication filter in the item list and allows for publication selection in the preview screen by using the target defined as the `previewTarget` in the config.
- feat: preview background color defaults to white and can be configured by target
- feat: item list and item overview now shows the user that created an item next to the one who last edited it
- fix: geojson-point editor handles required attributes on coordinates correctly

# 1.4.0 (7.7.2017)

- feat: search now looks in id and subtitle properties as well
- fix: toolNotAvailable message is now correctly translated
- fix: links to articles in item metadata list now open in new tab

# 1.3.2 (29.6.2017)

- fix: schema-editor-array makes data an array if undefined before trying to push (now really fixed)

# 1.3.1 (27.6.2017)

- fix: schema-editor-array makes data an array if undefined before trying to push

# 1.3.0 (27.6.2017)

- feat: show articles with item in item-overview if configured in server (new `editorConfig.metaInformation.articlesWithItem`)
- feat: do not show item-dialog on activate but activate directly from tool-status-bar (new `editorConfig.uiBehavior.useItemDialogToActivate`)
- fix: change in schema-editor-color triggers reload of preview
- fix: options pane in editor is scrollable if it is higher than viewport
- fix: item gets assigned department "default" if user has no department in her meta information
- checkAvailability decorator uses WeakMap instead of obfuscated properties on the schema-editor-x element

# 1.2.0 (9.6.2017)

- feat: livingdocs-component app (view to select/configure/embed item within Livingdocs Editor)
- feat: dynamicEnum option (asking remote endpoint for enums based on current data)
- feat: availabilityChecks to show/hide properties in schema-editor (ItemHasId, UserHasRole, ToolEndpoint)
- feat: handle token based authentication
- feat: schema-editor-color (input type color)
- feat: schema-editor-table (using handsontable)
- feat: schema-editor-select option to show radio buttons instead of dropdown
- feat: renderingInfo.isPure set to true for previews to tell tool not to save anything happening in the preview (used by quiz)
- feat: hidden /feed page showing all graphics sorted by last edit
- fix: redirect to correct url after login
- several other fixes and small improvements

# 1.1.1 (29.3.2017)

- fix: items filter translations
- fix: schema-editor visual spacing
- fix: preview translation

# 1.1.0 (29.3.2017)

- feature: adds geojson-point, json and textarea schema-editor types
- feature: Handles oneOf in array schema-editor by providing different buttons per type
- feature: translates tool schema titles and enum_titles if translation file provided by tool
- feature: do not load scripts in preview that have loadInEditorPreview set to false
- fix: i18n of tool filter
- fix: use correct locale for relative time
- fix: make filters work by using correct user attributes
- fix: deep clone the default before assigning if its an object on generation from schema
- fix: sets false as default value when generating default object from tool schema
- fix: copy jspm_packages to correct path in Docker container
- fix: use schemaEditorConfig for geojson in schema-editor-geojson
- fix: editor checks validity of form and optionForm before saving
- fix: generateFromSchema handles default value for object correctly
- deprecates: schema-editor-lat-lng
- some visual improvements

# 1.0.1 (23.3.2017)

- fix: correct required attribute handling for several schema-editor types

# 1.0.0 (19.3.2017)

- initial released version
