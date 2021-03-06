var config, buildChart, config, initializeChart, _slice;

initializeChart = require('./initialize-chart');
buildChart = require('./build-chart');
_slice = require('../utilities/slice');
config = require('../core/config');

module.exports =
function refreshCharts() {
  
  var charts;
  charts = _slice(document.querySelectorAll(config().chartsSelector))
  charts.forEach(function(chart) {
    buildChart(initializeChart(chart));
  });
  
};
