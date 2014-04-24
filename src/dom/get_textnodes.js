wysihtml5.dom.getTextNodes = function(node){
  var all = [];
  for (node=node.firstChild;node;node=node.nextSibling){
    if (node.nodeType==3) {
        all.push(node);
    } else {
        all = all.concat(wysihtml5.dom.getTextNodes(node));
    }
  }
  return all;
};