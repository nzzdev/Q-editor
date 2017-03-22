export function configure(frameworkConfiguration) {
  frameworkConfiguration
    .globalResources('./DotNotationPropertyValueConverter.js')
    .globalResources('./ForceNumberValueConverter.js')
    .globalResources('./JsonValueConverter.js')
    .globalResources('./KeysValueConverter.js')
    .globalResources('./TimeAgoValueConverter.js');
}
