const Hapi = require('hapi');
const Path = require('path');

const server = new Hapi.Server({
});

server.connection({
  port: process.env.PORT || 8080
});

module.exports = server;
