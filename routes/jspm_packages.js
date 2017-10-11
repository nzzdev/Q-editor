module.exports = [
  {
    method: 'GET',
    path: '/jspm_packages/npm/{path*}',
    config: {
      cache: {
        expiresIn: 365 * 24 * 60 * 60 * 1000,
        privacy: 'public'
      }
    },
    handler: {
      directory: {
        path: './client/export/jspm_packages/npm',
        redirectToSlash: true,
        index: true
      }
    }
  },
  {
    method: 'GET',
    path: '/jspm_packages/github/{path*}',
    config: {
      cache: {
        expiresIn: 365 * 24 * 60 * 60 * 1000,
        privacy: 'public'
      }
    },
    handler: {
      directory: {
        path: './client/export/jspm_packages/github',
        redirectToSlash: true,
        index: true
      }
    }
  },
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
