var config, buildChart, config, initializeChart, _slice;

initializeChart = require('./initialize-chart');
buildChart = require('./build-chart');
_slice = require('../utilities/slice');
config = require('../core/config');

module.exports =
function refreshCharts() {
  _slice(document.querySelectorAll(config().chartsSelector)).forEach(function(chart) {
    chart = initializeChart(chart);
    buildChart(chart);
  });
};
