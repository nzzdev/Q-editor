const env = {
  QServerBaseUrl: process.env.Q_SERVER_BASE_URL,
  loginMessage: process.env.LOGIN_MESSAGE || null,
  devLogging: process.env.DEV_LOGGING || false,
  pushState: process.env.PUSH_STATE || true
};

if (process.env.PLAYGROUND) {
  env.playground = process.env.PLAYGROUND;
}

module.exports = {
  method: "GET",
  path: "/env",
  handler: function(request, h) {
    return env;
  }
};
