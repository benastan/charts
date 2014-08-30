module.exports =
function createSVG(document, el) {

  var $svg, parentNode;
  $svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  parentNode = el.parentNode;
  parentNode.appendChild($svg);
  parentNode.insertBefore(el, $svg);

  return $svg;
}
