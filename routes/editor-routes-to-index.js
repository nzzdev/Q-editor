module.exports = [
  {
    method: 'GET',
    path: '/editor/{path*}',
    handler: {
      file: './client/index.html'
    }
  },
  {
    method: 'GET',
    path: '/item/{path*}',
    handler: {
      file: './client/index.html'
    }
  },
  {
    method: 'GET',
    path: '/login/{path*}',
    handler: {
      file: './client/index.html'
    }
  },
  {
    method: 'GET',
    path: '/index/{path*}',
    handler: {
      file: './client/index.html'
    }
  }
]
