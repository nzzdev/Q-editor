# 2.0.0 (xx.04.2018)
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
