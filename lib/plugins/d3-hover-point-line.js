module.exports = {
  
  setup: function() {
    this.hijackPlot = true;
  },

  plot: function() {
    var scales, layers;

    scales = this.scales;
    layers = this.layers;

    layers.circle = layers.point.append('circle')
      .attr('r', this.options.radius)
      .attr('cx', function(datum) { return scales.x(datum.x)+'%'; })
      .attr('cy', function(datum) { return scales.y(datum.y)+'%'; });

    layers.line = layers.point.append('line')
      .attr('class', 'hover-line')
      .attr('x1', function(datum) { return scales.x(datum.x)+'%'; })
      .attr('x2', function(datum) { return scales.x(datum.x)+'%'; })
      .attr('y1', '0%')
      .attr('y2', '100%');

  }

}