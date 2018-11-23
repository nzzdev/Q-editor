const env = {
  headMarkup: process.env.HEAD_MARKUP || "",
  bodyStartMarkup: process.env.BODY_START_MARKUP || "",
  bodyEndMarkup: process.env.BODY_END_MARKUP || ""
};

const fs = require("fs");
const indexFile = fs.readFileSync("./client/export/index.html", {
  encoding: "utf-8"
});
const compiledIndexFileContent = indexFile
  .replace("<!-- HEAD_MARKUP -->", env.headMarkup)
  .replace("<!-- BODY_START_MARKUP -->", env.bodyStartMarkup)
  .replace("<!-- BODY_END_MARKUP -->", env.bodyEndMarkup);

function handler(request, h) {
  return h.response(compiledIndexFileContent).type("text/html");
}

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: handler
  },
  {
    method: "GET",
    path: "/index.html",
    handler: handler
  },
  {
    method: "GET",
    path: "/editor/{path*}",
    handler: handler
  },
  {
    method: "GET",
    path: "/item/{path*}",
    handler: handler
  },
  {
    method: "GET",
    path: "/login/{path*}",
    handler: handler
  },
  {
    method: "GET",
    path: "/feed",
    handler: handler
  },
  {
    method: "GET",
    path: "/tasks",
    handler: handler
  },
  {
    method: "GET",
    path: "/tasks/{path*}",
    handler: handler
  },
  {
    method: "GET",
    path: "/index/{path*}",
    handler: handler
  }
];
