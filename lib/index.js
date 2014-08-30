var document, config, options, root, charts, plugins, initializeChart, registerChart, refreshCharts, _slice;

initializeChart = require('./core/initialize-chart');
refreshCharts = require('./core/refresh-charts');
registerChart = require('./core/register-chart');
registerPlugin = require('./core/register-plugin');
_slice = require('./utilities/slice');
config = require('./core/config');

root = window || global;
options = root.chartsOptions || {};

if (! options.document) options.document = root.document;
if (! options.chartsSelector) options.chartsSelector = 'chart';

document = options.document;
config(options);

charts = {}
plugins = {}

module.exports = {
  refreshCharts: refreshCharts,
  initializeChart: initializeChart,
  registerChart: registerChart,
  registerPlugin: registerPlugin
};
