wysihtml5.quirks.tableCellsSelection = (function() {
  
  var dom = wysihtml5.dom,
      selectionStart = null,
      selctionEnd = null,
      editable = null,
      selection_class = "wysiwyg-tmp-selected-cell",
      moveHandler = null,
      upHandler = null,
      startTable = null;
  
  function handleSelectionMousedown (target, element) {
    selectionStart = target;
    editable = element;
    startTable = dom.getParentElement(selectionStart, { nodeName: ["TABLE"] });
    
    if (startTable) {
      removeCellSelections();
      dom.addClass(target, selection_class);
      moveHandler = dom.observe(editable, "mousemove", handleMouseMove);
      upHandler = dom.observe(editable, "mouseup", handleMouseUp);
    }
  }
  
  // remove all selection classes
  function removeCellSelections () {
      if (editable) {
          var selectedCells = editable.querySelectorAll('.' + selection_class);
          if (selectedCells.length > 0) {
            for (var i = 0; i < selectedCells.length; i++) {
                dom.removeClass(selectedCells[i], selection_class);
            }
          }
      }
  }
  
  function addSelections (cells) {
    for (var i = 0; i < cells.length; i++) {
      dom.addClass(cells[i], selection_class);
    }
  }
  
  function handleMouseMove (event) {
    var curTable = null,
        cell = dom.getParentElement(event.target, { nodeName: ["TD","TH"] }),
        selectedCells;
        
    if (cell && startTable && selectionStart && selectionStart != cell) {
      curTable =  dom.getParentElement(cell, { nodeName: ["TABLE"] });
      if (curTable && curTable === startTable) {
        removeCellSelections();
        selectedCells = dom.table.getCellsBetween(selectionStart, cell);
        addSelections(selectedCells);
        
        
        /*if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }*/
      }
    }
  }
  
  function handleMouseUp (event) {
    moveHandler.stop();
    upHandler.stop();
    setTimeout(function() {
      var sideClickHandler = dom.observe(editable.ownerDocument, "click", function() {
        sideClickHandler.stop();
        removeCellSelections();
      });
    });
  }
  
  return handleSelectionMousedown;

})();

