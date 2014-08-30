function minAndMax(data, property) {
  var min, max;
  min = d3.min(data, function(datum) { datum.property });
  max = d3.max(data, function(datum) { datum.property });
  return [min, max]
}

function calculatePadding(paddingOption) {
  padding = paddingOption.split(' ');
  if (!padding[1]) padding[1] = padding[0];
  if (!padding[2]) padding[2] = padding[0];
  if (!padding[3]) padding[3] = padding[1];
  return padding;
}

module.exports = function(chart) {
  var $svg, data, document, el, layeres, options, padding, parentNode, ranges, scales, statistics, svg;
  el = chart.el;
  data = chart.data;
  options = chart.options;
  document = chart.document;

  if (!options.radius) options.radius = 3;
  if (!options['padding']) options['padding'] = '5';
  padding = calculatePadding(options['padding']);

  return {
    options: options,

    setup: function() {

      this.ranges = ranges = { x: [], y: [] };
      ranges.y.push(100 - padding[2]);
      ranges.x.push(100 - padding[1]);
      ranges.y.push(padding[0]);
      ranges.x.unshift(padding[3]);

      $svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
      parentNode = el.parentNode;
      parentNode.appendChild($svg);
      parentNode.insertBefore(el, $svg);
      this.svg = svg = d3.select($svg);

      this.statistics = statistics = {};
      statistics.minX = d3.min(data, function(datum) { return datum.x });
      statistics.maxX = d3.max(data, function(datum) { return datum.x });
      statistics.minY = d3.min(data, function(datum) { return datum.y });
      statistics.maxY = d3.max(data, function(datum) { return datum.y });

      this.scales = scales = {};
      scales.x = d3.scale.linear().domain([statistics.minX, statistics.maxX]).range(ranges.x);
      scales.y = d3.scale.linear().domain([statistics.minY, statistics.maxY]).range(ranges.y);

    },

    paint: function() {

      this.layers = layers = {};

      layers.base = svg.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', '#ffffff');

      layers.wrapper = svg.append('g')
        .selectAll('g')
        .data(data)
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
