module.exports = {
  method: 'GET',
  path: '/favicon.png',
  handler: {
    file: process.env.PLAYGROUND ? './client/favicon-playground.png' : './client/favicon.png'
  }
}
