module.exports = {
  
  setup: function() {
      
    var layers, svg;
    svg = this.svg;
    layers = this.layers = {};
    layers.base = svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', '#ffffff');
    
  }

}