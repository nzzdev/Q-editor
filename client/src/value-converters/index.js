export function configure(frameworkConfiguration) {
  frameworkConfiguration
    .globalResources('./KeysValueConverter.js')
    .globalResources('./TimeAgoValueConverter.js')
}
