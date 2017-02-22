module.exports = {
  method: 'GET',
  path: '/favicon.png',
  handler: {
    file: process.env.IS_PLAYGROUND_INSTANCE ? './client/favicon-playground.png' : './client/favicon.png'
  }
}
