module.exports = {
  method: 'GET',
  path: '/locales/{path*}',
  handler: {
    directory: {
      path: './client/locales',
      redirectToSlash: true,
      index: true
    }
  }
}
