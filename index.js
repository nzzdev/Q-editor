const Hoek = require('hoek');
const Boom = require('boom');
const server = require('./server.js');
const routes = require('./routes/routes.js');

const plugins = [
  require('inert')
];

server.register(plugins, err => {
  Hoek.assert(!err, err);

  server.route(routes);

  server.start(err => {
    Hoek.assert(!err, err);
    console.log('Server running at: ' + server.info.uri);
  })
});
