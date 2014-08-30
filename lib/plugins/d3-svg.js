var createSVG;

createSVG = require('../utilities/create-svg');

module.exports = {

  initialize: function() {

    $svg = createSVG(this.document, this.el);
    this.svg = svg = d3.select($svg);

  }

}