export function configure(frameworkConfiguration) {
  frameworkConfiguration
    .globalResources('./ForceNumberValueConverter.js')
    .globalResources('./KeysValueConverter.js')
    .globalResources('./TimeAgoValueConverter.js');
}
