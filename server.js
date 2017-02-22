const Hapi = require('hapi');
const Path = require('path');

const server = new Hapi.Server({
  // connections: {
  //   routes: {
  //     files: {
  //       relativeTo: Path.join(__dirname, 'public')
  //     }
  //   }
  // }
});

server.connection({
  port: process.env.PORT || 8080
});

module.exports = server;
