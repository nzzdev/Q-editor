const Hapi = require("@hapi/hapi");
const routes = require("./routes/routes.js");

const plugins = [require("@hapi/inert")];

let server;

async function start() {
  try {
    const hapiOptions = {
      port: process.env.PORT || 8080,
      load: { sampleInterval: 1000 },
      routes: {
        state: { parse: false, failAction: "log" }
      }
    };

    server = Hapi.server(hapiOptions);

    await server.register(plugins);

    server.route(routes);

    if (process.env.FEATURE_BROTLI) {
      await server.register({
        plugin: require("brok"),
        options: {
          compress: {
            quality: 5
          }
        }
      });
    }

    await server.start();
  } catch (err) {
    // console.log(err.message, err.stack);
    throw err;
  }
}

start()
  .then(() => {
    console.log("hapi server running " + server.info.uri);
  })
  .catch(err => {
    console.error(err, err.stack);
    process.exit(1);
  });

async function gracefullyStop() {
  console.log("stopping hapi server");
  try {
    await server.stop({ timeout: 10000 });
    console.log("hapi server stopped");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

// listen on SIGINT and SIGTERM signal and gracefully stop the server
process.on("SIGINT", gracefullyStop);
process.on("SIGTERM", gracefullyStop);
