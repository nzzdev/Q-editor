const env = {
  QServerBaseUrl: process.env.Q_SERVER_BASE_URL,
  devLogging: process.env.DEV_LOGGING || false,
  pushState: process.env.PUSH_STATE || true
}

module.exports = {
  method: 'GET',
  path: '/env',
  handler: function(request, reply) {
    return reply(env);
  }
}
