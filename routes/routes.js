module.exports = 
[
  require('./env'),
  require('./locales'),
  require('./favicon')
]
.concat(require('./editor-routes-to-index'))
.concat([require('./default')])
