const fs = require("fs");
const envfile = require("envfile");
const path = require("path");

const env = envfile.parse(
  fs.readFileSync(path.join(__dirname, "../.env"), "utf8")
);

function writeEnv(env) {
  fs.writeFileSync(path.join(__dirname, "../.env"), envfile.stringify(env));
}

module.exports = {
  env,
  writeEnv,
};
