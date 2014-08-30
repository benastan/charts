var registerPlugin;
registerPlugin = require('../core/register-plugin');
registerPlugin('d3-svg', require('./d3-svg'));
registerPlugin('d3-layers', require('./d3-layers'));
registerPlugin('d3-2d-axes', require('./d3-2d-axes'));
registerPlugin('d3-hover-point-line', require('./d3-hover-point-line'));
