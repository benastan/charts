function calculatePadding(paddingOption) {

  padding = paddingOption.split(' ');
  if (!padding[1]) padding[1] = padding[0];
  if (!padding[2]) padding[2] = padding[0];
  if (!padding[3]) padding[3] = padding[1];
  return padding;

}

module.exports =
function D3LineGraph(chart) {

  var data, layers, options, padding, scales, statistics;
  options = chart.options;
  options.plugins.unshift('d3-layers');
  options.plugins.unshift('d3-svg');

  if (!options.radius) options.radius = 3;
  if (!options['padding']) options['padding'] = '5';
  padding = calculatePadding(options['padding']);

  return {

    options: options,

    setup: function() {

      data = this.data;
      
      this.statistics = statistics = {};
      statistics.minX = d3.min(data, function(datum) { return datum.x });
      statistics.maxX = d3.max(data, function(datum) { return datum.x });
      statistics.minY = d3.min(data, function(datum) { return datum.y });
      statistics.maxY = d3.max(data, function(datum) { return datum.y });

      this.scales = scales = {};
      scales.x = d3.scale.linear().domain([statistics.minX, statistics.maxX]).range([ padding[3], 100 - padding[1] ]);
      scales.y = d3.scale.linear().domain([statistics.minY, statistics.maxY]).range([ 100 - padding[2], padding[0] ]);

    },

    paint: function() {

      layers = this.layers;
      layers.g = this.svg.append('g')
        .selectAll('g');
      
      layers.wrapper = layers.g
        .data(this.data)
        .enter();

    },

    plot: function() {

      layers.group = layers.wrapper.append('g');
      layers.point = layers.group.append('g').attr('class', 'data-point');
      
      if (this.hijackPlot) return;
      
      layers.circle = layers.point.append('circle')
        .attr('r', options.radius)
        .attr('cx', function(datum) { return scales.x(datum.x)+'%'; })
        .attr('cy', function(datum) { return scales.y(datum.y)+'%'; });

    }
  }
}
