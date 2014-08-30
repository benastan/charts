var Charts;

Charts = window.Charts = require('.');
window.addEventListener('load', Charts.refreshCharts);
require('./lib/charts');
require('./lib/plugins');
