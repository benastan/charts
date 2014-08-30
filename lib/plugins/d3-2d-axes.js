module.exports = {

  paint: function() {

    var layers, scales, svg;

    layers = this.layers;
    scales = this.scales;
    svg = this.svg;

    layers.axes = {};

    layers.axes.x = svg.append('line')
      .attr('class', 'x-axis')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', scales.y(0)+'%')
      .attr('y2', scales.y(0)+'%');
      
    layers.axes.y = svg.append('line')
      .attr('class', 'y-axis')
      .attr('x1', scales.x(0)+'%')
      .attr('x2', scales.x(0)+'%')
      .attr('y1', '0%')
      .attr('y2', '100%');

  }

}
