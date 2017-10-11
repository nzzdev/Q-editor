module.exports = 
[
  require('./env'),
  require('./locales'),
  require('./favicon')
]
.concat(require('./jspm_packages'))
.concat(require('./editor-routes-to-index'))
.concat([require('./default')])
