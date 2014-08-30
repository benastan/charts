var config;

config = null

module.exports =
function setConfig(options) {
  if (options) config = options;
  return config;
}