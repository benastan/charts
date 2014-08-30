var _slice, config;

_slice = require('../utilities/slice');
config = require('./config');

module.exports =
function initializeChart(chart) {
  var data, options;
  if (!chart.innerHTML) return;
  data = JSON.parse(chart.innerHTML);
  options = {};
  _slice(chart.attributes).forEach(function(attribute) {
    options[attribute.name] = attribute.value;
  });
  if (!options.plugins) options.plugins = '';
  options.plugins = options.plugins.split(',')
  return {
    el: chart,
    data: data,
    options: options,
    document: config().document
  };
}