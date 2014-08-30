module.exports =
function D3PieGraph(chart) {
  
  var arc, color, innerRadius, layers, options, radius;
  options = chart.options;
  radius = options.radius;
  options.plugins.unshift('d3-layers');
  options.plugins.unshift('d3-svg');
  
  if (!options['inner-radius']) options['inner-radius'] = 0;
  innerRadius = options['inner-radius'];

  return {

    setup: function() {

      this.arc = arc = d3.svg.arc().outerRadius(radius).innerRadius(innerRadius);
      this.pie = pie = d3.layout.pie().sort(null).value(function(d) { return d.value; });

    },

    paint: function() {

      layers = this.layers;
      layers.wrapper = this.svg.append('g')
        .attr("transform", 'translate('+radius+','+radius+')')
        .selectAll('g')
        .data(pie(this.data))
        .enter();

    },

    plot: function() {

      layers.group = layers.wrapper.append('g').attr('class', 'pie-wedge');
      layers.arc = layers.group.append("path").attr("d", arc);
      layers.text = layers.group.append("text")
        .attr("transform", function(datum) { return "translate(" + arc.centroid(datum) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(datum) { return datum.value; });

    }
  }
}
