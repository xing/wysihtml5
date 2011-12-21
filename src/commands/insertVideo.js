(function(wysihtml5) {
  var NODE_NAME = "IFRAME";
  
  wysihtml5.commands.insertVideo = {
    /**
     * @example
     *    // either ...
     *    wysihtml5.commands.insertVideo.exec(element, "insertVideo", "http://www.google.de/logo.jpg");
     *    // ... or ...
     *    wysihtml5.commands.insertVideo.exec(element, "insertVideo", { src: "http://www.google.de/logo.jpg", width: "400"... });
     */
    exec: function(element, command, value) {
      value = typeof(value) === "object" ? value : { src: value };
      var doc   = element.ownerDocument,
          video = this.state(element),
          i,
          parent;

      if (video) {
        // Video already selected, set the caret before it and delete it
        wysihtml5.selection.setBefore(video);
        parent = video.parentNode;
        parent.removeChild(video);

        // and it's parent <a> too if it hasn't got any other relevant child nodes
        wysihtml5.dom.removeEmptyTextNodes(parent);
        if (parent.nodeName === "A" && !parent.firstChild) {
          wysihtml5.selection.setAfter(parent);
          parent.parentNode.removeChild(parent);
        }

        // firefox and ie sometimes don't remove the video handles, even though the video was removed
        wysihtml5.quirks.redraw(element);
        return;
      }

      video = doc.createElement(NODE_NAME);

      for (i in value) {
        video[i] = value[i];
      }

      wysihtml5.selection.insertNode(video);
      wysihtml5.selection.setAfter(video);
    },

    state: function(element) {
      var doc = element.ownerDocument,
          selectedNode,
          text,
          videosInSelection;

      if (!wysihtml5.dom.hasElementWithTagName(doc, NODE_NAME)) {
        return false;
      }

      selectedNode = wysihtml5.selection.getSelectedNode(doc);
      if (!selectedNode) {
        return false;
      }

      if (selectedNode.nodeName === NODE_NAME) {
        // This works perfectly in IE
        return selectedNode;
      }

      if (selectedNode.nodeType !== wysihtml5.ELEMENT_NODE) {
        return false;
      }

      text = wysihtml5.selection.getText(doc);
      text = wysihtml5.lang.string(text).trim();
      if (text) {
        return false;
      }

      videosInSelection = wysihtml5.selection.getNodes(doc, wysihtml5.ELEMENT_NODE, function(node) {
        return node.nodeName === "IFRAME";
      });

      if (videosInSelection.length !== 1) {
        return false;
      }

      return videosInSelection[0];
    },

    value: function(element) {
      var video = this.state(element);
      return video && video.src;
    }
  };
}(wysihtml5));