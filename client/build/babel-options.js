var path = require('path');
var paths = require('./paths');

module.exports = function(modules) {
  return {
    filename: '',
    filenameRelative: '',
    sourceMap: true,
    sourceRoot: '',
    moduleRoot: path.resolve('src').replace(/\\/g, '/'),
    moduleIds: false,
    comments: false,
    compact: false,
    code: true,
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-es2015-modules-systemjs'
    ]
  };
};
