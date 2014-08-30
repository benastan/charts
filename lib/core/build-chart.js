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
  chart.setup();
  runPluginHooks('setup', plugins, chart);
  chart.paint();
  runPluginHooks('paint', plugins, chart);
  chart.plot();
  runPluginHooks('plot', plugins, chart);
  chartConfig.el.addEventListener('update', function() {
    chart.wipe();
    chart.plot();
  });
}
