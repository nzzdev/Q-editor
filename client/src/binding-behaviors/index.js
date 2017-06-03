export function configure(frameworkConfiguration) {
  frameworkConfiguration
    .globalResources('./AsyncBindingBehavior.js')
    .globalResources('./TimeAgoBindingBehavior.js');
}
