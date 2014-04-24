wysihtml5.dom.getPreviousElement = function(node){
  var nextSibling = node.previousSibling;
  while(nextSibling && nextSibling.nodeType != 1) {
    nextSibling = nextSibling.previousSibling;
  }
  return nextSibling;
};