(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Charts;

Charts = window.Charts = require('.');
window.addEventListener('load', Charts.refreshCharts);
require('./lib/charts');
require('./lib/plugins');

},{".":2,"./lib/charts":5,"./lib/plugins":16}],2:[function(require,module,exports){
module.exports = require('./lib');
},{"./lib":11}],3:[function(require,module,exports){
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
      layers.wrapper = this.svg.append('g')
        .selectAll('g')
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var registerChart;
registerChart = require('../core/register-chart');
registerChart('d3-line-graph', require('./d3-line-graph'));
registerChart('d3-pie-graph', require('./d3-pie-graph'));

},{"../core/register-chart":9,"./d3-line-graph":3,"./d3-pie-graph":4}],6:[function(require,module,exports){
var config;

config = null

module.exports =
function setConfig(options) {
  if (options) config = options;
  return config;
}
},{}],7:[function(require,module,exports){
var _slice, config, ChartRegistry, PluginRegistry;

ChartRegistry = require('./register-chart')();
PluginRegistry = require('./register-plugin')();

function runPluginHooks(hookName, plugins, chart) {
  plugins.forEach(function(pluginName) {
    var hook, plugin;
    plugin = PluginRegistry[pluginName];
    if (!plugin) return;
    hook = plugin[hookName];
    if (typeof hook !== 'function') return;
    hook.call(chart);
  });
}

_slice = require('../utilities/slice');
config = require('./config');

module.exports =
function initializeChart(chart) {
  var data, options, builder, plugins;
  if (!chart.innerHTML) return;
  data = JSON.parse(chart.innerHTML);
  options = {};
  _slice(chart.attributes).forEach(function(attribute) {
    options[attribute.name] = attribute.value;
  });
  if (!options.plugins) options.plugins = '';
  options.plugins = options.plugins.split(',')
  chartConfig = {
    el: chart,
    data: data,
    options: options,
    document: config().document
  };

  builder = ChartRegistry[chartConfig.options.type];
  if (typeof builder !== 'function') throw 'No such chart builder '+chartConfig.options.type;
  chart = builder(chartConfig);
  plugins = chartConfig.options.plugins;
  
  'document el data options'.split(' ').forEach(function(property) {
    chart[property] = chartConfig[property]
  });
  
  'initialize setup paint plot'.split(' ').forEach(function(phase) {
    if (typeof chart[phase] === 'function') chart[phase]();
    runPluginHooks(phase, plugins, chart);
  });
}

},{"../utilities/slice":18,"./config":6,"./register-chart":9,"./register-plugin":10}],8:[function(require,module,exports){
var config, buildChart, config, initializeChart, _slice;

initializeChart = require('./initialize-chart');
_slice = require('../utilities/slice');
config = require('../core/config');

module.exports =
function refreshCharts() {
  
  var charts;
  charts = _slice(document.querySelectorAll(config().chartsSelector))
  charts.forEach(function(chart) {
    initializeChart(chart);
  });
  
};

},{"../core/config":6,"../utilities/slice":18,"./initialize-chart":7}],9:[function(require,module,exports){
var charts;

charts = {};

module.exports = function(chartName, chartBuilder) {
  if (chartName && chartBuilder) charts[chartName] = chartBuilder;
  return charts;
}
},{}],10:[function(require,module,exports){
var plugins;

plugins = {};

module.exports = function(pluginName, plugin) {
  if (pluginName && plugin) plugins[pluginName] = plugin;
  return plugins;
}
},{}],11:[function(require,module,exports){
(function (global){
var document, config, options, root, charts, plugins, initializeChart, registerChart, refreshCharts, _slice;

initializeChart = require('./core/initialize-chart');
refreshCharts = require('./core/refresh-charts');
registerChart = require('./core/register-chart');
registerPlugin = require('./core/register-plugin');
_slice = require('./utilities/slice');
config = require('./core/config');

root = window || global;
options = root.chartsOptions || {};

if (! options.document) options.document = root.document;
if (! options.chartsSelector) options.chartsSelector = 'chart';

document = options.document;
config(options);

charts = {}
plugins = {}

module.exports = {
  refreshCharts: refreshCharts,
  initializeChart: initializeChart,
  registerChart: registerChart,
  registerPlugin: registerPlugin
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./core/config":6,"./core/initialize-chart":7,"./core/refresh-charts":8,"./core/register-chart":9,"./core/register-plugin":10,"./utilities/slice":18}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
module.exports = {
  
  setup: function() {
      
    var layers, svg;
    svg = this.svg;
    layers = this.layers = {};
    layers.base = svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', '#ffffff');
    
  }

}
},{}],15:[function(require,module,exports){
var createSVG;

createSVG = require('../utilities/create-svg');

module.exports = {

  initialize: function() {

    $svg = createSVG(this.document, this.el);
    this.svg = svg = d3.select($svg);

  }

}
},{"../utilities/create-svg":17}],16:[function(require,module,exports){
var registerPlugin;
registerPlugin = require('../core/register-plugin');
registerPlugin('d3-svg', require('./d3-svg'));
registerPlugin('d3-layers', require('./d3-layers'));
registerPlugin('d3-2d-axes', require('./d3-2d-axes'));
registerPlugin('d3-hover-point-line', require('./d3-hover-point-line'));

},{"../core/register-plugin":10,"./d3-2d-axes":12,"./d3-hover-point-line":13,"./d3-layers":14,"./d3-svg":15}],17:[function(require,module,exports){
module.exports =
function createSVG(document, el) {

  var $svg, parentNode;
  $svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  parentNode = el.parentNode;
  parentNode.appendChild($svg);
  parentNode.insertBefore(el, $svg);

  return $svg;
}

},{}],18:[function(require,module,exports){
module.exports =
function _slice(arr) {
  return Array.prototype.slice.apply(arr);
}
},{}]},{},[1]);
