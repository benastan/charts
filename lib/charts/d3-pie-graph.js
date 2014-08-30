function minAndMax(data, property) {
  var min, max;
  min = d3.min(data, function(datum) { datum.property });
  max = d3.max(data, function(datum) { datum.property });
  return [min, max]
}

module.exports = function(chart) {
  
  var $svg, arc, color, data, document, el, innerRadius, layeres, options, padding, parentNode, radius, svg;
  el = chart.el;
  data = chart.data;
  options = chart.options;
  document = chart.document;
  radius = options.radius;
  
  if (!options['inner-radius']) options['inner-radius'] = 0;
  innerRadius = options['inner-radius'];

  return {

    setup: function() {

      $svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
      parentNode = el.parentNode;
      parentNode.appendChild($svg);
      parentNode.insertBefore(el, $svg);
      
      this.svg = svg = d3.select($svg);

      this.arc = arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(innerRadius);

      this.pie = pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    },

    paint: function() {

      this.layers = layers = {};

      layers.base = svg.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', '#ffffff');

      layers.wrapper = svg.append('g')
        .attr("transform", 'translate('+radius+','+radius+')')
        .selectAll('g')
        .data(pie(data))
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
