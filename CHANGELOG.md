# 1.3.0 (27.6.2017)
- feat: show articles with item in item-overview if configured in server (new `editorConfig.metaInformation.articlesWithItem`)
- feat: do not show item-dialog on activate but activate directly from tool-status-bar (new `editorConfig.uiBehavior.useItemDialogToActivate`)
- fix: change in schema-editor-color triggers reload of preview
- fix: options pane in editor is scrollable if it is higher than viewport
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