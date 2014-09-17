function Selection(plugin) {

  this.plugin = plugin;
  this.canvas =  this.plugin.layers.base;
  this.start = this.getX();
  this.rect = this.canvas.append('rect');

}

Selection.prototype.update = function() {

  var box, end, start, width, scale;
  
  if (this.stopped) return;

  box = this.canvas.node().getBoundingClientRect();
  end = this.getX() - box.left;
  start = this.start - box.left;
  width = Math.abs(end - start) / box.width * 100;
  
  if (start > end) start = end;
  start = start / box.width * 100;

  this.rect
    .attr('x', start+'%')
    .attr('y', '0%')
    .attr('height', '100%')
    .attr('width', width+'%')
    .attr('fill', 'rgba(42, 130, 176, 0.8)')
    .attr('stroke', 'rgba(27, 107, 148, 1)')
    .attr('stroke-width', '2');

};

Selection.prototype.end = function() { this.stopped = true; };

Selection.prototype.clear = function() {

  this.end();
  this.rect.remove();

};

Selection.prototype.getX = function() { return d3.event.x; }

module.exports = {

  paint: function() {

    var plugin, currentSelection;

    plugin = this;

    function mousedownEvent() {
      if (currentSelection) currentSelection.clear();
      currentSelection = new Selection(plugin);
    }

    function mousemoveEvent() {
      if (currentSelection) currentSelection.update();
    }

    function mouseupEvent() {
      if (currentSelection) currentSelection.end();
    }

    function addEventListeners(element) {
      element.on('mousedown', mousedownEvent);
      element.on('mousemove', mousemoveEvent);
      element.on('mouseup', mouseupEvent);
    }

    addEventListeners(this.layers.base);
    addEventListeners(this.layers.g);

  }

};
