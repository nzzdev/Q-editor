export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('elements/atoms')
    .feature('binding-behaviors')
    .feature('value-converters')
  ;

  aurelia.start().then(a => a.setRoot('cms-component-app/app'));
}
