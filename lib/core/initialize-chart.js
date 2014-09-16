var _slice, config, ChartRegistry, PluginRegistry;

ChartRegistry = require('./register-chart')();
PluginRegistry = require('./register-plugin')();

function runPluginHooks(hookName, plugins, chart) {
  plugins.forEach(function(pluginName) {
    var hook, plugin;
    plugin = PluginRegistry[pluginName];
    if (!plugin) return;
    hook = plugin[hookName];
    if (typeof hook !== 'function') return;
    hook.call(chart);
  });
}

_slice = require('../utilities/slice');
config = require('./config');

module.exports =
function initializeChart(chart) {
  var data, options, builder, plugins;
  if (!chart.innerHTML) return;
  data = JSON.parse(chart.innerHTML);
  options = {};
  _slice(chart.attributes).forEach(function(attribute) {
    options[attribute.name] = attribute.value;
  });
  if (!options.plugins) options.plugins = '';
  options.plugins = options.plugins.split(',')
  chartConfig = {
    el: chart,
    data: data,
    options: options,
    document: config().document
  };

  builder = ChartRegistry[chartConfig.options.type];
  if (typeof builder !== 'function') throw 'No such chart builder '+chartConfig.options.type;
  chart = builder(chartConfig);
  plugins = chartConfig.options.plugins;
  
  'document el data options'.split(' ').forEach(function(property) {
    chart[property] = chartConfig[property]
  });
  
  'initialize setup paint plot'.split(' ').forEach(function(phase) {
    if (typeof chart[phase] === 'function') chart[phase]();
    runPluginHooks(phase, plugins, chart);
  });
}
