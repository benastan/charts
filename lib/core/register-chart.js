var charts;

charts = {};

module.exports = function(chartName, chartBuilder) {
  if (chartName && chartBuilder) charts[chartName] = chartBuilder;
  return charts;
}