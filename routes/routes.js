module.exports = [require("./env"), require("./locales"), require("./favicon")]
  .concat(require("./jspm_packages"))
  .concat(require("./index"))
  .concat(require("./default"));
