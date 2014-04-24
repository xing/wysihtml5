wysihtml5.dom.getNextElement = function(node){
  var nextSibling = node.nextSibling;
  while(nextSibling && nextSibling.nodeType != 1) {
    nextSibling = nextSibling.nextSibling;
  }
  return nextSibling;
};