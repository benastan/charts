var ChartRegistry, PluginRegistry;

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

module.exports = 
function buildChart(chartConfig) {
  var builder, plugins;
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

  chartConfig.el.addEventListener('update', function() {
    chart.wipe();
    chart.plot();
  });
}
