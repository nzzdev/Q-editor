module.exports = [
  {
    method: 'GET',
    path: '/jspm_packages/{path*}',
    handler: {
      directory: {
        path: './client/export/jspm_packages',
        redirectToSlash: true,
        index: true
      }
    }
  },
  {
    method: 'GET',
    path: '/config.js',
    handler: {
      file: './client/export/config.js'
    }
  }
]
