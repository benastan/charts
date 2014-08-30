var plugins;

plugins = {};

module.exports = function(pluginName, plugin) {
  if (pluginName && plugin) plugins[pluginName] = plugin;
  return plugins;
}