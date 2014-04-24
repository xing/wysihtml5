wysihtml5.commands.insertUnorderedList = {
  exec: function(composer, command) {
    var doc           = composer.doc,
        selectedNode  = composer.selection.getSelectedNode(),
        list          = wysihtml5.dom.getParentElement(selectedNode, { nodeName: "UL" }),
        otherList     = wysihtml5.dom.getParentElement(selectedNode, { nodeName: "OL" }),
        tempClassName =  "_wysihtml5-temp-" + new Date().getTime(),
        isEmpty,
        tempElement;

    // do not count list elements outside of composer
    if (list && !composer.element.contains(list)) {
      list = null;
    }
    if (otherList && !composer.element.contains(otherList)) {
      otherList = null;
    }

    if (!list && !otherList && composer.commands.support(command)) {
      doc.execCommand(command, false, null);
      return;
    }

    if (list) {
      // Unwrap list
      // <ul><li>foo</li><li>bar</li></ul>
      // becomes:
      // foo<br>bar<br>
      composer.selection.executeAndRestore(function() {
        wysihtml5.dom.resolveList(list, composer.config.useLineBreaks);
      });
    } else if (otherList) {
      // Turn an ordered list into an unordered list
      // <ol><li>foo</li><li>bar</li></ol>
      // becomes:
      // <ul><li>foo</li><li>bar</li></ul>
      composer.selection.executeAndRestore(function() {
        wysihtml5.dom.renameElement(otherList, "ul");
      });
    } else {
      // Create list
      composer.selection.executeAndRestoreRangy(function() {
        tempElement = composer.selection.deblockAndSurround({
          "nodeName": "div",
          "className": tempClassName
        });

        // This space causes new lists to never break on enter 
        var INVISIBLE_SPACE_REG_EXP = /\uFEFF/g;
        tempElement.innerHTML = tempElement.innerHTML.replace(INVISIBLE_SPACE_REG_EXP, "");
        
        if (tempElement) {
          isEmpty = tempElement.innerHTML === "" || tempElement.innerHTML === wysihtml5.INVISIBLE_SPACE || tempElement.innerHTML === "<br>";
          list = wysihtml5.dom.convertToList(tempElement, "ul", composer.parent.config.uneditableContainerClassname);
          if (isEmpty) {
            composer.selection.selectNode(list.querySelector("li"), true);
          }
        }
      });
    }
  },

  state: function(composer) {
    var selectedNode = composer.selection.getSelectedNode(),
        node = wysihtml5.dom.getParentElement(selectedNode, { nodeName: "UL" });

    return (composer.element.contains(node) ? node : false);
  }
};
