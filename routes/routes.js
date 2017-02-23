module.exports = 
[
  require('./env'),
  require('./locales'),
  require('./favicon')
]
.concat(require('./systemjs'))
.concat(require('./editor-routes-to-index'))
.concat([require('./default')])
