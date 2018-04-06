export function configure(frameworkConfiguration) {
  frameworkConfiguration
    .globalResources("./items-filter")
    .globalResources("./items-list.html")
    .globalResources("./meta-editor")
    .globalResources("./q-bar")
    .globalResources("./tool-selection");
  // do not include ./tool-status-bar as it is only used in editor, we do not want to load it upfront
}
